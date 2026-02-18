import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertCircle, CreditCard, Lock, Smartphone, RefreshCw, XCircle } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../services/orderService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [paymentPending, setPaymentPending] = useState(false);

    // Mobile Money State
    const [showMobileMoneyForm, setShowMobileMoneyForm] = useState(false);
    const [operator, setOperator] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(orderId);
                // Security check: if already paid, show success directly
                if (data.status === 'paid' || data.status === 'delivered') {
                    setPaymentSuccess(true);
                } else if (data.status === 'failed') {
                    setPaymentFailed(true);
                }
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Commande introuvable.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    // Real-time listener for payment status
    useEffect(() => {
        if (!orderId) return;

        console.log("Setting up snapshot listener for order:", orderId);
        const orderRef = doc(db, "orders", orderId);

        const unsubscribe = onSnapshot(orderRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Real-time update:", data.status);

                if (data.status === 'paid') {
                    setPaymentSuccess(true);
                    setPaymentPending(false);
                    setPaymentFailed(false);
                } else if (data.status === 'failed') {
                    setPaymentFailed(true);
                    setPaymentPending(false);
                    setFormError("Le paiement a échoué ou a été annulé.");
                }
            }
        });

        return () => unsubscribe();
    }, [orderId]);

    const handleMobileMoneyPayment = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!operator) {
            setFormError('Veuillez sélectionner un opérateur.');
            return;
        }
        if (!phoneNumber || phoneNumber.length < 9) {
            setFormError('Veuillez entrer un numéro de téléphone valide.');
            return;
        }

        setProcessing(true);

        try {
            // Format amount based on currency
            let amount = Number(order.paid_amount);
            if (order.currency === 'USD') {
                amount = Number(amount.toFixed(2));
            } else {
                amount = Math.round(amount);
            }

            // Call our Vercel API function
            const response = await fetch('/api/initiate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    amount: amount,
                    currency: order.currency || "CDF", // Use order currency (CDF or USD)
                    operator: operator,
                    phoneNumber: `+243${phoneNumber}`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'initialisation du paiement');
            }

            // Payment initiated successfully
            setPaymentPending(true);
            setShowMobileMoneyForm(false); // Hide form, show pending state

        } catch (err) {
            console.error("Payment initiation failed:", err);
            setFormError(err.message || "Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setProcessing(false);
        }
    };

    const resetPayment = () => {
        setPaymentFailed(false);
        setPaymentPending(false);
        setShowMobileMoneyForm(true);
        setFormError('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-maua-bg flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maua-primary"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-maua-bg flex flex-col justify-center items-center p-4 text-center">
                <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
                <h2 className="text-2xl font-serif font-bold text-maua-dark mb-2">Erreur</h2>
                <p className="text-stone-600 mb-6">{error || "Commande introuvable"}</p>
                <button
                    onClick={() => navigate('/galerie')}
                    className="bg-maua-dark text-white px-6 py-3 rounded-full hover:bg-maua-primary transition-colors"
                >
                    Retour à la boutique
                </button>
            </div>
        );
    }

    return (
        <div className="bg-maua-bg min-h-screen font-sans selection:bg-maua-primary selection:text-white flex flex-col">
            <Navbar />

            <div className="flex-grow pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full">

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-maua-dark mb-8 text-center">
                    Paiement Sécurisé
                </h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 h-fit">
                        <h2 className="text-xl font-bold text-maua-dark mb-4 border-b border-stone-100 pb-2">
                            Récapitulatif
                        </h2>

                        <div className="mb-4">
                            {order.items && order.items.length > 0 ? (
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-stone-800 text-sm">{item.name}</p>
                                                <p className="text-stone-500 text-xs">{item.quantity} x {item.price} {order.currency}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t pt-3 flex justify-between items-center mt-2">
                                        <span className="font-bold text-stone-800">Total</span>
                                        <span className="font-bold text-maua-primary text-lg">{order.paid_amount} {order.currency || "CDF"}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-4 mb-4">
                                    <img
                                        src={order.imageUrl || "/placeholder.jpg"}
                                        alt={order.productName}
                                        className="w-20 h-20 object-cover rounded-lg bg-stone-100"
                                    />
                                    <div>
                                        <h3 className="font-bold text-stone-800">{order.productName}</h3>
                                        <p className="text-maua-primary font-bold text-lg">{order.paid_amount} {order.currency || "CDF"}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 text-sm text-stone-600 bg-stone-50 p-4 rounded-xl">
                            <p><span className="font-bold">Client:</span> {order.customerName}</p>
                            <p><span className="font-bold">Tél:</span> {order.phone}</p>
                            <p><span className="font-bold">Adresse:</span> {order.address}</p>
                        </div>
                    </div>

                    {/* Payment Handlers */}
                    <div className="space-y-6">
                        {paymentSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <Check size={40} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-green-800 mb-2">Paiement Réussi !</h3>
                                    <p className="text-green-700">
                                        Merci pour votre commande. Nous préparons votre livraison.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/galerie')}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                                >
                                    Retour à la boutique
                                </button>
                            </motion.div>
                        ) : paymentFailed ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-6"
                            >
                                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                    <XCircle size={40} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-red-800 mb-2">Échec du paiement</h3>
                                    <p className="text-red-700 mb-2">
                                        La transaction n'a pas pu être finalisée ou a été annulée.
                                    </p>
                                    {formError && <p className="text-red-600 text-sm font-medium">{formError}</p>}
                                </div>
                                <button
                                    onClick={resetPayment}
                                    className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                                >
                                    Réessayer
                                </button>
                            </motion.div>
                        ) : paymentPending ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-blue-50 border border-blue-200 rounded-3xl p-8 text-center space-y-6"
                            >
                                <div className="relative w-20 h-20 mx-auto">
                                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    <Smartphone className="absolute inset-0 m-auto text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-blue-800 mb-2">Paiement en attente</h3>
                                    <p className="text-blue-700">
                                        Veuillez valider la transaction sur votre téléphone.
                                        <br />
                                        <span className="text-sm opacity-80 mt-2 block">Ne fermez pas cette page.</span>
                                    </p>
                                </div>
                            </motion.div>
                        ) : showMobileMoneyForm ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-3xl shadow-lg border border-maua-primary/20"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-maua-dark">Mobile Money</h3>
                                    <button
                                        onClick={() => setShowMobileMoneyForm(false)}
                                        className="text-stone-400 hover:text-stone-600"
                                    >
                                        Fermer
                                    </button>
                                </div>

                                <form onSubmit={handleMobileMoneyPayment} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Opérateur</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['VODACOM_MPESA_COD', 'AIRTEL_COD', 'ORANGE_COD'].map((op) => (
                                                <button
                                                    key={op}
                                                    type="button"
                                                    onClick={() => setOperator(op)}
                                                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${operator === op
                                                        ? 'border-maua-primary bg-maua-primary/10 text-maua-primary'
                                                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                                                        }`}
                                                >
                                                    {op.split('_')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">Numéro de téléphone</label>
                                        <div className="flex items-center gap-2 p-3 border border-stone-200 rounded-xl focus-within:border-maua-primary focus-within:ring-2 focus-within:ring-maua-primary/10 transition-all">
                                            <span className="text-stone-500 font-bold">+243</span>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                                placeholder="999000000"
                                                className="flex-grow outline-none bg-transparent font-medium"
                                                maxLength={9}
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-stone-400 mt-1">Entrez les 9 chiffres après +243</p>
                                    </div>

                                    {formError && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                            {formError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-maua-dark text-white py-4 rounded-xl font-bold hover:bg-maua-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Payer {order.paid_amount} {order.currency || "CDF"}
                                                <Smartphone size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100">
                                <h2 className="text-xl font-bold text-maua-dark mb-6 flex items-center gap-2">
                                    <Lock size={20} className="text-maua-primary" />
                                    Moyen de paiement
                                </h2>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setShowMobileMoneyForm(true)}
                                        className="w-full bg-stone-900 text-white p-4 rounded-xl flex items-center justify-between hover:bg-stone-800 transition-all transform active:scale-95 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-stone-800 p-2 rounded-lg group-hover:bg-stone-700">
                                                <Smartphone size={24} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Mobile Money</div>
                                                <div className="text-xs text-stone-400">M-Pesa, Orange Money, Airtel</div>
                                            </div>
                                        </div>
                                        <span className="font-bold text-stone-400 group-hover:text-white">→</span>
                                    </button>

                                    <button
                                        disabled
                                        className="w-full bg-white border-2 border-stone-100 text-stone-400 p-4 rounded-xl flex items-center justify-between cursor-not-allowed opacity-60"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-stone-50 p-2 rounded-lg text-stone-300">
                                                <CreditCard size={24} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Carte Bancaire</div>
                                                <div className="text-xs text-stone-300">Bientôt disponible</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                <p className="text-xs text-center text-stone-400 mt-6 flex items-center justify-center gap-1">
                                    <Lock size={12} />
                                    Paiement chiffré et sécurisé
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentPage;

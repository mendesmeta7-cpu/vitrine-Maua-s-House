import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, AlertCircle, CreditCard, Lock, Smartphone } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../services/orderService';
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

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(orderId);
                // Security check: if already paid, show success directly
                if (data.status === 'paid' || data.status === 'delivered') {
                    setPaymentSuccess(true);
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

    // Generic function to process payment - modular for future Aggregator integration
    const processPayment = async (method) => {
        setProcessing(true);

        try {
            // SIMULATION: Waiting 2 seconds to mimic API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In production, here we would call the Aggregator API with:
            // order.id, order.paid_amount, method, currency, etc.

            // Updating Firestore
            await updateOrderStatus(orderId, 'paid', {
                paymentMethod: method,
                paymentDate: new Date()
            });

            setPaymentSuccess(true);
            setOrder(prev => ({ ...prev, status: 'paid' })); // Local update
        } catch (err) {
            console.error("Payment failed:", err);
            alert("Le paiement a échoué. Veuillez réessayer.");
        } finally {
            setProcessing(false);
        }
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

                        <div className="flex gap-4 mb-4">
                            <img
                                src={order.imageUrl || "/placeholder.jpg"}
                                alt={order.productName}
                                className="w-20 h-20 object-cover rounded-lg bg-stone-100"
                            />
                            <div>
                                <h3 className="font-bold text-stone-800">{order.productName}</h3>
                                <p className="text-maua-primary font-bold text-lg">{order.paid_amount} {order.currency || "$"}</p>
                            </div>
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
                        ) : (
                            <div className="bg-white p-6 rounded-3xl shadow-lg border border-stone-100">
                                <h2 className="text-xl font-bold text-maua-dark mb-6 flex items-center gap-2">
                                    <Lock size={20} className="text-maua-primary" />
                                    Moyen de paiement
                                </h2>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => processPayment('MOBILE_MONEY')}
                                        disabled={processing}
                                        className="w-full bg-stone-900 text-white p-4 rounded-xl flex items-center justify-between hover:bg-stone-800 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
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
                                        {processing ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <span className="font-bold text-stone-400 group-hover:text-white">→</span>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => processPayment('CARD')}
                                        disabled={processing}
                                        className="w-full bg-white border-2 border-stone-100 text-maua-dark p-4 rounded-xl flex items-center justify-between hover:border-maua-primary hover:bg-maua-light/5 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-stone-50 p-2 rounded-lg group-hover:bg-white text-maua-primary">
                                                <CreditCard size={24} />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">Carte Bancaire / PayPal</div>
                                                <div className="text-xs text-stone-400">Visa, Mastercard</div>
                                            </div>
                                        </div>
                                        {processing ? (
                                            <div className="w-5 h-5 border-2 border-maua-primary/30 border-t-maua-primary rounded-full animate-spin"></div>
                                        ) : (
                                            <span className="font-bold text-stone-300 group-hover:text-maua-primary">→</span>
                                        )}
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

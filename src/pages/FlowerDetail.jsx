import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle, ShoppingBag, Truck, CreditCard, MessageCircle } from 'lucide-react';
import { getProductById } from '../services/productService';
import { createOrder } from '../services/orderService';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FlowerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, setCustomerInfo, customerInfo } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Order Form State
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        if (customerInfo) {
            setFormData(prev => ({ ...prev, ...customerInfo }));
        }
    }, [customerInfo]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Produit introuvable ou erreur de chargement.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const orderId = await createOrder({
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                currency: product.currency || 'USD',
                imageUrl: product.imageUrl,
                ...formData
            });
            // Redirect to Payment Page
            navigate(`/payment/${orderId}`);
        } catch (err) {
            console.error("Order failed:", err);
            alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
            setSubmitting(false);
        }
    };

    const handleAddToCart = () => {
        // Validate form data
        if (!formData.customerName || !formData.phone || !formData.address) {
            alert("Veuillez remplir vos informations (Nom, Téléphone, Adresse) avant d'ajouter au panier.");
            // Scroll to form
            const formElement = document.getElementById('order-form');
            if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setCustomerInfo(formData);
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency || "USD",
            imageUrl: product.imageUrl,
            quantity: 1
        });
        // Feedback is handled by Navbar cart badge, or we could add a toast here
        alert("Produit ajouté au panier !");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-maua-bg flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maua-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-maua-bg flex flex-col justify-center items-center p-4 text-center">
                <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
                <h2 className="text-2xl font-serif font-bold text-maua-dark mb-2">Oups !</h2>
                <p className="text-stone-600 mb-6">{error || "Produit introuvable."}</p>
                <button
                    onClick={() => navigate('/galerie')}
                    className="bg-maua-dark text-white px-6 py-3 rounded-full hover:bg-maua-primary transition-colors"
                >
                    Retour à la galerie
                </button>
            </div>
        );
    }

    return (
        <div className="bg-maua-bg min-h-screen font-sans selection:bg-maua-primary selection:text-white">
            <Navbar />

            <div className="pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/galerie')}
                    className="flex items-center gap-2 text-stone-500 hover:text-maua-primary transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={20} />
                    Retour à la galerie
                </button>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl overflow-hidden shadow-xl bg-white aspect-[4/5] relative border border-stone-100"
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Right: Info & Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="inline-block px-3 py-1 bg-maua-light/20 text-maua-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                Collection Exclusive
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-maua-dark mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-medium text-maua-primary mb-6">
                                {product.price} {product.currency || "$"}
                            </p>
                            <p className="text-stone-600 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <hr className="border-stone-200" />

                        {/* Features Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-stone-500">
                            <div className="flex items-center gap-2">
                                <Truck size={18} className="text-maua-primary" />
                                <span>Livraison rapide</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard size={18} className="text-maua-primary" />
                                <span>Paiement sécurisé</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-stone-100">
                            <h3 className="text-xl font-serif font-bold text-maua-dark mb-6 flex items-center gap-2">
                                <MessageCircle size={24} className="text-maua-primary" />
                                Commander directement
                            </h3>

                            <form id="order-form" onSubmit={handleOrderSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-stone-500 uppercase">Votre nom</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            required
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-maua-primary/20 focus:border-maua-primary transition-all"
                                            placeholder="Jean Dupont"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-stone-500 uppercase">Téléphone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-maua-primary/20 focus:border-maua-primary transition-all"
                                            placeholder="+243 ..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Adresse de livraison</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-maua-primary/20 focus:border-maua-primary transition-all"
                                        placeholder="Quartier, Avenue, Numéro..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-500 uppercase">Message (Optionnel)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-maua-primary/20 focus:border-maua-primary transition-all resize-none"
                                        placeholder="Un petit mot pour accompagner les fleurs ?"
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex flex-col md:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-maua-dark text-white py-4 rounded-xl font-bold hover:bg-maua-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {submitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            "Payer et Commander"
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-stone-100 text-maua-dark py-4 rounded-xl font-bold hover:bg-stone-200 transition-colors flex justify-center items-center gap-2 border border-stone-200"
                                    >
                                        <ShoppingBag size={20} />
                                        Ajouter au panier
                                    </button>
                                </div>
                                <p className="text-xs text-stone-400 text-center mt-2">
                                    Vous serez redirigé vers le paiement sécurisé.
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FlowerDetail;

import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    const handleCheckout = () => {
        // Placeholder for checkout logic (e.g., WhatsApp redirect or Payment Gateway)
        const message = `Bonjour, je souhaite commander : \n${cartItems.map(item => `- ${item.name} (${item.quantity}x)`).join('\n')}\nTotal: ${cartTotal} $`;
        const whatsappUrl = `https://wa.me/243907444762?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="bg-maua-bg min-h-screen font-sans">
            <Navbar />
            <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
                <h1 className="text-4xl font-serif text-maua-dark mb-8 text-center">Votre Panier</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-6">Votre panier est vide.</p>
                        <Link to="/" className="text-maua-primary font-medium hover:underline">
                            Retourner à la boutique
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="md:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg text-maua-dark">{item.name}</h3>
                                        <p className="text-maua-primary font-medium">{item.price} $</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-50 text-gray-500"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-50 text-gray-500"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                                <h2 className="font-serif text-xl text-maua-dark mb-4">Résumé de la commande</h2>
                                <div className="space-y-3 mb-6 border-b pb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Sous-total</span>
                                        <span>{cartTotal} $</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Livraison</span>
                                        <span className="text-sm text-gray-400">(Calculé ensuite)</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xl font-medium text-maua-dark mb-6">
                                    <span>Total</span>
                                    <span>{cartTotal} $</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-maua-primary text-white py-3 rounded-xl font-medium hover:bg-maua-primary-dark transition-colors flex items-center justify-center gap-2"
                                >
                                    Commander via WhatsApp
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;

import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus, ArrowRight, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, customerInfo } = useCart();
    const navigate = useNavigate();

    // Group items by currency
    const usdItems = cartItems.filter(item => item.currency === 'USD');
    const cdfItems = cartItems.filter(item => item.currency !== 'USD'); // Default to CDF or catch-all

    const calculateTotal = (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handlePayment = async (currency, items) => {
        if (!customerInfo) {
            alert("Informations client manquantes. Veuillez retourner à la boutique et remplir le formulaire sur un produit.");
            return;
        }

        try {
            const totalAmount = calculateTotal(items);
            const orderData = {
                ...customerInfo,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl
                })),
                currency: currency,
                productPrice: totalAmount, // Using productPrice to match existing schema for 'amount'
                status: 'pending'
            };

            const orderId = await createOrder(orderData);

            // Optimistically remove paid items from cart
            items.forEach(item => removeFromCart(item.id));

            navigate(`/payment/${orderId}`);
        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Erreur lors de l'initialisation de la commande.");
        }
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

                    <div className="space-y-12">
                        {/* USD Section */}
                        {usdItems.length > 0 && (
                            <CartSection
                                currency="USD"
                                items={usdItems}
                                total={calculateTotal(usdItems)}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                                onPay={() => handlePayment('USD', usdItems)}
                            />
                        )}

                        {/* CDF Section */}
                        {cdfItems.length > 0 && (
                            <CartSection
                                currency="CDF"
                                items={cdfItems}
                                total={calculateTotal(cdfItems)}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                                onPay={() => handlePayment('CDF', cdfItems)}
                            />
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

const CartSection = ({ currency, items, total, onUpdateQuantity, onRemove, onPay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <h2 className="text-2xl font-serif text-maua-dark mb-6 flex items-center gap-2 border-b pb-4">
            <span className="bg-maua-primary/10 text-maua-primary px-3 py-1 rounded-lg text-sm font-bold">
                {currency}
            </span>
            Panier {currency}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b last:border-0 border-stone-50">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-maua-dark">{item.name}</h3>
                            <p className="text-maua-primary font-medium">{item.price} {currency}</p>

                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center border rounded-lg bg-stone-50">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-gray-200 text-gray-500 rounded-l-lg transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-gray-200 text-gray-500 rounded-r-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-red-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Retirer</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="md:col-span-1">
                <div className="bg-stone-50 p-6 rounded-xl">
                    <div className="flex justify-between text-lg font-medium text-maua-dark mb-6">
                        <span>Total ({currency})</span>
                        <span className="text-xl font-bold">{total} {currency}</span>
                    </div>
                    <button
                        onClick={onPay}
                        className="w-full bg-maua-primary text-white py-3 rounded-xl font-medium hover:bg-maua-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-maua-primary/20"
                    >
                        Payer {total} {currency}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default CartPage;

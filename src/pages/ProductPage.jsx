import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                setError("Produit introuvable");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-maua-bg text-maua-dark">Chargement...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-maua-bg text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-maua-bg min-h-screen font-sans">
            <Navbar />
            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-maua-dark mb-8 hover:text-maua-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Retour à la galerie
                </button>

                <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm">
                    {/* Image */}
                    <div className="rounded-xl overflow-hidden bg-gray-100 aspect-square">
                        <img
                            src={product.imageUrl || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-maua-light/30 text-maua-primary rounded-full text-sm font-medium w-fit mb-4">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-serif text-maua-dark mb-4">{product.name}</h1>
                        <p className="text-2xl font-medium text-maua-primary mb-6">{product.price} $</p>

                        <div className="prose text-gray-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        <button
                            onClick={() => {
                                addToCart(product);
                                alert("Ajouté au panier !");
                            }}
                            className="w-full bg-maua-primary text-white py-4 rounded-xl font-medium text-lg hover:bg-maua-primary-dark transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;

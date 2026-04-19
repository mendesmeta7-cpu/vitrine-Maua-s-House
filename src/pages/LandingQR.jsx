import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { ShoppingBag, AlertCircle } from 'lucide-react';

const LandingQR = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const variantId = searchParams.get('v');
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Produit introuvable.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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
            </div>
        );
    }

    let displayPrice = product.price;
    let displayImage = product.imageUrl;
    let displayName = product.name;

    if (variantId && product.variants) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
            displayPrice = variant.price;
            if (variant.imageUrl) displayImage = variant.imageUrl;
            displayName = `${product.name} - ${variant.name}`;
        }
    }

    return (
        <div className="bg-maua-bg min-h-screen font-sans flex flex-col justify-between selection:bg-maua-primary selection:text-white">
            <div className="flex-1 flex flex-col h-full max-w-lg mx-auto w-full relative">
                {/* Big Image Container */}
                <div className="relative w-full aspect-[4/5] bg-stone-100 shadow-md">
                    <img
                        src={displayImage || "/placeholder.jpg"}
                        alt={displayName}
                        className="w-full h-full object-cover rounded-b-[2.5rem]"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/90 text-maua-primary rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow text-center">
                            Maua's House
                        </span>
                    </div>
                </div>

                {/* Info Container */}
                <div className="px-6 py-8 flex-1 flex flex-col justify-center text-center">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-maua-dark mb-3 leading-tight">
                        {displayName}
                    </h1>
                    <p className="text-3xl font-medium text-maua-primary mb-6">
                        {displayPrice} {product.currency || "$"}
                    </p>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-3">
                        {product.description}
                    </p>
                </div>

                {/* Fixed Bottom Action */}
                <div className="sticky bottom-0 w-full p-6 pb-8 bg-gradient-to-t from-maua-bg via-maua-bg to-transparent">
                    <button
                        onClick={() => navigate(`/galerie/${id}`)}
                        className="w-full bg-maua-dark text-white py-4 rounded-2xl font-bold text-lg hover:bg-maua-primary transition-all shadow-xl hover:shadow-2xl flex justify-center items-center gap-3 transform hover:-translate-y-1"
                    >
                        <ShoppingBag size={24} />
                        Commander maintenant
                    </button>
                    <p className="text-xs text-stone-400 text-center mt-3 font-medium">
                        Vous pourrez ajouter un message personnalisé avant le paiement.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingQR;

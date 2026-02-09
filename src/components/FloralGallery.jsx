import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Section from './Section';
import { getProducts } from '../services/productService';

const FloralGallery = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await getProducts();
                // Get up to 4 latest products
                if (data.length > 0) {
                    setProducts(data.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to load gallery:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    return (
        <Section className="bg-maua-bg overflow-hidden relative" id="gallery">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-maua-primary font-medium tracking-wide uppercase text-sm mb-2 block">
                    Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-maua-dark mb-4">
                    Nos Dernières Créations
                </h2>
                <p className="text-stone-500 mb-8">
                    Découvrez un aperçu de nos plus belles compositions.
                </p>

                <button
                    onClick={() => navigate('/galerie')}
                    className="inline-flex items-center gap-2 bg-maua-dark text-white px-8 py-3 rounded-full hover:bg-maua-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    VOIR TOUS LES BOUQUETS
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* Gallery Grid Teaser */}
            <div className="max-w-7xl mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maua-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ y: -5 }}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-md"
                                onClick={() => navigate(`/galerie/${product.id}`)}
                            >
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h3 className="text-white font-serif font-bold text-lg">{product.name}</h3>
                                    <p className="text-white/90 text-sm font-medium">{product.price} $</p>
                                    <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white">
                                        <Eye size={16} />
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
};

export default FloralGallery;

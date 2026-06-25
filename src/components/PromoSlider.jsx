import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/productService';
import { ArrowRight, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoSlider = () => {
    const [promotions, setPromotions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const products = await getProducts();
                const activePromos = [];
                const now = new Date();

                products.forEach(product => {
                    // Check base product promo
                    if (product.promoPrice && product.promoExpiresAt && new Date(product.promoExpiresAt) > now) {
                        activePromos.push({
                            ...product,
                            isVariant: false,
                            displayName: product.name,
                            displayImage: product.imageUrl,
                            originalPrice: product.price,
                            promoPrice: product.promoPrice,
                            expiresAt: product.promoExpiresAt
                        });
                    }
                    
                    // Check variant promos
                    if (product.variants && Array.isArray(product.variants)) {
                        product.variants.forEach(variant => {
                            if (variant.promoPrice && variant.promoExpiresAt && new Date(variant.promoExpiresAt) > now) {
                                activePromos.push({
                                    ...product, // keep base info like id
                                    isVariant: true,
                                    variantId: variant.id,
                                    displayName: `${product.name} - ${variant.name}`,
                                    displayImage: variant.imageUrl || product.imageUrl,
                                    originalPrice: variant.price,
                                    promoPrice: variant.promoPrice,
                                    expiresAt: variant.promoExpiresAt
                                });
                            }
                        });
                    }
                });

                setPromotions(activePromos);
            } catch (error) {
                console.error("Erreur de chargement des annonces:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromos();
    }, []);

    // Auto-slide
    useEffect(() => {
        if (promotions.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [promotions.length]);

    if (loading || promotions.length === 0) return null;

    const currentPromo = promotions[currentIndex];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-4 mb-12">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-maua-primary/5 to-transparent pointer-events-none" />
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPromo.displayName} // trigger anim on change
                        initial={{ opacity: 0, scale: 0.98, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8"
                    >
                        {/* Image Section */}
                        <div className="relative w-full md:w-1/3 aspect-video md:aspect-square overflow-hidden rounded-2xl shadow-sm">
                            <img 
                                src={currentPromo.displayImage} 
                                alt={currentPromo.displayName}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-maua-primary shadow-sm flex items-center gap-1">
                                <Tag size={12} />
                                Offre Spéciale
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-2/3 flex flex-col justify-center space-y-4">
                            <CountdownBadge expiresAt={currentPromo.expiresAt} />
                            
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-maua-dark leading-tight">
                                {currentPromo.displayName}
                            </h2>
                            
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-maua-primary">
                                    {currentPromo.promoPrice} {currentPromo.currency || 'CDF'}
                                </span>
                                <span className="text-lg text-stone-400 line-through font-medium">
                                    {currentPromo.originalPrice} {currentPromo.currency || 'CDF'}
                                </span>
                            </div>

                            <div className="pt-2">
                                <Link 
                                    to={`/galerie/${currentPromo.id}`}
                                    className="inline-flex items-center gap-2 bg-maua-dark text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-maua-primary transition-all duration-300 shadow-lg shadow-maua-dark/20"
                                >
                                    Profiter de l'offre
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Indicators */}
                {promotions.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {promotions.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    idx === currentIndex ? 'w-6 bg-maua-primary' : 'w-2 bg-stone-300 hover:bg-stone-400'
                                }`}
                                aria-label={`Aller à la promotion ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const CountdownBadge = ({ expiresAt }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(expiresAt) - new Date();
            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                
                if (days > 0) {
                    return `Encore ${days}j : ${hours}h`;
                }
                return `Encore ${hours}h : ${minutes}m`;
            }
            return 'Expiré';
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // update every minute

        return () => clearInterval(timer);
    }, [expiresAt]);

    return (
        <div className="inline-flex items-center gap-1.5 bg-maua-dark/5 border border-maua-dark/10 text-maua-dark px-3 py-1.5 rounded-full text-sm font-semibold w-fit">
            <Clock size={14} className="text-maua-primary" />
            {timeLeft}
        </div>
    );
};

export default PromoSlider;

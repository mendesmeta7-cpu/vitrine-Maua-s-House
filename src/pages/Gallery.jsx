import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Heart, Search, Filter } from 'lucide-react';
import { getProducts } from '../services/productService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORY_CONFIG = {
    'all': { label: 'Tout voir', icon: Filter },
    'innovations': { label: 'Célébrations', icon: Calendar },
    'ceremonies': { label: 'Hommages', icon: Sparkles },
    'amour': { label: 'Amour', icon: Heart }
};

const Gallery = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        window.scrollTo(0, 0); // Ensure top of page on load
        const fetchFlowers = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Failed to fetch gallery:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlowers();
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, products]);

    return (
        <div className="bg-maua-bg min-h-screen font-sans selection:bg-maua-primary selection:text-white">
            <Navbar />

            <div className="pt-24 md:pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-maua-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-3 block"
                    >
                        Notre Collection
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-maua-dark mb-6"
                    >
                        Galerie & Commandes
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        Découvrez nos créations uniques, pensées pour sublimer vos moments les plus précieux.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {Object.entries(CATEGORY_CONFIG).map(([key, config], idx) => (
                        <motion.button
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            onClick={() => setActiveCategory(key)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border
                                ${activeCategory === key
                                    ? 'bg-maua-dark text-white border-maua-dark shadow-lg scale-105'
                                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}
                        >
                            <config.icon size={16} />
                            {config.label}
                        </motion.button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maua-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((flower) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={flower.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 flex flex-col"
                                >
                                    <div className="aspect-[4/5] overflow-hidden relative bg-stone-100">
                                        <img
                                            src={flower.imageUrl}
                                            alt={flower.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <button
                                                onClick={() => navigate(`/galerie/${flower.id}`)}
                                                className="w-full bg-white text-maua-dark py-3 rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-maua-primary hover:text-white"
                                            >
                                                Voir les détails
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold tracking-wider text-maua-primary uppercase bg-maua-light/20 px-2 py-1 rounded">
                                                {CATEGORY_CONFIG[flower.category]?.label || flower.category}
                                            </span>
                                            <span className="font-serif text-xl font-bold text-maua-dark">
                                                {flower.price} $
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-stone-800 mb-2 group-hover:text-maua-primary transition-colors">
                                            {flower.name}
                                        </h3>
                                        <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
                                            {flower.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-stone-500 text-lg">Aucune création trouvée dans cette catégorie.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Gallery;

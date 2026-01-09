import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Calendar, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import Section from './Section';

// --- DATA STRUCTURE (3 Levels: Category -> SubCategories -> Images) ---
const categories = [
    {
        id: 'celebrations',
        label: 'Célébrations & Événements',
        icon: Calendar,
        color: 'bg-pink-100 text-pink-600',
        subCategories: [
            {
                title: 'Mariage Bohème Chic',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/mariage-boheme-1.jpg`,
                        name: 'Bouquet Bohème Pastel',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/mariage-boheme-2.jpg`,
                        name: 'Roses Blanches & Verdure',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/mariage-boheme-3.jpg`,
                        name: 'Composition Lys & Roses',
                    }
                ]
            },
            {
                title: 'Bouquet d\'Anniversaire Éclatant',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/anniversaire-eclatant-1.jpg`,
                        name: 'Explosion de Couleurs',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/anniversaire-eclatant-2.jpg`,
                        name: 'Mix Roses et Pivoines',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/anniversaire-eclatant-3.jpg`,
                        name: 'Cadeau Floral Joyeux',
                    }
                ]
            },
            {
                title: 'Centre de Table Festif',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/centre-table-festif-v2-1.jpg`,
                        name: 'Élégance Dorée',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/centre-table-festif-v2-2.jpg`,
                        name: 'Dîner aux Chandelles',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/centre-table-festif-v2-3.jpg`,
                        name: 'Ambiance Feutrée',
                    }
                ]
            }
        ]
    },
    {
        id: 'hommages',
        label: 'Hommages & Souvenirs',
        icon: Sparkles,
        color: 'bg-stone-100 text-stone-600',
        subCategories: [
            {
                title: 'Couronne de la Mémoire',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/couronne-memoire-1.jpg`,
                        name: 'Couronne Blanche Pure',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/couronne-memoire-2.jpg`,
                        name: 'Détail Fleurs Délicates',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/couronne-memoire-3.jpg`,
                        name: 'Hommage Solennel',
                    }
                ]
            },
            {
                title: 'Composition Florale de Paix',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/bouquet-sympathie-1.jpg`,
                        name: 'Lys et Roses Blancs',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/bouquet-sympathie-2.jpg`,
                        name: 'Touche de Verdure',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/bouquet-sympathie-3.jpg`,
                        name: 'Simplicité Émouvante',
                    }
                ]
            },
            {
                title: 'Gerbe de fleurs enterrement',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/composition-paix-1.jpg`,
                        name: 'Hortensias et Roses Douces',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/composition-paix-2.jpg`,
                        name: 'Roses Rouges et Lys',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/composition-paix-3.jpg`,
                        name: 'Cœur Fleuri Varié',
                    }
                ]
            }
        ]
    },
    {
        id: 'amour',
        label: 'Amour & Émotions',
        icon: Heart,
        color: 'bg-red-50 text-red-500',
        subCategories: [
            {
                title: 'Grand Bouquet Rouge Passion',
                images: [
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/grand-bouquet-rouge-passion-1.jpg`,
                        name: '101 Roses Rouges',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/grand-bouquet-rouge-passion-2.jpg`,
                        name: 'Passion Intense',
                    },
                    {
                        url: `${import.meta.env.BASE_URL}images/gallery/grand-bouquet-rouge-passion-3.jpg`,
                        name: 'Velours Cramoisi',
                    }
                ]
            },
            {
                title: 'Box à fleurs romantique',
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?q=80&w=1974',
                        name: 'Flower Box Carrée',
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1520302630591-a6e35002a28c?q=80&w=2000',
                        name: 'Macarons et Fleurs',
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1582236894371-33230d709088?q=80&w=2000',
                        name: 'Écrin de Luxe',
                    }
                ]
            },
            {
                title: 'Bouquet douceur rose rouge',
                images: [
                    {
                        url: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2032',
                        name: 'Nuage Pastel',
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1498926955099-fc9161a06734?q=80&w=2000',
                        name: 'Tendresse Infinie',
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?q=80&w=2000',
                        name: 'Charme Romantique',
                    }
                ]
            }
        ]
    }
];

const FloralGallery = () => {
    // Indices state
    const [activeTab, setActiveTab] = useState(0); // 0, 1, 2 (Categories)
    const [subCatIndex, setSubCatIndex] = useState(0); // 0, 1, 2 (Sub-categories)
    const [imgIndex, setImgIndex] = useState(0); // 0, 1, 2 (Images)
    const [userInteracted, setUserInteracted] = useState(false); // To pause auto-scroll briefly on interaction

    // Derived current data
    const currentCategory = categories[activeTab];
    const currentSubCat = currentCategory.subCategories[subCatIndex];
    const currentImage = currentSubCat.images[imgIndex];

    // Reset logic when Category changes
    useEffect(() => {
        setSubCatIndex(0);
        setImgIndex(0);
        setUserInteracted(false);
    }, [activeTab]);

    // Auto-scroll logic
    useEffect(() => {
        if (userInteracted) {
            const timeout = setTimeout(() => setUserInteracted(false), 8000); // Pause for 8s after interaction
            return () => clearTimeout(timeout);
        }

        const interval = setInterval(() => {
            handleNextStep();
        }, 5000);

        return () => clearInterval(interval);
    }, [activeTab, subCatIndex, imgIndex, userInteracted]);

    const handleNextStep = () => {
        // 1. Next Image
        if (imgIndex < 2) {
            setImgIndex(prev => prev + 1);
        }
        // 2. Next Sub-Category
        else if (subCatIndex < 2) {
            setSubCatIndex(prev => prev + 1);
            setImgIndex(0);
        }
        // 3. Next Category
        else {
            setActiveTab(prev => (prev + 1) % categories.length);
            // Effect above will reset subCat/img
        }
    };

    const handlePrevSubCat = () => {
        setUserInteracted(true);
        if (subCatIndex > 0) {
            setSubCatIndex(prev => prev - 1);
        } else {
            // Loop back to last sub-cat of current category or prev category?
            // Spec says "respecter l’ordre logique", let's loop within category for simplicity on manual nav
            setSubCatIndex(currentCategory.subCategories.length - 1);
        }
        setImgIndex(0);
    };

    const handleNextSubCat = () => {
        setUserInteracted(true);
        if (subCatIndex < currentCategory.subCategories.length - 1) {
            setSubCatIndex(prev => prev + 1);
        } else {
            setSubCatIndex(0);
        }
        setImgIndex(0);
    };

    const handleImageSelect = (index) => {
        setUserInteracted(true);
        setImgIndex(index);
    };

    const handleCategorySelect = (index) => {
        setUserInteracted(true);
        setActiveTab(index);
    };

    const handleWhatsAppClick = () => {
        const catName = currentCategory.label;
        const subCatName = currentSubCat.title;
        const imgName = currentImage.name;

        const message = `Bonjour Maua’s House 🌸\nJe suis intéressé par la création :\n"${imgName}"\n(Catégorie : ${catName} – ${subCatName}).`;
        const url = `https://wa.me/243907444762?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Section className="bg-maua-bg overflow-hidden relative" id="gallery">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-maua-primary font-medium tracking-wide uppercase text-sm mb-2 block">
                    Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-maua-text mb-4">
                    Nos Créations Florales
                </h2>
                <p className="text-stone-600 text-lg">
                    Explorez nos univers, de la célébration à l'émotion.
                </p>
            </div>

            {/* --- Level 1: Category Tabs --- */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
                {categories.map((cat, index) => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(index)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium border
                            ${activeTab === index
                                ? 'bg-maua-text text-white border-maua-text shadow-lg scale-105'
                                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                            }`}
                    >
                        <cat.icon size={16} />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* --- Main Gallery Display --- */}
            <div className="max-w-6xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeTab}-${subCatIndex}`} // Re-render animation when sub-cat changes
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="grid md:grid-cols-2 gap-8 items-stretch bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100"
                    >
                        {/* --- LEFT: Image Area --- */}
                        <div className="relative flex flex-col gap-4">
                            {/* Large Image */}
                            <div className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-stone-100">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImage.url}
                                        src={currentImage.url}
                                        alt={currentImage.name}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Navigation Arrows (Overlay) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrevSubCat(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-maua-text p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10"
                                    aria-label="Sous-catégorie précédente"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNextSubCat(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-maua-text p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10"
                                    aria-label="Sous-catégorie suivante"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex justify-center gap-3 mt-2">
                                {currentSubCat.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleImageSelect(idx)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300
                                            ${idx === imgIndex ? 'border-maua-primary ring-2 ring-pink-100 scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* --- RIGHT: Content Area --- */}
                        <div className="flex flex-col justify-center space-y-8 md:pl-6 p-2">

                            {/* Header Info */}
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-stone-400 uppercase mb-2">
                                    <span className={`w-2 h-2 rounded-full ${activeTab === 0 ? 'bg-pink-400' : activeTab === 1 ? 'bg-stone-400' : 'bg-red-400'}`}></span>
                                    {currentCategory.label}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-serif font-bold text-maua-text leading-tight">
                                    {currentSubCat.title}
                                </h3>
                            </div>

                            {/* Active Image Details */}
                            <motion.div
                                key={imgIndex}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-stone-50 rounded-xl p-6 border border-stone-100"
                            >
                                <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Création sélectionnée</p>
                                <p className="text-xl font-medium text-stone-700">
                                    {currentImage.name}
                                </p>
                            </motion.div>

                            {/* Action Button */}
                            <div>
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="w-full bg-maua-green hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3 group"
                                >
                                    <span>Intéressé</span>
                                    <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
                                </button>
                                <p className="text-center text-xs text-stone-400 mt-3 flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Réponse rapide via WhatsApp
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </Section>
    );
};

export default FloralGallery;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ArrowRight, Sparkles, User, Calendar } from 'lucide-react';
import Section from './Section';

// Categories and Data
const categories = [
    {
        id: 'celebrations',
        label: 'Célébrations & Événements',
        icon: Calendar,
        color: 'bg-pink-100 text-pink-600',
        description: 'Mariages, anniversaires, fêtes',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1519225468359-2996bc15e5a0?q=80&w=2070&auto=format&fit=crop',
                title: 'Mariage Bohème Chic',
                desc: 'Une composition florale élégante pour votre grand jour.'
            },
            {
                url: 'https://images.unsplash.com/photo-1464093515883-ec948246accb?q=80&w=2059&auto=format&fit=crop',
                title: 'Bouquet d\'Anniversaire Éclatant',
                desc: 'Célébrez une nouvelle année avec des couleurs vibrantes.'
            },
            {
                url: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?q=80&w=1974&auto=format&fit=crop',
                title: 'Centre de Table Festif',
                desc: 'Pour des dîners et réceptions inoubliables.'
            }
        ]
    },
    {
        id: 'hommages',
        label: 'Hommages & Souvenirs',
        icon: Sparkles, // Using Sparkles as a placeholder for a respectful icon, or maybe a simple Flower
        color: 'bg-stone-100 text-stone-600',
        description: 'Funérailles, obsèques, deuil',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1596634863920-5629f1265f97?q=80&w=2070&auto=format&fit=crop',
                title: 'Couronne de la Mémoire',
                desc: 'Un dernier hommage empreint de respect et de douceur.'
            },
            {
                url: 'https://images.unsplash.com/photo-1496661415325-ef852f9e8e7c?q=80&w=2127&auto=format&fit=crop',
                title: 'Bouquet de Sympathie Blanc',
                desc: 'Exprimez vos condoléances avec pureté et élégance.'
            },
            {
                url: 'https://images.unsplash.com/photo-1603623788229-ee43e60249c6?q=80&w=2070&auto=format&fit=crop',
                title: 'Composition Florale Paisible',
                desc: 'Des fleurs apaisantes pour accompagner les moments difficiles.'
            }
        ]
    },
    {
        id: 'amour',
        label: 'Amour & Émotions',
        icon: Heart,
        color: 'bg-red-50 text-red-500',
        description: 'Romance, surprises, cadeaux',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1968&auto=format&fit=crop',
                title: 'Grand Bouquet Rouge Passion',
                desc: 'L’expression ultime de vos sentiments profonds.'
            },
            {
                url: 'https://images.unsplash.com/photo-1563241527-3004b7be0fee?q=80&w=1974&auto=format&fit=crop',
                title: 'Boîte à Fleurs Romantique',
                desc: 'Une surprise moderne et élégante pour l’être cher.'
            },
            {
                url: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2032&auto=format&fit=crop',
                title: 'Composition Douceur Rose',
                desc: 'Pour dire "Je t\'aime" avec tendresse.'
            }
        ]
    }
];

const FloralGallery = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset image index when tab changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [activeTab]);

    // Auto-play interval
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % categories[activeTab].images.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [activeTab]);

    const handleWhatsAppClick = () => {
        const category = categories[activeTab];
        const image = category.images[currentImageIndex];
        const message = `Bonjour Maua’s House 🌸\nJe suis intéressé par la création\n"${image.title}"\n(Catégorie : ${category.label}).`;
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
                    Laissez-vous inspirer par nos compositions uniques pour chaque moment de la vie.
                </p>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
                {categories.map((cat, index) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(index)}
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

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100"
                    >
                        {/* Image Carousel Side */}
                        <div className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden shadow-inner group cursor-pointer" onClick={() => setCurrentImageIndex((prev) => (prev + 1) % categories[activeTab].images.length)}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={categories[activeTab].images[currentImageIndex].url}
                                    alt={categories[activeTab].images[currentImageIndex].title}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                                {categories[activeTab].images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 
                                            ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="flex flex-col justify-center space-y-6 md:pl-4">
                            <div className="space-y-2">
                                <motion.div
                                    key={`text-${activeTab}-${currentImageIndex}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold tracking-wider mb-2 uppercase">
                                        {categories[activeTab].label}
                                    </span>
                                    <h3 className="text-3xl font-serif font-bold text-maua-text leading-tight">
                                        {categories[activeTab].images[currentImageIndex].title}
                                    </h3>
                                    <p className="text-stone-500 text-lg mt-4 leading-relaxed">
                                        {categories[activeTab].images[currentImageIndex].desc}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="w-full md:w-auto bg-maua-green hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3"
                                >
                                    <span>Intéressé</span>
                                    <ArrowRight size={20} />
                                </button>
                                <p className="text-center md:text-left text-xs text-stone-400 mt-3">
                                    Redirection vers WhatsApp pour discuter de cette création
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

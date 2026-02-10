import { ArrowRight, Instagram, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-br from-stone-50 via-pink-50/30 to-stone-100">
            {/* Decorative background blobs */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-maua-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-maua-green/5 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-white border border-stone-200 text-xs font-semibold tracking-wider text-maua-text mb-6 uppercase">
                        Maison Florale Premium
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-maua-text leading-[1.1] mb-6">
                        L’élégance naturelle à <br /> <span className="text-maua-primary italic">Kinshasa</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Maua’s Flowers est une maison florale dédiée à l’élégance naturelle.
                        Nous créons et sélectionnons des fleurs fraîches pour sublimer chaque moment important de votre vie.
                    </p>

                    <div className="flex flex-col items-center gap-8">
                        <a
                            href="#services"
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-maua-text text-white text-lg font-medium shadow-lg hover:bg-maua-primary transition-all duration-300 hover:scale-105"
                        >
                            Découvrir nos créations
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        {/* Social Media Links - Directly below button */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <a
                                href="https://www.facebook.com/share/1ER5ZRLwLf/"
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 bg-white rounded-full text-blue-600 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook size={24} />
                            </a>
                            <a
                                href="https://www.instagram.com/maua_s_house?igsh=MWJkajduMXRkb3Y3cA=="
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 bg-white rounded-full text-pink-600 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={24} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

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
                            <a
                                href="https://www.tiktok.com/@mauas.flowers6?_r=1&_t=ZS-93pvMealYyv"
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 bg-white rounded-full text-stone-900 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                                aria-label="TikTok"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                >
                                    <path d="M12.525.02c1.31-.036 2.612.012 3.91-.01.08.707.357 1.34.812 1.867.507.585 1.158 1.018 1.882 1.252a7.33 7.33 0 0 0 2.226.465V7.128a3.102 3.102 0 0 1-1.04-.15 3.064 3.064 0 0 1-1.503-1.003 3.01 3.01 0 0 1-.502-.858 5.755 5.755 0 0 1-.25-.801 5.014 5.014 0 0 1-.138-1.583v9.088c0 .52-.045 1.03-.135 1.53a4.52 4.52 0 0 1-.387 1.075 4.534 4.534 0 0 1-.822 1.176 4.505 4.505 0 0 1-1.677 1.048 4.493 4.493 0 0 1-1.49.272 4.413 4.413 0 0 1-1.44-.093 4.535 4.535 0 0 1-1.181-.465 4.51 4.51 0 0 1-1.644-1.92 4.501 4.501 0 0 1-.33-1.063 4.512 4.512 0 0 1 .42-3.111 4.536 4.536 0 0 1 1.776-1.887 4.502 4.502 0 0 1 1.066-.341c.46-.07.925-.1 1.388-.09v2.855c-.53-.024-1.062.01-1.57.172a1.64 1.64 0 0 0-.663.425 1.63 1.63 0 0 0-.548 1.404c.007.41.132.812.356 1.144.224.332.535.592.894.747a1.66 1.66 0 0 0 1.25.04c.322-.092.611-.268.835-.508.224-.24.383-.54.46-.864.074-.315.089-.64.043-.961l.012-9.527h2.3V.02h-.01z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

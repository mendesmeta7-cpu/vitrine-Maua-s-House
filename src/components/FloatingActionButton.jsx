import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionButton = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Scroll Direction Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling Down
                setIsVisible(false);
            } else {
                // Scrolling Up
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Initial Tooltip Timer
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isHovered) {
                setShowTooltip(true);
                // Hide tooltip after 5 seconds if not hovered
                setTimeout(() => setShowTooltip(false), 5000);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const whatsappLink = "https://wa.me/243907444762";

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Tooltip/Floating Message */}
            <AnimatePresence>
                {(showTooltip || isHovered) && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white text-maua-text px-4 py-2 rounded-2xl shadow-xl mb-4 mr-2 border border-stone-100 pointer-events-auto"
                    >
                        <p className="text-sm font-medium whitespace-nowrap">
                            Un projet spécial ? Discutons
                        </p>
                        {/* Tooltip Arrow */}
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 border-r border-t border-stone-100" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The FAB */}
            <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                animate={{
                    y: isVisible ? 0 : 20,
                    opacity: isVisible ? 1 : 0.4,
                    scale: 1
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    w-16 h-16 rounded-full bg-maua-primary text-white flex items-center justify-center 
                    shadow-[0_8px_30px_rgb(151,114,92,0.4)] relative pointer-events-auto
                    transition-opacity duration-300
                `}
            >
                {/* Discreet Pulsation Effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-maua-primary"
                />

                <MessageCircle size={28} className="relative z-10" />

                {/* Presence Badge */}
                <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-20">
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                </span>
            </motion.a>
        </div>
    );
};

export default FloatingActionButton;

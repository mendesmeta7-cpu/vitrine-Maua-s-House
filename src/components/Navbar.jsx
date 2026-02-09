import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { cartItems } = useCart();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Accueil', href: '/' },
        { name: 'À propos', href: '/#about' },
        { name: 'Services', href: '/#services' },
        { name: 'Galerie', href: '/galerie' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || location.pathname !== '/' ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <span className={`text-xl font-serif font-bold tracking-tight text-maua-dark transition-colors`}>
                        Maua’s House
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`text-sm font-medium tracking-wide transition-colors hover:text-maua-primary ${location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
                                ? 'text-maua-primary font-bold'
                                : 'text-maua-dark'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link to="/cart" className="relative p-2 text-maua-primary hover:text-maua-primary-dark transition-colors">
                        <ShoppingBag className="w-6 h-6" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/#contact"
                        className="px-5 py-2.5 rounded-full bg-maua-dark text-white text-sm font-medium hover:bg-maua-primary transition-colors duration-300"
                    >
                        Nous contacter
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <Link to="/cart" className="relative p-2 text-maua-dark">
                        <ShoppingBag className="w-6 h-6" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </Link>
                    <button className="text-maua-dark" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-stone-100 shadow-xl"
                    >
                        <div className="flex flex-col p-6 gap-2">
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-lg font-medium py-3 block hover:text-maua-primary transition-colors ${location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
                                            ? 'text-maua-primary font-bold'
                                            : 'text-maua-dark'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

const Footer = () => {
    return (
        <footer className="bg-stone-950 text-stone-500 py-8 border-t border-stone-800">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Maua’s House. Tous droits réservés.
                </p>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="hover:text-stone-300 transition-colors">Mentions Légales</a>
                    <a href="#" className="hover:text-stone-300 transition-colors">Politique de Confidentialité</a>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-900 flex justify-center">
                <p className="text-xs text-stone-600 font-medium tracking-wide">
                    Site conçu et développé par <span className="text-stone-500">Synapta</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;

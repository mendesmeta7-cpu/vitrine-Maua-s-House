import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollHandler = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Scroll to top if no hash, otherwise scroll to the hash element
        if (!hash) {
            window.scrollTo(0, 0);
        } else {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                // Delay slightly to ensure the section is rendered
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollHandler;

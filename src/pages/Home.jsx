import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import PromoSlider from '../components/PromoSlider';
import FloralGallery from '../components/FloralGallery';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingActionButton from '../components/FloatingActionButton';

const Home = () => {
    return (
        <div className="bg-maua-bg min-h-screen font-sans selection:bg-maua-primary selection:text-white">
            <Navbar />
            <Hero />
            <About />
            <Services />
            <PromoSlider />
            <FloralGallery />
            <Contact />
            <Footer />
            <FloatingActionButton />
        </div>
    );
};

export default Home;

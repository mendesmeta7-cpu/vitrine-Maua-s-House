import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import FloralGallery from './components/FloralGallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-maua-bg min-h-screen font-sans selection:bg-maua-primary selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <FloralGallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

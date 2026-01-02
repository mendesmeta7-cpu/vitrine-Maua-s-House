import { Flower, Gift, Heart, Sparkles, MessageCircleHeart, ArrowRight } from 'lucide-react';
import Section from './Section';

const services = [
    {
        icon: Flower,
        title: "Vente de fleurs naturelles",
        description: "Une sélection rigoureuse de fleurs fraîches locales et importées pour leur éclat et leur longévité."
    },
    {
        icon: Sparkles,
        title: "Bouquets personnalisés",
        description: "Des créations uniques composées sur mesure pour correspondre parfaitement à vos envies et sentiments."
    },
    {
        icon: Heart,
        title: "Décoration événementielle",
        description: "Mariages, anniversaires, ou dîners privés : nous transformons vos lieux avec une scénographie florale inoubliable."
    },
    {
        icon: Gift,
        title: "Fleurs cadeaux & surprises",
        description: "Offrez de l'émotion pure. Emballage soigné, message personnalisé et effet de surprise garanti."
    },
    {
        icon: MessageCircleHeart,
        title: "Conseils sur mesure",
        description: "Notre expertise à votre service pour choisir les fleurs adaptées à votre intérieur ou à l'occasion."
    }
];

const Services = () => {
    return (
        <Section id="services" className="bg-white">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-maua-primary font-medium tracking-wide uppercase text-sm mb-2 block">
                    Ce que nous offrons
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-maua-text mb-6">
                    Nos Services
                </h2>
                <p className="text-stone-600 text-lg">
                    Découvrez notre gamme de prestations dédiées à l'art floral, conçues pour sublimer votre quotidien.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="group p-6 md:p-8 rounded-2xl bg-stone-50 hover:bg-white border border-stone-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="w-14 h-14 rounded-full bg-white border border-stone-100 flex items-center justify-center text-maua-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <service.icon size={28} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-maua-text mb-3">
                            {service.title}
                        </h3>
                        <p className="text-stone-600 leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                ))}

                {/* Special Project CTA Card */}
                <a
                    href="https://wa.me/243907444762"
                    target="_blank"
                    rel="noreferrer"
                    className="group relative p-6 md:p-8 rounded-2xl bg-stone-950 text-white flex flex-col items-center justify-center text-center shadow-2xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden"
                >
                    {/* Subtle decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-stone-800 rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />

                    <h3 className="text-2xl font-serif font-medium mb-3 relative z-10">
                        Un projet spécial ?
                    </h3>
                    <p className="text-stone-400 mb-8 max-w-xs relative z-10">
                        Discutons de votre vision florale.
                    </p>

                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ArrowRight size={24} />
                    </div>
                </a>            </div>
        </Section>
    );
};

export default Services;

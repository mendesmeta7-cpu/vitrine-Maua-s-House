import Section from './Section';

const About = () => {
    return (
        <Section id="about" className="bg-stone-50">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative">
                    {/* Placeholder for an image - using a colored div for now or an Unsplash URL if permissible. 
               Using a gradient/placeholder to fit the aesthetic without retrieving external assets blindly. */}
                    {/* Main About Image */}
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group relative">
                        <img
                            src={`${import.meta.env.BASE_URL}about-image.jpg`}
                            alt="Maua's Flowers - Chaque fleur raconte une histoire"
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Quote overlay - kept as per context, but styled to fit over the image */}
                        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
                        <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                            <p className="text-white/90 font-serif italic text-xl drop-shadow-md">
                                "Chaque fleur raconte une histoire"
                            </p>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-maua-primary/10 rounded-full blur-2xl z-0" />
                </div>

                <div className="order-1 md:order-2">
                    <span className="text-maua-primary font-medium tracking-wide uppercase text-sm mb-2 block">
                        Notre Philosophie
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-maua-text mb-6">
                        L'amour du détail & <br /> la passion florale
                    </h2>
                    <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
                        <p>
                            Maua’s Flowers est née d'une passion inconditionnelle pour la beauté naturelle des fleurs.
                            Dans un monde qui va toujours plus vite, nous prenons le temps de sélectionner les tiges les plus parfaites
                            pour créer des compositions qui émeuvent.
                        </p>
                        <p>
                            Notre vision est celle d'une élégance intemporelle. Que ce soit pour un mariage grandiose ou
                            une simple attention, nous mettons la même exigence de qualité et le même amour dans chaque création.
                        </p>
                        <p className="font-medium text-maua-text">
                            Mariages, événements, cadeaux ou décoration, nos compositions florales allient finesse, fraîcheur et émotion.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;

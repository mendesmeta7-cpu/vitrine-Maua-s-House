import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Section from './Section';

const Contact = () => {
    return (
        <Section id="contact" className="bg-stone-900 text-stone-200">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <span className="text-maua-primary font-medium tracking-wide uppercase text-sm mb-2 block">
                        Nous trouver
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-8">
                        Contactez-nous
                    </h2>
                    <p className="text-stone-400 text-lg mb-8 max-w-md">
                        Passez nous voir en boutique ou contactez-nous pour toute commande ou question.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-maua-primary mt-1" />
                            <div>
                                <h4 className="font-bold text-white text-lg">Adresse</h4>
                                <p className="text-stone-400">9, avenue Mpeti – Quartier Socimat</p>
                                <p className="text-stone-400">Kinshasa, RDC</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Phone className="text-maua-primary" />
                            <div>
                                <h4 className="font-bold text-white text-lg">Téléphone</h4>
                                <p className="text-stone-400">+243 000 000 000</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Mail className="text-maua-primary" />
                            <div>
                                <h4 className="font-bold text-white text-lg">Email</h4>
                                <p className="text-stone-400">contact@mauashouse.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Clock className="text-maua-primary mt-1" />
                            <div>
                                <h4 className="font-bold text-white text-lg">Horaires</h4>
                                <p className="text-stone-400">Lundi - Samedi : 09h00 - 18h00</p>
                                <p className="text-stone-400">Dimanche : Sur rendez-vous</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple Map Placeholder or Decorative Image */}
                <div className="relative h-min-96 w-full rounded-2xl overflow-hidden bg-stone-800 border border-stone-700 flex items-center justify-center">
                    <div className="text-center p-8">
                        <MapPin size={48} className="text-stone-600 mx-auto mb-4" />
                        <p className="text-stone-500 font-serif italic">Carte à intégrer ici</p>
                        <p className="text-sm text-stone-600 mt-2">(Google Maps Embed)</p>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Contact;

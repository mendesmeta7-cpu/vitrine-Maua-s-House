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
                <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-stone-800 border border-stone-700">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d10639.83156242381!2d15.280829606568714!3dj-4.323703955078228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s9%2C%20avenue%20Mpeti%20%E2%80%93%20Quartier%20Socimat%20%20Kinshasa%2C%20RDC!5e0!3m2!1sfr!2scd!4v1767565444580!5m2!1sfr!2scd"
                        className="w-full h-full border-0"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps"
                    ></iframe>
                </div>
            </div>
        </Section>
    );
};

export default Contact;

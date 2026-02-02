import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MentionsLegales = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="text-primary hover:underline text-sm">
              ← Retour à l'accueil
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Éditeur du site</h2>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Nom de l'entreprise :</strong> Thanout</p>
                <p><strong>Forme juridique :</strong> SARL</p>
                <p><strong>Adresse du siège social :</strong> Dakar, Sénégal</p>
                <p><strong>Numéro de téléphone :</strong> +221 XX XXX XX XX</p>
                <p><strong>Email :</strong> contact@thanout.com</p>
                <p><strong>Directeur de la publication :</strong> [Nom du directeur]</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Hébergement</h2>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Hébergeur :</strong> Netlify / Vercel</p>
                <p><strong>Adresse :</strong> États-Unis</p>
                <p>Le site est hébergé sur des serveurs sécurisés conformes aux normes internationales.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Propriété intellectuelle</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes) est la propriété 
                exclusive de Thanout, sauf mention contraire.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie 
                des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf 
                autorisation écrite préalable de Thanout.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les marques et logos reproduits sur ce site sont déposés par les sociétés qui en sont 
                propriétaires.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Données personnelles</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression 
                des données vous concernant. Vous pouvez exercer ces droits en nous contactant à l'adresse : 
                contact@thanout.com
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Pour plus d'informations sur la gestion de vos données personnelles, consultez notre{' '}
                <Link to="/politique-confidentialite" className="text-primary hover:underline">
                  Politique de Confidentialité
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques 
                de visite. Les cookies sont de petits fichiers texte stockés sur votre appareil.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, cela peut affecter 
                certaines fonctionnalités du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation de responsabilité</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Thanout s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce 
                site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des 
                informations mises à disposition.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Thanout ne saurait être tenu responsable des dommages directs ou indirects résultant de 
                l'utilisation du site ou de l'impossibilité d'y accéder.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Liens hypertextes</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Le site peut contenir des liens hypertextes vers d'autres sites. Thanout n'exerce aucun 
                contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                La création de liens hypertextes vers notre site nécessite une autorisation préalable écrite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Droit applicable</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les présentes mentions légales sont régies par le droit algérien. En cas de litige, les 
                tribunaux algériens seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Pour toute question concernant les mentions légales, vous pouvez nous contacter :
              </p>
              <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
                <li>📧 Email : contact@thanout.com</li>
                <li>📱 Téléphone : +221 XX XXX XX XX</li>
                <li>
                  📄 Formulaire de contact :{' '}
                  <Link to="/contact" className="text-primary hover:underline">
                    Contactez-nous
                  </Link>
                </li>
              </ul>
            </section>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <p>Dernière mise à jour : 2 février 2026</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;

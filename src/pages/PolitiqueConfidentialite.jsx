import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PolitiqueConfidentialite = () => {
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

          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                La protection de vos données personnelles est une priorité pour Thanout. Cette politique de 
                confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos 
                informations personnelles.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                En utilisant notre site, vous acceptez les pratiques décrites dans cette politique.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Données collectées</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Nous collectons les informations suivantes :
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Données fournies directement :</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Adresse de livraison</li>
                    <li>Informations de paiement</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Données collectées automatiquement :</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Adresse IP</li>
                    <li>Type de navigateur</li>
                    <li>Pages visitées et temps passé sur le site</li>
                    <li>Données de navigation (cookies)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Utilisation des données</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Vos données personnelles sont utilisées pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Traiter et livrer vos commandes</li>
                <li>Gérer votre compte client</li>
                <li>Vous contacter concernant vos commandes</li>
                <li>Améliorer nos services et votre expérience utilisateur</li>
                <li>Vous envoyer des offres promotionnelles (avec votre consentement)</li>
                <li>Prévenir la fraude et assurer la sécurité du site</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Partage des données</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être 
                partagées uniquement dans les cas suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>
                  <strong>Prestataires de services :</strong> Pour le traitement des paiements, la livraison, 
                  l'hébergement du site
                </li>
                <li>
                  <strong>Obligations légales :</strong> Si la loi nous y oblige ou pour protéger nos droits
                </li>
                <li>
                  <strong>Avec votre consentement :</strong> Dans tout autre cas, avec votre accord explicite
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Sécurité des données</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                pour protéger vos données contre :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>L'accès non autorisé</li>
                <li>La modification, la divulgation ou la destruction</li>
                <li>La perte accidentelle</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Les paiements sont sécurisés via des protocoles de cryptage SSL/TLS. Les informations 
                bancaires ne sont jamais stockées sur nos serveurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Conservation des données</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4 mt-3">
                <li>Fournir nos services</li>
                <li>Respecter nos obligations légales</li>
                <li>Résoudre les litiges éventuels</li>
                <li>Faire respecter nos accords</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Les données de commande sont conservées pendant 5 ans conformément à la réglementation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Vos droits</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Conformément à la législation en vigueur, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Droit de limitation :</strong> Demander la limitation du traitement</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Pour exercer ces droits, contactez-nous à : contact@thanout.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Notre site utilise des cookies pour améliorer votre expérience. Les cookies sont de petits 
                fichiers texte stockés sur votre appareil.
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Types de cookies utilisés :</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
                    <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation du site</li>
                    <li><strong>Cookies de préférence :</strong> Pour mémoriser vos choix (langue, thème)</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Liens externes</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Notre site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables 
                des pratiques de confidentialité de ces sites. Nous vous encourageons à lire leurs politiques 
                de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Modifications</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                Les modifications seront publiées sur cette page avec une date de mise à jour. Nous vous 
                encourageons à consulter régulièrement cette page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
              </p>
              <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
                <li>📧 Email : contact@thanout.com</li>
                <li>📱 Téléphone : +221 XX XXX XX XX</li>
                <li>📍 Adresse : Dakar, Sénégal</li>
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

export default PolitiqueConfidentialite;

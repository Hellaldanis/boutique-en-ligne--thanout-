import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CGV = () => {
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

          <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Objet</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées 
                sur le site Thanout. En passant commande sur notre site, vous acceptez sans réserve les présentes 
                conditions générales de vente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Produits</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Les produits proposés à la vente sont ceux qui figurent sur le site Thanout, dans la limite 
                des stocks disponibles. Nous nous réservons le droit de modifier à tout moment l'assortiment 
                de produits.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les photographies et graphismes présentés sur le site ne sont pas contractuels et ne sauraient 
                engager notre responsabilité.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Prix</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Les prix de nos produits sont indiqués en Dinars Algériens (DA) toutes taxes comprises (TTC).
                Nous nous réservons le droit de modifier nos prix à tout moment, mais les produits seront 
                facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les frais de livraison sont indiqués avant la validation finale de la commande.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Commande</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Vous pouvez passer commande directement sur le site Thanout. Toute commande vaut acceptation 
                des prix et descriptions des produits disponibles à la vente.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Toute commande passée sur le site constitue la formation d'un contrat conclu à distance entre 
                vous et nous. Nous nous réservons le droit d'annuler ou de refuser toute commande d'un client 
                avec lequel il existerait un litige.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                La vente ne sera considérée comme définitive qu'après l'envoi de la confirmation de commande 
                par email et après encaissement de l'intégralité du prix.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Paiement</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Le paiement de vos achats peut s'effectuer :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Par carte bancaire (paiement sécurisé)</li>
                <li>Par paiement à la livraison (espèces)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                Les paiements effectués par carte bancaire sont sécurisés et cryptés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Livraison</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Les produits sont livrés à l'adresse de livraison indiquée lors de la commande. Les délais 
                de livraison sont indiqués lors de la validation de la commande.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Délais indicatifs de livraison :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>Dakar et environs : 24-48h</li>
                <li>Autres wilayas : 3-7 jours ouvrés</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                En cas de retard de livraison, nous nous engageons à vous tenir informé. Si le délai de 
                livraison dépasse 30 jours, vous pourrez demander l'annulation de votre commande.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Droit de rétractation</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à compter de 
                la réception de votre commande pour exercer votre droit de rétractation sans avoir à justifier 
                de motifs ni à payer de pénalité.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les produits doivent être retournés dans leur emballage d'origine, en parfait état, accompagnés 
                de la facture. Les frais de retour sont à votre charge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Garantie</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les 
                vices cachés, permettant le retour des produits défectueux ou ne correspondant pas à la commande.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Responsabilité</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Notre responsabilité ne saurait être engagée en cas de force majeure ou de fait indépendant de 
                notre volonté. Nous ne sommes pas responsables des dommages résultant d'une mauvaise utilisation 
                des produits achetés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Litiges</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Les présentes CGV sont soumises au droit algérien. En cas de litige, une solution amiable sera 
                recherchée avant toute action judiciaire. À défaut, les tribunaux algériens seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
              </p>
              <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300 mt-3">
                <li>📧 Email : contact@thanout.com</li>
                <li>📱 Téléphone : +221 XX XXX XX XX</li>
                <li>📍 Adresse : Dakar, Sénégal</li>
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

export default CGV;

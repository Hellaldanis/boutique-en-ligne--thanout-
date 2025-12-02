import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Merci ! Vous êtes inscrit à notre newsletter avec l'email: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Service Client</h3>
            <ul className="mt-6 space-y-4" role="list">
              <li><button onClick={() => alert('FAQ - Fonctionnalité à venir')} className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left">FAQ</button></li>
              <li><button onClick={() => alert('Contact - Fonctionnalité à venir')} className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left">Contactez-nous</button></li>
              <li><button onClick={() => alert('Livraison & Retours - Fonctionnalité à venir')} className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left">Livraison & Retours</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">À Propos</h3>
            <ul className="mt-6 space-y-4" role="list">
              <li><button onClick={() => alert('Notre Histoire - Fonctionnalité à venir')} className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left">Notre Histoire</button></li>
              <li><button onClick={() => alert('Carrières - Fonctionnalité à venir')} className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left">Carrières</button></li>
              <li><button onClick={() => alert('Presse - Fonctionnalité à venir')} className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-left">Presse</button></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Rejoignez notre newsletter</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Les dernières nouveautés, articles et ressources, envoyés chaque semaine.</p>
            <form onSubmit={handleNewsletterSubmit} className="mt-6 sm:flex sm:max-w-md">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:w-64 sm:text-sm sm:leading-6" 
                placeholder="Entrez votre email"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90" type="submit">
                  S'inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-900/10 dark:border-gray-200/10 pt-8">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">© 2024 Thanout Algérie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

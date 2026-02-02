import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }
    
    // Simulate newsletter subscription
    console.log(`Newsletter subscription: ${email}`);
    setSubscribed(true);
    setEmail('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white mb-4">Service Client</h3>
            <ul className="space-y-3" role="list">
              <li><Link to="/contact" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Contactez-nous</Link></li>
              <li><Link to="/orders" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Suivre ma commande</Link></li>
              <li><Link to="/contact" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Livraison & Retours</Link></li>
              <li><Link to="/contact" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white mb-4">Informations légales</h3>
            <ul className="space-y-3" role="list">
              <li><Link to="/cgv" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">CGV</Link></li>
              <li><Link to="/mentions-legales" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Mentions Légales</Link></li>
              <li><Link to="/politique-confidentialite" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white mb-4">Shopping</h3>
            <ul className="space-y-3" role="list">
              <li><Link to="/categories" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Catégories</Link></li>
              <li><Link to="/nouveautes" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Nouveautés</Link></li>
              <li><Link to="/promotions" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Promotions</Link></li>
              <li><Link to="/favorites" className="text-sm leading-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Mes Favoris</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Inscrivez-vous pour recevoir nos offres exclusives et nouveautés !
            </p>
            
            {subscribed ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-4 text-center">
                <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                  ✓ Inscription réussie !
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Merci de vous être inscrit
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className="w-full appearance-none rounded-lg border-0 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary" 
                    placeholder="Votre email"
                  />
                  {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                  )}
                </div>
                <button 
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors" 
                  type="submit"
                >
                  <span className="material-symbols-outlined text-base">mail</span>
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              © 2026 Thanout. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

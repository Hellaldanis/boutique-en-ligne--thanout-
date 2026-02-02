import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <div className="w-32 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Page Introuvable
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Retour à l'accueil
            </Link>
            <Link
              to="/categories"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
            >
              Voir les catégories
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              to="/nouveautes"
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-semibold mb-1">Nouveautés</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Découvrez nos derniers produits
              </p>
            </Link>
            
            <Link
              to="/promotions"
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">🏷️</div>
              <h3 className="font-semibold mb-1">Promotions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Profitez des meilleures offres
              </p>
            </Link>
            
            <Link
              to="/search"
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Recherche</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trouvez ce que vous cherchez
              </p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;

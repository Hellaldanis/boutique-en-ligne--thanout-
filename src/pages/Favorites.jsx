import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useFavoritesStore } from '../store';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

function Favorites() {
  const { items: favorites, clearFavorites } = useFavoritesStore();
  const [apiLoaded, setApiLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.FAVORITES.LIST, {
          headers: getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          // API favorites loaded successfully
          setApiLoaded(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 px-4 sm:px-6 lg:px-10 py-8">
        {/* En-tête */}
        <div className="max-w-7xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                Mes Favoris
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {favorites.length === 0 
                  ? "Vous n'avez pas encore de favoris" 
                  : `${favorites.length} produit${favorites.length > 1 ? 's' : ''} dans vos favoris`
                }
              </p>
            </div>

            {favorites.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFavorites}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
                Tout supprimer
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Contenu */}
        <div className="max-w-7xl mx-auto">
          {favorites.length === 0 ? (
            // État vide
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="mb-6"
              >
                <span className="material-symbols-outlined text-gray-300 dark:text-gray-700" style={{ fontSize: '120px' }}>
                  favorite_border
                </span>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Aucun favori pour le moment
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Ajoutez des produits à vos favoris en cliquant sur le cœur ❤️ pour les retrouver facilement plus tard
              </p>

              <Link to="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                >
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Découvrir nos produits
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            // Grille de produits favoris
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {favorites.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    lightbulb
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Conseil
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Vous pouvez ajouter vos produits favoris au panier directement depuis cette page ou les comparer entre eux !
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/categories">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                      Continuer mes achats
                    </motion.button>
                  </Link>
                  <Link to="/promotions">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined">local_offer</span>
                      Voir les promotions
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Favorites;

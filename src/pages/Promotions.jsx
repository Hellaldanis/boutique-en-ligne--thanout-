import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

function Promotions() {
  const [sortBy, setSortBy] = useState('discount-desc');
  const [viewMode, setViewMode] = useState('grid');

  // Filter only products with discount
  const promotionProducts = useMemo(() => {
    let filtered = products.filter(product => product.discount && product.discount > 0);

    switch (sortBy) {
      case 'discount-desc':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'discount-asc':
        filtered.sort((a, b) => (a.discount || 0) - (b.discount || 0));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [sortBy]);

  const totalSavings = promotionProducts.reduce((sum, product) => {
    if (product.oldPrice) {
      return sum + (product.oldPrice - product.price);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="px-4 sm:px-6 lg:px-10 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-red-600 p-12 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4"
            >
              <span className="text-6xl">🔥</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Promotions Exclusives
            </h1>
            
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Profitez de réductions exceptionnelles sur une sélection de produits premium
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
                <div className="text-4xl font-black text-white">{promotionProducts.length}</div>
                <div className="text-white/90 font-medium">Produits en promo</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 min-w-[200px]">
                <div className="text-4xl font-black text-white">
                  {new Intl.NumberFormat('fr-DZ').format(totalSavings)} DA
                </div>
                <div className="text-white/90 font-medium">Économies totales</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tous les produits en promotion
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {promotionProducts.length} produit{promotionProducts.length > 1 ? 's' : ''} disponible{promotionProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
            >
              <option value="discount-desc">Plus grande réduction</option>
              <option value="discount-asc">Plus petite réduction</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>

            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {promotionProducts.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {promotionProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🎁</span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Aucune promotion disponible
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Revenez bientôt pour découvrir nos nouvelles offres !
            </p>
          </motion.div>
        )}

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">
            🎉 Inscrivez-vous à notre newsletter
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Soyez les premiers informés de nos promotions exclusives et nouveautés
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              S'inscrire
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default Promotions;

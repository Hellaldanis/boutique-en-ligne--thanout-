import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Baskets Urbaines Premium',
    category: 'Chaussures',
    price: 15000,
    oldPrice: 20000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop',
    rating: 4.5,
    reviews: 128,
    tags: ['sport', 'casual', 'confort']
  },
  {
    id: 2,
    name: 'Sac à Main en Cuir Véritable',
    category: 'Accessoires',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=400&fit=crop',
    rating: 5,
    reviews: 89,
    tags: ['luxe', 'élégant', 'cuir']
  },
  {
    id: 3,
    name: 'T-Shirt Essentiel Cotton Bio',
    category: 'Mode',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    rating: 4,
    reviews: 203,
    tags: ['basique', 'confortable', 'bio']
  },
  {
    id: 4,
    name: 'Montre Classique Automatique',
    category: 'Accessoires',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    rating: 4.5,
    reviews: 156,
    tags: ['élégant', 'automatique', 'classique']
  },
  {
    id: 5,
    name: 'Écouteurs Sans Fil Pro',
    category: 'Électronique',
    price: 18000,
    oldPrice: 24000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop',
    rating: 4.8,
    reviews: 312,
    tags: ['audio', 'bluetooth', 'premium']
  },
  {
    id: 6,
    name: 'Veste en Jean Délavé',
    category: 'Mode',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    rating: 4.3,
    reviews: 95,
    tags: ['denim', 'vintage', 'casual']
  },
];

function ProductsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['Tous', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <section className="mt-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
              Nos Produits
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prix: {priceRange[0]} - {priceRange[1]} DA
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="popular">Plus populaires</option>
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Affichage</label>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined">grid_view</span>
                Grille
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined">view_list</span>
                Liste
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredProducts.map((product, index) => (
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
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
              search_off
            </span>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Essayez de modifier vos filtres de recherche
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ProductsSection;

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

function Categories() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat');
  const initialQuery = searchParams.get('q');
  const filterParam = searchParams.get('filter');

  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  // Update selected category when URL param changes
  useEffect(() => {
    if (initialCategory) {
      const categoryMap = {
        'electronique': 'Électronique',
        'mode': 'Mode',
        'maison': 'Maison',
        'gaming': 'Gaming',
        'livres': 'Livres',
        'supermarche': 'Supermarché',
        'accessoires': 'Accessoires',
        'chaussures': 'Chaussures'
      };
      
      const mappedCategory = categoryMap[initialCategory.toLowerCase()] || initialCategory;
      setSelectedCategory(mappedCategory);
    }
  }, [initialCategory]);

  const categories = ['Tous', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Filter by special filters (promotions, new)
      let matchesFilter = true;
      if (filterParam === 'promotions') {
        matchesFilter = product.discount && product.discount > 0;
      } else if (filterParam === 'new') {
        matchesFilter = product.isNew === true;
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesFilter;
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
    <>
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Nos Catégories</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez notre large sélection de produits
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-4">Prix</h3>
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>{priceRange[0]} DA</span>
                <span>{priceRange[1]} DA</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm"
                >
                  <option value="popular">Plus populaires</option>
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                </select>

                <div className="flex gap-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'grid'
                        ? 'bg-gray-100 dark:bg-gray-700 text-primary'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined">grid_view</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list'
                        ? 'bg-gray-100 dark:bg-gray-700 text-primary'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
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
                  className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Categories;

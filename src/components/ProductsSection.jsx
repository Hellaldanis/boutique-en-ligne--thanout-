import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { API_ENDPOINTS } from '../config/api';
import { normalizeProductCollection } from '../utils/product';

function ProductsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const categoryOptions = useMemo(() => ['Tous', ...categories.map((cat) => cat.name)], [categories]);

  const resolveCategoryId = useCallback(() => {
    if (selectedCategory === 'Tous') {
      return null;
    }
    const category = categories.find((cat) => cat.name === selectedCategory);
    return category?.id ?? null;
  }, [categories, selectedCategory]);

  const buildSortParams = () => {
    switch (sortBy) {
      case 'price-asc':
        return { sortBy: 'price', sortOrder: 'asc' };
      case 'price-desc':
        return { sortBy: 'price', sortOrder: 'desc' };
      case 'newest':
        return { sortBy: 'createdAt', sortOrder: 'desc' };
      case 'popular':
        return { sortBy: 'viewCount', sortOrder: 'desc' };
      default:
        return { sortBy: 'createdAt', sortOrder: 'desc' };
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES.LIST);
      if (!response.ok) {
        throw new Error('Impossible de charger les catégories');
      }
      const data = await response.json();
      setCategories(data || []);
    } catch (err) {
      console.error('Categories fetch error:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('limit', '24');
      params.set('page', String(page));
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }
      const categoryId = resolveCategoryId();
      if (categoryId) {
        params.set('categoryId', String(categoryId));
      }
      if (priceRange[0] > 0) {
        params.set('minPrice', String(priceRange[0]));
      }
      if (priceRange[1] < 50000) {
        params.set('maxPrice', String(priceRange[1]));
      }

      const { sortBy: sortField, sortOrder } = buildSortParams();
      params.set('sortBy', sortField);
      params.set('sortOrder', sortOrder);

      const response = await fetch(`${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`);
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || 'Impossible de charger les produits');
      }

      const data = await response.json();
      const normalized = normalizeProductCollection(data);
      setProducts(Array.isArray(normalized?.products) ? normalized.products : []);
      setPagination(normalized?.pagination || null);
    } catch (err) {
      console.error('Products fetch error:', err);
      setError(err.message || 'Impossible de charger les produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, resolveCategoryId, priceRange, sortBy, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayedProducts = useMemo(() => {
    if (sortBy === 'rating') {
      return [...products].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
    return products;
  }, [products, sortBy]);

  const totalCount = pagination?.total ?? displayedProducts.length;

  return (
    <section className="mt-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
              Nos Produits
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {totalCount} produit{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
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
              onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
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
              {categoryOptions.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => {
                    setPage(1);
                    setSelectedCategory(cat);
                  }}
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
              onChange={(e) => {
                setPage(1);
                setPriceRange([priceRange[0], parseInt(e.target.value, 10)]);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setPage(1);
                setSortBy(e.target.value);
              }}
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

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {displayedProducts.length > 0 ? (
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
              {displayedProducts.map((product, index) => (
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
      )}

      {pagination?.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} sur {pagination.pages}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((prev) => (pagination ? Math.min(pagination.pages, prev + 1) : prev))}
              disabled={page === pagination.pages}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductsSection;

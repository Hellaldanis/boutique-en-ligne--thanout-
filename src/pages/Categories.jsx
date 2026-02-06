import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { API_ENDPOINTS } from '../config/api';
import { getNormalizedProductArray } from '../utils/product';

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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const mapSortParams = useCallback(() => {
    switch (sortBy) {
      case 'price-asc':
        return { field: 'price', order: 'asc' };
      case 'price-desc':
        return { field: 'price', order: 'desc' };
      case 'newest':
        return { field: 'createdAt', order: 'desc' };
      case 'popular':
        return { field: 'viewCount', order: 'desc' };
      case 'rating':
        return { field: 'createdAt', order: 'desc' };
      default:
        return { field: 'createdAt', order: 'desc' };
    }
  }, [sortBy]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES.LIST);
      if (!response.ok) {
        throw new Error('Impossible de charger les catégories');
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur catégories:', err);
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

      if (filterParam === 'promotions') {
        params.set('onSale', 'true');
      }
      if (filterParam === 'new') {
        params.set('isNew', 'true');
      }

      const { field, order } = mapSortParams();
      params.set('sortBy', field);
      params.set('sortOrder', order);

      const response = await fetch(`${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`);
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || 'Impossible de charger les produits');
      }

      const data = await response.json();
      setProducts(getNormalizedProductArray(data));
      setPagination(data?.pagination || null);
    } catch (err) {
      console.error('Erreur produits:', err);
      setError(err.message || 'Impossible de charger les produits');
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, resolveCategoryId, priceRange, mapSortParams, filterParam, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [filterParam]);

  // Update selected category when URL param changes
  useEffect(() => {
    if (initialCategory) {
      const normalized = initialCategory.toLowerCase();
      const match = categories.find((cat) => cat.slug?.toLowerCase() === normalized);
      if (match) {
        setSelectedCategory(match.name);
        setPage(1);
        return;
      }

      const categoryMap = {
        electronique: 'Électronique',
        mode: 'Mode',
        maison: 'Maison',
        gaming: 'Gaming',
        livres: 'Livres',
        supermarche: 'Supermarché',
        accessoires: 'Accessoires',
        chaussures: 'Chaussures'
      };

      const mappedCategory = categoryMap[normalized] || initialCategory;
      setSelectedCategory(mappedCategory);
      setPage(1);
    }
  }, [initialCategory, categories]);

  const displayedProducts = useMemo(() => {
    if (sortBy === 'rating') {
      return [...products].sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0));
    }
    return products;
  }, [products, sortBy]);

  const totalCount = pagination?.total ?? displayedProducts.length;

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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Catégories</h3>
              <div className="space-y-2">
                {categoryOptions.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                    }}
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
                onChange={(e) => {
                  setPriceRange([0, parseInt(e.target.value, 10)]);
                  setPage(1);
                }}
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
                {totalCount} produit{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
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
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
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
            )}

            {pagination?.pages > 1 && !loading && (
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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Categories;

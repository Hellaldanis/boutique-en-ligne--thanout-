import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { API_ENDPOINTS } from '../config/api';

function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('relevance');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PRODUCTS.LIST);
        if (response.ok) {
          const data = await response.json();
          const productsData = data.products || data || [];
          setProducts(productsData);
          const uniqueCategories = ['all', ...new Set(productsData.map(p => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products;

    // Filtre par recherche
    if (searchQuery.trim()) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Filtre par prix
    results = results.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Tri
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // relevance - garde l'ordre par défaut
        break;
    }

    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 50000]);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary focus:outline-none shadow-lg pr-16 sm:pr-32"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">🔍 Rechercher</span>
                <span className="sm:hidden">🔍</span>
              </button>
            </div>
          </form>
          
          {searchQuery && (
            <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
              Résultats pour : <strong className="text-primary">"{searchQuery}"</strong>
            </p>
          )}
        </div>

        {/* Bouton Filtres Mobile */}
        <div className="lg:hidden mb-4 flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined">tune</span>
            <span className="font-medium">Filtres</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary"
          >
            <option value="relevance">Pertinence</option>
            <option value="price-asc">Prix ↑</option>
            <option value="price-desc">Prix ↓</option>
            <option value="name">Nom A-Z</option>
            <option value="newest">Nouveautés</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filtres */}
          <aside className="lg:col-span-1">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:sticky lg:top-24 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filtres</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Catégories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Catégorie</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:border-primary"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Toutes les catégories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Prix (DA)</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Min</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Max</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="pt-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Tri - Hidden on mobile */}
              <div className="hidden lg:block">
                <h3 className="font-semibold mb-3">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:border-primary"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <strong>{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-20">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Aucun résultat</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 px-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Search;

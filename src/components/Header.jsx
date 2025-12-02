import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore, useFavoritesStore, useCompareStore } from '../store';
import CartDrawer from './CartDrawer';
import CompareModal from './CompareModal';

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { items } = useCartStore();
  const { items: favorites } = useFavoritesStore();
  const { items: compareItems } = useCompareStore();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-10 py-3 w-full bg-background-light dark:bg-background-dark sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 36L16.2353 22.5L24 32.5L34.2353 18.5L42 36H6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M30 14C32.2091 14 34 12.2091 34 10C34 7.79086 32.2091 6 30 6C27.7909 6 26 7.79086 26 10C26 12.2091 27.7909 14 30 14Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Thanout</h2>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Accueil</Link>
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" to="/categories">Produits</Link>
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" to="/categories">Catégories</Link>
            <a className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="#">Promotions</a>
            <a className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" href="#">Nouveautés</a>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-2 sm:gap-4">
          <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-gray-500 dark:text-gray-400 flex bg-gray-100 dark:bg-gray-800 items-center justify-center pl-3 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-gray-100 dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-sm" 
                placeholder="Rechercher un produit..." 
              />
            </div>
          </label>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-xl">person</span>
            </button>
            <button className="flex sm:hidden cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCompareOpen(true)}
              className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
              title="Comparer les produits"
            >
              <span className="material-symbols-outlined text-xl">compare</span>
              {compareItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {compareItems.length}
                </motion.span>
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              {favorites.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {favorites.length}
                </motion.span>
              )}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
              title="Panier"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {items.length}
                </motion.span>
              )}
            </motion.button>
            <Link to="/cart">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hidden sm:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors gap-2"
                title="Voir le panier"
              >
                <span className="material-symbols-outlined text-xl">shopping_cart</span>
                <span>Panier</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </>
  );
}

export default Header;

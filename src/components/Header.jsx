import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useFavoritesStore, useSearchStore } from '../store';
import CartDrawer from './CartDrawer';

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { items } = useCartStore();
  const { items: favorites } = useFavoritesStore();
  const { addRecentSearch } = useSearchStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      addRecentSearch(searchInput.trim());
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      addRecentSearch(searchInput.trim());
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Vérifier le mode sombre au chargement
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
                     (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const menuItemVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1
      }
    })
  };

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-10 py-3 w-full bg-background-light dark:bg-background-dark sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className="flex items-center gap-8">
          {/* Menu Hamburger Mobile */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex flex-col gap-1.5 w-5">
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 8 : 0
                }}
                className="w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1
                }}
                className="w-full h-0.5 bg-current rounded-full"
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -8 : 0
                }}
                className="w-full h-0.5 bg-current rounded-full"
              />
            </div>
          </motion.button>

          <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 36L16.2353 22.5L24 32.5L34.2353 18.5L42 36H6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M30 14C32.2091 14 34 12.2091 34 10C34 7.79086 32.2091 6 30 6C27.7909 6 26 7.79086 26 10C26 12.2091 27.7909 14 30 14Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Thanout</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" to="/categories">Catégories</Link>
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" to="/promotions">Promotions</Link>
            <Link className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" to="/nouveautes">Nouveautés</Link>
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
              />
              {searchInput && (
                <button
                  onClick={handleSearchClick}
                  className="bg-gray-100 dark:bg-gray-800 pr-3 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              )}
            </div>
          </label>
          <div className="flex gap-2">
            {/* Dark Mode Toggle */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              <motion.span 
                className="material-symbols-outlined text-xl"
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </motion.span>
            </motion.button>

            <Link to="/search" className="flex sm:hidden">
              <button className="cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors flex">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </Link>
            
            <Link to="/favorites">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
                title="Mes favoris"
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
            </Link>

            {/* Affichage conditionnel selon l'état de connexion */}
            {isLoggedIn ? (
              <>
                {/* Utilisateur connecté - Afficher le panier et profil */}
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors"
                  title="Mon profil"
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                </button>
                
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
              </>
            ) : (
              <>
                {/* Utilisateur non connecté - Afficher Connexion et Inscription */}
                <Link to="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">login</span>
                    <span>Connexion</span>
                  </motion.button>
                </Link>
                
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">person_add</span>
                    <span>Inscription</span>
                  </motion.button>
                </Link>
                
                {/* Bouton mobile pour connexion */}
                <button 
                  onClick={() => navigate('/login')}
                  className="flex sm:hidden cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors"
                  title="Se connecter"
                >
                  <span className="material-symbols-outlined text-xl">login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header du menu */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h3>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {[
                    { to: '/', label: 'Accueil', icon: 'home' },
                    { to: '/categories', label: 'Catégories', icon: 'category' },
                    { to: '/promotions', label: 'Promotions', icon: 'local_offer' },
                    { to: '/nouveautes', label: 'Nouveautés', icon: 'new_releases' },
                    { to: '/search', label: 'Rechercher', icon: 'search' },
                    { to: '/favorites', label: 'Favoris', icon: 'favorite', badge: favorites.length },
                    { to: '/cart', label: 'Panier', icon: 'shopping_cart', badge: items.length }
                  ].map((link, i) => (
                    <motion.div
                      key={link.to}
                      custom={i}
                      variants={menuItemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                          {link.icon}
                        </span>
                        <span className="flex-1 font-medium text-gray-900 dark:text-white">
                          {link.label}
                        </span>
                        {link.badge > 0 && (
                          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

                {/* User Section */}
                <motion.div
                  custom={7}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    to={isLoggedIn ? '/profile' : '/login'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary">
                      {isLoggedIn ? 'account_circle' : 'login'}
                    </span>
                    <span className="flex-1 font-medium text-primary">
                      {isLoggedIn ? 'Mon Profil' : 'Se connecter'}
                    </span>
                    <span className="material-symbols-outlined text-primary">
                      chevron_right
                    </span>
                  </Link>
                </motion.div>

                {/* Footer du menu */}
                <motion.div
                  custom={8}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Thanout © 2026
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Header;

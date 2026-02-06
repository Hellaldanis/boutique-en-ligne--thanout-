import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useFavoritesStore } from '../store';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [showAddedNotification, setShowAddedNotification] = React.useState(false);

  if (!product) {
    return null;
  }

  const displayImage = product.image;
  const roundedRating = Math.round(product.rating || 0);
  const reviewCount = product.reviews || product.reviewCount || 0;

  const handleAddToCart = () => {
    addItem(product);
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Ajouter au panier
    addItem(product);
    // Rediriger directement vers le checkout
    navigate('/checkout');
  };

  const productIsFavorite = isFavorite(product.id);

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700/50 group cursor-pointer relative"
        whileHover={{ y: -8, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      {/* Notifications */}
      <AnimatePresence>
        {showAddedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium z-10 shadow-lg"
          >
            ✓ Ajouté au panier
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <div className="relative overflow-hidden">
        <motion.img 
          className="w-full h-64 object-cover" 
          src={displayImage}
          alt={product.name}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badge réduction */}
        {product.discount > 0 && (
          <motion.div 
            className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            -{product.discount}%
          </motion.div>
        )}

        {/* Boutons actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <motion.button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product);
            }}
            className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all ${
              productIsFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Ajouter aux favoris"
          >
            <motion.span 
              className="material-symbols-outlined"
              animate={{ scale: productIsFavorite ? [1, 1.3, 1] : 1 }}
              style={{ fontVariationSettings: productIsFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </motion.span>
          </motion.button>
        </div>

        {/* Aperçu rapide */}
        <motion.div
          className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ y: 20 }}
        >
          <motion.button
            className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white py-2 rounded-lg font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Aperçu rapide
          </motion.button>
        </motion.div>
      </div>

      {/* Infos produit */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {product.category || 'Sans catégorie'}
        </p>
        
        {/* Note */}
        {roundedRating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: i < roundedRating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
        )}

        {/* Prix */}
        <div className="mt-3 flex items-baseline gap-2">
          <p className="font-bold text-xl text-primary">
            {new Intl.NumberFormat('fr-DZ').format(product.price)} DA
          </p>
          {product.oldPrice && (
            <p className="text-sm text-gray-400 line-through">
              {new Intl.NumberFormat('fr-DZ').format(product.oldPrice)} DA
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="mt-3 flex gap-2">
          {/* Bouton Acheter maintenant */}
          <motion.button
            onClick={handleBuyNow}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 overflow-hidden relative group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Acheter directement"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 material-symbols-outlined text-xl">bolt</span>
            <span className="relative z-10 hidden sm:inline">Acheter</span>
          </motion.button>

          {/* Bouton Ajouter au panier */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 overflow-hidden relative group/btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Ajouter au panier"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 material-symbols-outlined text-xl">shopping_cart</span>
            <span className="relative z-10 hidden sm:inline">Panier</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

export default ProductCard;

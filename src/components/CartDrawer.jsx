import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store';

function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Panier
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {items.length} article{items.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
                    shopping_cart
                  </span>
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    Ajoutez des produits pour commencer
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex gap-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {new Intl.NumberFormat('fr-DZ').format(item.price)} DA
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('fr-DZ').format(item.price * item.quantity)} DA
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="w-full py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                    >
                      Vider le panier
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4"
              >
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat('fr-DZ').format(getTotal())} DA
                  </span>
                </div>
                <button className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
                  Commander maintenant
                  <motion.span
                    className="material-symbols-outlined"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    arrow_forward
                  </motion.span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;

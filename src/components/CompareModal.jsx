import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompareStore } from '../store';

function CompareModal({ isOpen, onClose }) {
  const { items, removeFromCompare, clearCompare } = useCompareStore();

  const features = [
    { key: 'name', label: 'Nom' },
    { key: 'price', label: 'Prix', format: (val) => `${new Intl.NumberFormat('fr-DZ').format(val)} DA` },
    { key: 'category', label: 'Catégorie' },
    { key: 'rating', label: 'Note', format: (val) => val ? `${val}/5 ⭐` : 'N/A' },
    { key: 'reviews', label: 'Avis', format: (val) => val || 'Aucun' },
    { key: 'discount', label: 'Réduction', format: (val) => val ? `${val}%` : 'Aucune' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Comparaison de produits
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {items.length} produit{items.length > 1 ? 's' : ''} en comparaison
                </p>
              </div>
              <div className="flex gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Tout effacer
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">
                    compare
                  </span>
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Aucun produit à comparer
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    Ajoutez des produits pour commencer la comparaison
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Parcourir les produits
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky left-0 bg-white dark:bg-gray-900 p-4 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 z-10">
                          Caractéristique
                        </th>
                        {items.map((product) => (
                          <th key={product.id} className="p-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col items-center gap-3 min-w-[200px]">
                              <div className="relative group">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removeFromCompare(product.id)}
                                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-sm text-red-500">close</span>
                                </button>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {features.map((feature, index) => (
                        <motion.tr
                          key={feature.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                        >
                          <td className="sticky left-0 bg-inherit p-4 font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 z-10">
                            {feature.label}
                          </td>
                          {items.map((product) => (
                            <td key={product.id} className="p-4 text-center border-b border-gray-200 dark:border-gray-800">
                              <span className="text-gray-700 dark:text-gray-300">
                                {feature.format
                                  ? feature.format(product[feature.key])
                                  : product[feature.key] || 'N/A'}
                              </span>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                      <tr>
                        <td className="sticky left-0 bg-white dark:bg-gray-900 p-4 font-medium text-gray-900 dark:text-white z-10">
                          Action
                        </td>
                        {items.map((product) => (
                          <td key={product.id} className="p-4 text-center">
                            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                              Voir le produit
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CompareModal;

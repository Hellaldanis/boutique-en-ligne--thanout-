import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartStore } from '../store';

function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = (e) => {
    e.preventDefault();
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      // Rediriger vers la page de connexion avec retour vers checkout
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      <main className="relative px-4 sm:px-6 lg:px-10 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-gray-500 hover:text-primary">Accueil</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">Panier</span>
          </nav>

          <h1 className="text-4xl font-bold mb-8">Mon Panier</h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg"
            >
              <span className="material-symbols-outlined text-8xl text-gray-300 dark:text-gray-700 mb-6">
                shopping_cart
              </span>
              <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Link
                to="/"
                className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Continuer mes achats
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg flex gap-6"
                  >
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg hover:scale-105 transition-transform"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {item.category}
                      </p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500">Taille: {item.selectedSize}</p>
                      )}
                      {item.selectedColor && (
                        <p className="text-sm text-gray-500">Couleur: {item.selectedColor}</p>
                      )}

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="px-4 font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined">delete</span>
                          Supprimer
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('fr-DZ').format(item.price * item.quantity)} DA
                      </p>
                      {item.oldPrice && (
                        <p className="text-sm text-gray-400 line-through mt-1">
                          {new Intl.NumberFormat('fr-DZ').format(item.oldPrice * item.quantity)} DA
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={clearCart}
                  className="w-full py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                >
                  Vider le panier
                </button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24"
                >
                  <h2 className="text-2xl font-bold mb-6">Résumé</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('fr-DZ').format(getTotal())} DA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                      <span className="font-semibold">Gratuite</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between text-xl">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">
                          {new Intl.NumberFormat('fr-DZ').format(getTotal())} DA
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="block w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold text-center hover:shadow-xl transition-all cursor-pointer"
                  >
                    Commander maintenant
                  </button>

                  <Link
                    to="/"
                    className="block w-full py-3 mt-3 text-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Continuer mes achats
                  </Link>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-primary">local_shipping</span>
                      <p>Livraison gratuite partout en Algérie</p>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 mt-3">
                      <span className="material-symbols-outlined text-primary">verified</span>
                      <p>Paiement sécurisé</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Cart;

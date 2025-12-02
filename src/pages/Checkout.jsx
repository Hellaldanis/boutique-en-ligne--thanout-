import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartStore } from '../store';

function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    wilaya: '',
    postalCode: '',
    paymentMethod: 'cash'
  });

  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 
    'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Tlemcen', 'Béjaïa'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation de commande
    alert('Commande confirmée ! Merci pour votre achat.');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
        </div>
        <Header />
        <main className="relative px-4 sm:px-6 lg:px-10 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-8xl text-gray-300 mb-6">shopping_cart</span>
            <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
            <Link to="/" className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-semibold">
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      <main className="relative px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link to="/" className="text-gray-500 hover:text-primary">Accueil</Link>
            <span className="text-gray-400">/</span>
            <Link to="/cart" className="text-gray-500 hover:text-primary">Panier</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">Commande</span>
          </nav>

          <h1 className="text-4xl font-bold mb-8">Finaliser la commande</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0555 12 34 56"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Wilaya *</label>
                      <select
                        name="wilaya"
                        required
                        value={formData.wilaya}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        {wilayas.map(wilaya => (
                          <option key={wilaya} value={wilaya}>{wilaya}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ville *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Code postal</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">Mode de paiement</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <div className="flex-1">
                      <p className="font-semibold">Paiement à la livraison</p>
                      <p className="text-sm text-gray-500">Payez en espèces lors de la réception</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="material-symbols-outlined text-primary">credit_card</span>
                    <div className="flex-1">
                      <p className="font-semibold">Carte bancaire</p>
                      <p className="text-sm text-gray-500">Paiement sécurisé en ligne</p>
                    </div>
                  </label>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24"
              >
                <h2 className="text-2xl font-bold mb-6">Récapitulatif</h2>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qté: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">
                        {new Intl.NumberFormat('fr-DZ').format(item.price * item.quantity)} DA
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                    <span className="font-semibold">{new Intl.NumberFormat('fr-DZ').format(getTotal())} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                    <span className="font-semibold text-green-500">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-xl pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">{new Intl.NumberFormat('fr-DZ').format(getTotal())} DA</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Confirmer la commande
                </button>
              </motion.div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;

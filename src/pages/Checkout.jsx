import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartStore, useOrderStore } from '../store';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const navigate = useNavigate();
  
  // Check if account is suspended
  const returns = JSON.parse(localStorage.getItem('returns') || '[]');
  const MAX_RETURNS = 3;
  const isAccountSuspended = returns.length >= MAX_RETURNS;

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
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 
    'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Tlemcen', 'Béjaïa'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleApplyPromo = async () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) return;

    setPromoLoading(true);
    setPromoError('');

    try {
      const response = await fetch(`${API_ENDPOINTS.PROMO_CODES.VALIDATE(code)}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setAppliedPromo({
          code: data.code,
          type: data.discountType,
          value: data.discountValue,
          description: data.description
        });
        setPromoError('');
      } else {
        const error = await response.json();
        setPromoError(error.message || 'Code promo invalide');
        setAppliedPromo(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setPromoError('Erreur lors de la validation du code promo');
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  };
  
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };
  
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    
    const subtotal = getTotal();
    
    if (appliedPromo.type === 'percentage') {
      return Math.floor((subtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'fixed') {
      return appliedPromo.value;
    }
    
    return 0;
  };
  
  const calculateShipping = () => {
    const baseShipping = 500;
    if (appliedPromo && appliedPromo.type === 'shipping') {
      return 0; // Free shipping
    }
    return baseShipping;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if account is suspended before processing
    if (isAccountSuspended) {
      alert('Votre compte est suspendu. Vous ne pouvez plus passer de commandes car vous avez atteint le nombre maximum de retours autorisés (3). Veuillez contacter le service client.');
      return;
    }

    const subtotal = getTotal();
    const shipping = calculateShipping();
    const discount = calculateDiscount();
    const total = subtotal + shipping - discount;

    // Create order data
    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      })),
      subtotal,
      shipping,
      discount,
      total,
      promoCodeId: appliedPromo ? appliedPromo.id : null,
      paymentMethod: formData.paymentMethod,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        wilaya: formData.wilaya,
        postalCode: formData.postalCode
      }
    };

    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const data = await response.json();
        const newOrder = data.order || data;

        // Add order to local store for backward compatibility
        addOrder({
          ...orderData,
          id: newOrder.id,
          date: newOrder.createdAt || new Date().toISOString(),
          status: newOrder.status || 'pending'
        });

        // Clear cart
        clearCart();
        
        // Redirect to order confirmation
        navigate(`/order-confirmation/${newOrder.id}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la commande. Veuillez réessayer.');
    }
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
          
          {/* Account Suspension Warning */}
          {isAccountSuspended && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">
                    block
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">
                    ⛔ Compte Suspendu - Commande Impossible
                  </h3>
                  <p className="text-red-800 dark:text-red-200 mb-3">
                    Vous avez atteint le nombre maximum de retours autorisés ({MAX_RETURNS} retours). 
                    Votre compte est suspendu et vous ne pouvez plus passer de nouvelles commandes.
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Veuillez contacter le service client pour débloquer votre compte.
                  </p>
                  <Link 
                    to="/profile" 
                    className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Voir mon profil
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

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
                
                {/* Promo Code Section */}
                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium mb-2">Code promo</label>
                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError('');
                        }}
                        placeholder="Entrez votre code"
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        Appliquer
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <div>
                          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                            {appliedPromo.code}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-400">
                            {appliedPromo.description}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="mt-2 text-sm text-red-500">{promoError}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Codes disponibles: WELCOME10, THANOUT20, SAVE5000, FREESHIP
                  </div>
                </div>

                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                    <span className="font-semibold">{new Intl.NumberFormat('fr-DZ').format(getTotal())} DA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                    <span className={`font-semibold ${calculateShipping() === 0 ? 'text-green-500' : ''}`}>
                      {calculateShipping() === 0 ? 'Gratuite' : `${new Intl.NumberFormat('fr-DZ').format(calculateShipping())} DA`}
                    </span>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Réduction</span>
                      <span className="font-semibold text-green-500">
                        -{new Intl.NumberFormat('fr-DZ').format(calculateDiscount())} DA
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">
                      {new Intl.NumberFormat('fr-DZ').format(getTotal() + calculateShipping() - calculateDiscount())} DA
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAccountSuspended}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    isAccountSuspended 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-xl'
                  }`}
                >
                  {isAccountSuspended ? 'Compte suspendu' : 'Confirmer la commande'}
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

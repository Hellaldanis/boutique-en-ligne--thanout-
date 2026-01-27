import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useOrderStore } from '../store';

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrderStore();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Rediriger si la commande n'existe pas
        setTimeout(() => navigate('/'), 3000);
      }
    }
  }, [orderId, getOrderById, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Commande introuvable</h2>
          <p className="text-gray-600 dark:text-gray-400">Redirection vers l'accueil...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Animation de succès */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl sm:text-6xl">
              check_circle
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Commande confirmée !
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400">
            Merci pour votre achat. Votre commande a été enregistrée avec succès.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Informations de commande */}
          <div className="lg:col-span-2 space-y-6">
            {/* Détails de la commande */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Détails de la commande
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Numéro de commande</span>
                  <span className="font-mono font-bold text-primary">#{order.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Date</span>
                  <span className="font-medium">{new Date(order.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Statut</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">Mode de paiement</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Produits commandés */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                Produits commandés
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        {item.price.toLocaleString('fr-DZ')} DA
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm sm:text-base">
                        {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Adresse de livraison
              </h2>
              
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.phone}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.address}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.city}, {order.shippingAddress.wilaya}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Résumé</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Sous-total</span>
                  <span>{order.subtotal.toLocaleString('fr-DZ')} DA</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Livraison</span>
                  <span>{order.shipping.toLocaleString('fr-DZ')} DA</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{order.discount.toLocaleString('fr-DZ')} DA</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{order.total.toLocaleString('fr-DZ')} DA</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/" className="block">
                  <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                    Retour à l'accueil
                  </button>
                </Link>
                <Link to="/profile" className="block">
                  <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                    Voir mes commandes
                  </button>
                </Link>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary mt-1">mail</span>
                  <div>
                    <p className="text-sm font-medium">Email de confirmation</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Un email a été envoyé à {order.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-1">support_agent</span>
                  <div>
                    <p className="text-sm font-medium">Besoin d'aide ?</p>
                    <Link to="/contact" className="text-xs text-primary hover:underline">
                      Contactez notre service client
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Étapes de livraison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Suivi de commande</h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-6">
              {[
                { status: 'pending', label: 'Commande reçue', icon: 'check_circle', active: true },
                { status: 'confirmed', label: 'Commande confirmée', icon: 'verified', active: order.status !== 'pending' },
                { status: 'shipped', label: 'En cours de livraison', icon: 'local_shipping', active: ['shipped', 'delivered'].includes(order.status) },
                { status: 'delivered', label: 'Livrée', icon: 'home', active: order.status === 'delivered' }
              ].map((step, index) => (
                <div key={index} className="relative flex items-start gap-4 pl-12">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.active 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${step.active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderConfirmation;

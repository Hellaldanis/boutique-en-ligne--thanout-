import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useOrderStore } from '../store';

function Orders() {
  const navigate = useNavigate();
  const { getUserOrders } = useOrderStore();
  const orders = getUserOrders();
  const [filterStatus, setFilterStatus] = useState('all');

  // Vérifier si l'utilisateur est connecté
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="material-symbols-outlined text-8xl text-gray-300 dark:text-gray-700 mb-6">lock</span>
          <h2 className="text-2xl font-bold mb-4">Connexion requise</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Veuillez vous connecter pour voir vos commandes
          </p>
          <Link
            to="/login?redirect=orders"
            className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Se connecter
          </Link>
        </main>
        <Footer />
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary">Accueil</Link>
          <span className="text-gray-400">/</span>
          <Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-primary">Profil</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Mes commandes</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Mes commandes</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {orders.length} commande{orders.length > 1 ? 's' : ''} au total
            </p>
          </div>
          
          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'delivered'
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Livrées
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <span className="material-symbols-outlined text-8xl text-gray-300 dark:text-gray-700 mb-6">
              shopping_bag
            </span>
            <h3 className="text-2xl font-bold mb-2">Aucune commande</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {filterStatus === 'all' 
                ? "Vous n'avez pas encore passé de commande"
                : `Aucune commande ${getStatusLabel(filterStatus).toLowerCase()}`
              }
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Commencer mes achats
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* En-tête de la commande */}
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Commande</p>
                        <p className="font-mono font-bold text-primary">#{order.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                        <p className="font-medium">
                          {new Date(order.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="font-bold">{order.total.toLocaleString('fr-DZ')} DA</p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Produits de la commande */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quantité: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {item.price.toLocaleString('fr-DZ')} DA
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {(item.price * item.quantity).toLocaleString('fr-DZ')} DA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
                    >
                      Voir les détails
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Racheter
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button className="flex-1 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Orders;

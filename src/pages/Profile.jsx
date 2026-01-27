import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
  const returns = JSON.parse(localStorage.getItem('returns') || '[]');
  const MAX_RETURNS = 3;

  // Calculate statistics
  const totalPurchased = purchaseHistory.reduce((sum, order) => sum + (order.items?.length || 0), 0);
  const totalReturned = returns.length;
  const totalSpent = purchaseHistory.reduce((sum, order) => sum + (order.total || 0), 0);
  const isAccountSuspended = totalReturned >= MAX_RETURNS;
  const returnsRemaining = Math.max(0, MAX_RETURNS - totalReturned);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  // If not logged in, redirect
  if (!user.email) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Mon Profil'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                {user.phone && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{user.phone}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Purchased */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Acheté</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalPurchased}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Produits</p>
              </div>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">
                  shopping_bag
                </span>
              </div>
            </div>
          </div>

          {/* Total Returned */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${
            isAccountSuspended ? 'border-red-500' : totalReturned >= 2 ? 'border-orange-500' : 'border-yellow-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Compteur de Retours</p>
                <p className={`text-4xl font-bold mt-2 ${
                  isAccountSuspended ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                }`}>{totalReturned}/{MAX_RETURNS}</p>
                <p className={`text-sm mt-1 font-medium ${
                  isAccountSuspended ? 'text-red-600 dark:text-red-400' : 
                  totalReturned >= 2 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500'
                }`}>
                  {isAccountSuspended ? 'Compte suspendu' : `${returnsRemaining} restant(s)`}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isAccountSuspended ? 'bg-red-100 dark:bg-red-900/30' : 
                totalReturned >= 2 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                <span className={`material-symbols-outlined text-3xl ${
                  isAccountSuspended ? 'text-red-600 dark:text-red-400' : 
                  totalReturned >= 2 ? 'text-orange-600 dark:text-orange-400' : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {isAccountSuspended ? 'block' : 'assignment_return'}
                </span>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Dépensé</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalSpent.toLocaleString('fr-DZ')}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">DA</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">
                  payments
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Suspension Warning */}
        {isAccountSuspended && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">
                  ⚠️ Compte Suspendu
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-3">
                  Vous avez atteint le nombre maximum de retours autorisés ({MAX_RETURNS} retours). 
                  Votre compte est temporairement suspendu et vous ne pouvez plus passer de nouvelles commandes.
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Veuillez contacter le service client pour plus d'informations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning when approaching limit */}
        {!isAccountSuspended && totalReturned >= 2 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-3xl">
                  info
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">
                  Attention : Limite de retours bientôt atteinte
                </h3>
                <p className="text-orange-800 dark:text-orange-200">
                  Il vous reste {returnsRemaining} retour(s) autorisé(s). Après {MAX_RETURNS} retours, 
                  votre compte sera suspendu et vous ne pourrez plus commander.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historique des Commandes</h2>
            <Link 
              to="/orders"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Voir tout
            </Link>
          </div>
          
          {purchaseHistory.length > 0 ? (
            <div className="space-y-4">
              {purchaseHistory.slice(0, 3).map((order, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Commande #{order.id || index + 1}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(order.date).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium mt-2">
                        {order.items?.length || 0} produit(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {order.total?.toLocaleString('fr-DZ') || 0} DA
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status === 'delivered' ? 'Livré' : order.status === 'shipped' ? 'En cours' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                shopping_cart
              </span>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Aucune commande pour le moment</p>
              <Link 
                to="/categories" 
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Commencer vos achats
              </Link>
            </div>
          )}
        </div>

        {/* Returns Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Produits Retournés</h2>
          
          {returns.length > 0 ? (
            <div className="space-y-4">
              {returns.map((returnItem, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{returnItem.productName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Raison: {returnItem.reason || 'Non spécifié'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(returnItem.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      returnItem.status === 'refunded' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      returnItem.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {returnItem.status === 'refunded' ? 'Remboursé' : 
                       returnItem.status === 'processing' ? 'En traitement' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                assignment_return
              </span>
              <p className="text-gray-600 dark:text-gray-400">Aucun produit retourné</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;

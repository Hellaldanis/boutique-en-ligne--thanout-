import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { API_ENDPOINTS, getAuthHeaders } from '../../config/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.DASHBOARD, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      setStats({
        totalRevenue: data.stats.revenue.total,
        revenueChange: data.stats.revenue.change,
        totalOrders: data.stats.orders.total,
        ordersChange: data.stats.orders.change,
        totalUsers: data.stats.users.total,
        usersChange: data.stats.users.change,
        totalProducts: data.stats.products.total,
        productsChange: data.stats.products.change,
        recentOrders: data.recentOrders.map(order => ({
          id: order.id,
          customer: `${order.user.firstName} ${order.user.lastName}`,
          amount: order.totalAmount,
          status: order.status,
          date: new Date(order.createdAt).toISOString().split('T')[0]
        })),
        topProducts: data.topProducts.map(product => ({
          name: product.name,
          sales: product.salesCount,
          revenue: product.revenue
        }))
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          title="Revenu Total"
          value={`${stats.totalRevenue.toLocaleString()} DA`}
          change={stats.revenueChange}
          color="bg-green-500"
        />
        <StatCard
          icon={ShoppingCart}
          title="Commandes"
          value={stats.totalOrders}
          change={stats.ordersChange}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Utilisateurs"
          value={stats.totalUsers}
          change={stats.usersChange}
          color="bg-purple-500"
        />
        <StatCard
          icon={Package}
          title="Produits"
          value={stats.totalProducts}
          change={stats.productsChange}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Commandes Récentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {order.customer}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString('fr-DZ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">
                      {order.amount.toLocaleString()} DA
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Produits les Plus Vendus
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white">
                    {product.revenue.toLocaleString()} DA
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

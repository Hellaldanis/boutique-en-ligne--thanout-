import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../store';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const { user, fetchProfile, hydrateFromLegacyStorage, logout } = useAuthStore((state) => ({
    user: state.user,
    fetchProfile: state.fetchProfile,
    hydrateFromLegacyStorage: state.hydrateFromLegacyStorage,
    logout: state.logout
  }));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        hydrateFromLegacyStorage();
        let currentUser = user;
        if (!currentUser) {
          currentUser = await fetchProfile();
        }

        const hasAdminAccess = currentUser?.adminUser?.role === 'super_admin' || currentUser?.adminUser?.role === 'admin';

        if (!hasAdminAccess) {
          navigate('/login');
          return;
        }

        setAdminUser(currentUser);
        setIsAuthorized(true);
      } catch (error) {
        console.error('Erreur vérification admin:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [user, fetchProfile, hydrateFromLegacyStorage, navigate]);

  const handleLogout = () => {
    logout().finally(() => navigate('/login'));
  };

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger si non autorisé
  if (!isAuthorized) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Produits', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Commandes', path: '/admin/orders' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Tag, label: 'Codes Promo', path: '/admin/promo-codes' },
    { icon: BarChart3, label: 'Statistiques', path: '/admin/statistics' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-5 px-3">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Admin Thanout
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="absolute bottom-4 left-3 right-3">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {adminUser?.firstName} {adminUser?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                  <Shield className="w-3 h-3" />
                  {adminUser?.adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                {adminUser?.firstName?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

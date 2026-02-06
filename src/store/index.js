import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_ENDPOINTS } from '../config/api';

const legacyAuthStorage = {
  save(user, token) {
    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      const isAdmin = user?.adminUser?.role === 'super_admin' || user?.adminUser?.role === 'admin';
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
    }
  },
  hydrate() {
    if (typeof window === 'undefined') {
      return { user: null, token: null, isLoggedIn: false };
    }

    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (storedUser && token && isLoggedIn) {
        return {
          user: JSON.parse(storedUser),
          token,
          isLoggedIn: true
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'hydratation legacy:', error);
    }

    return { user: null, token: null, isLoggedIn: false };
  }
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'thanout-cart',
    }
  )
);

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      toggleFavorite: (product) => {
        const items = get().items;
        const exists = items.find(item => item.id === product.id);
        
        if (exists) {
          set({ items: items.filter(item => item.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
      
      isFavorite: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'thanout-favorites',
    }
  )
);

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'thanout-theme',
    }
  )
);

export const useSearchStore = create((set) => ({
  searchQuery: '',
  recentSearches: [],
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addRecentSearch: (query) => {
    set((state) => {
      const filtered = state.recentSearches.filter(q => q !== query);
      return {
        recentSearches: [query, ...filtered].slice(0, 5)
      };
    });
  },
  
  clearRecentSearches: () => set({ recentSearches: [] }),
}));

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (orderData) => {
        const newOrder = {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date: new Date().toISOString(),
          status: 'pending',
          ...orderData
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },
      
      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },
      
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        });
      },
      
      getUserOrders: () => {
        return get().orders;
      },
      
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'thanout-orders',
    }
  )
);

const buildAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export const useAuthStore = create(
  persist(
    (set, get) => {
      const legacyState = legacyAuthStorage.hydrate();
      return {
        user: legacyState.user,
        accessToken: legacyState.token,
        isAuthenticated: legacyState.isLoggedIn,
        isLoading: false,
        error: null,

        register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });

          const data = await response.json();

          if (!response.ok) {
            const error = new Error(data.message || data.error || 'Erreur lors de l\'inscription');
            if (data.details) {
              error.details = data.details;
            }
            throw error;
          }

          const token = data.accessToken || data.token;
          legacyAuthStorage.save(data.user, token);
          set({ user: data.user, accessToken: token, isAuthenticated: true });
          return data.user;
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

        login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
          });

          const data = await response.json();

          if (!response.ok) {
            const error = new Error(data.message || data.error || 'Erreur lors de la connexion');
            throw error;
          }

          const token = data.accessToken || data.token;
          legacyAuthStorage.save(data.user, token);
          set({ user: data.user, accessToken: token, isAuthenticated: true });
          return data.user;
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

        logout: async () => {
        try {
          await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
        } finally {
          legacyAuthStorage.save(null, null);
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

        fetchProfile: async () => {
        const token = get().accessToken ||
          (typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || localStorage.getItem('token')) : null);

        if (!token) {
          throw new Error('Non authentifié');
        }

        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          method: 'GET',
          headers: buildAuthHeaders(token),
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          const error = new Error(data.message || data.error || 'Impossible de récupérer le profil');
          throw error;
        }

        legacyAuthStorage.save(data.user || data, token);
        set({ user: data.user || data, accessToken: token, isAuthenticated: true });
        return data.user || data;
      },

        setUser: (user) => {
        const token = get().accessToken;
        legacyAuthStorage.save(user, token);
        set({ user, isAuthenticated: !!user });
      },

        hydrateFromLegacyStorage: () => {
          const legacy = legacyAuthStorage.hydrate();
          if (legacy.user && legacy.token) {
            set({ user: legacy.user, accessToken: legacy.token, isAuthenticated: legacy.isLoggedIn });
          }
        }
      };
    },
    {
      name: 'thanout-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

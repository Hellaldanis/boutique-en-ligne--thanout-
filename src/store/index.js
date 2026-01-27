import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

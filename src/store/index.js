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

export const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,

      addToCompare: (product) => {
        const { items, maxItems } = get();
        if (items.length >= maxItems) {
          return { success: false, message: `Vous pouvez comparer jusqu'à ${maxItems} produits maximum` };
        }
        if (items.find(item => item.id === product.id)) {
          return { success: false, message: 'Ce produit est déjà dans la comparaison' };
        }
        set({ items: [...items, product] });
        return { success: true, message: 'Produit ajouté à la comparaison' };
      },

      removeFromCompare: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      clearCompare: () => {
        set({ items: [] });
      },

      isInCompare: (productId) => {
        return get().items.some(item => item.id === productId);
      },
    }),
    {
      name: 'thanout-compare-storage',
    }
  )
);

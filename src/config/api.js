// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh-token`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  
  // Products
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    LIST: `${API_BASE_URL}/products`,
    DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
    SEARCH: `${API_BASE_URL}/products/search`,
    FEATURED: `${API_BASE_URL}/products/featured`,
    NEW: `${API_BASE_URL}/products/new`,
  },
  
  // Categories
  CATEGORIES: {
    BASE: `${API_BASE_URL}/categories`,
    LIST: `${API_BASE_URL}/categories`,
    DETAIL: (id) => `${API_BASE_URL}/categories/${id}`,
  },
  
  // Cart
  CART: {
    BASE: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/items`,
    UPDATE: (id) => `${API_BASE_URL}/cart/items/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/cart/items/${id}`,
    CLEAR: `${API_BASE_URL}/cart`,
  },
  
  // Orders
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    LIST: `${API_BASE_URL}/orders`,
    USER_ORDERS: `${API_BASE_URL}/orders`,
    DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
    CREATE: `${API_BASE_URL}/orders`,
  },
  
  // Favorites
  FAVORITES: {
    BASE: `${API_BASE_URL}/favorites`,
    LIST: `${API_BASE_URL}/favorites`,
    ADD: (productId) => `${API_BASE_URL}/favorites/${productId}`,
    REMOVE: (productId) => `${API_BASE_URL}/favorites/${productId}`,
    TOGGLE: (id) => `${API_BASE_URL}/favorites/${id}`,
    CHECK: (productId) => `${API_BASE_URL}/favorites/${productId}/check`,
  },
  
  // Reviews
  REVIEWS: {
    BASE: `${API_BASE_URL}/reviews`,
    PRODUCT: (productId) => `${API_BASE_URL}/reviews/product/${productId}`,
    CREATE: (productId) => `${API_BASE_URL}/reviews/product/${productId}`,
    MARK_HELPFUL: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}/helpful`,
    DELETE: (reviewId) => `${API_BASE_URL}/reviews/${reviewId}`,
  },
  
  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,
  },
  
  // Contact
  CONTACT: {
    SEND: `${API_BASE_URL}/contact`,
  },
  
  // Promo Codes (public)
  PROMO_CODES: {
    VALIDATE: (code) => `${API_BASE_URL}/promo-codes/validate/${code}`,
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    STATISTICS: `${API_BASE_URL}/admin/statistics`,
    USERS: `${API_BASE_URL}/admin/users`,
    USER_BAN: (id) => `${API_BASE_URL}/admin/users/${id}/ban`,
    USER_ROLE: (id) => `${API_BASE_URL}/admin/users/${id}/role`,
    PROMO_CODES: `${API_BASE_URL}/admin/promo-codes`,
    PROMO_CODE: (id) => `${API_BASE_URL}/admin/promo-codes/${id}`,
    ACTIVITY_LOGS: `${API_BASE_URL}/admin/activity-logs`,
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCT: (id) => `${API_BASE_URL}/products/${id}`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    CATEGORY: (id) => `${API_BASE_URL}/categories/${id}`,
    ORDERS: `${API_BASE_URL}/admin/orders`,
    ORDER: (id) => `${API_BASE_URL}/admin/orders/${id}`,
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  // Supporte les deux noms de token pour compatibilité
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function for API calls with automatic token refresh
export const apiCall = async (url, options = {}) => {
  const doFetch = async (headers) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  };

  try {
    let response = await doFetch(getAuthHeaders());

    // If 401, try refreshing the token once
    if (response.status === 401) {
      try {
        const refreshRes = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.accessToken;
          if (newToken) {
            localStorage.setItem('accessToken', newToken);
            localStorage.setItem('token', newToken);
            // Retry original request with new token
            const newHeaders = {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newToken}`,
            };
            response = await doFetch(newHeaders);
          }
        }
      } catch (refreshError) {
        // Refresh failed — continue with original 401 response
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || 'Une erreur est survenue');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default API_BASE_URL;

/**
 * Main JavaScript File
 * Gestion de la logique principale de l'application
 */

// Configuration
const CONFIG = {
  API_URL: 'https://api.thanout.dz', // URL de l'API (à remplacer)
  CURRENCY: 'DA',
  LANGUAGE: 'fr'
};

// État global de l'application
const AppState = {
  cart: [],
  favorites: [],
  user: null,
  darkMode: false
};

/**
 * Gestion du panier
 */
const Cart = {
  // Ajouter un produit au panier
  add(product) {
    const existingItem = AppState.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      AppState.cart.push({
        ...product,
        quantity: 1
      });
    }
    
    this.save();
    this.updateUI();
    this.showNotification('Produit ajouté au panier');
  },

  // Retirer un produit du panier
  remove(productId) {
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
    this.save();
    this.updateUI();
  },

  // Mettre à jour la quantité
  updateQuantity(productId, quantity) {
    const item = AppState.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
      this.updateUI();
    }
  },

  // Calculer le total
  getTotal() {
    return AppState.cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  // Sauvegarder dans localStorage
  save() {
    localStorage.setItem('thanout_cart', JSON.stringify(AppState.cart));
  },

  // Charger depuis localStorage
  load() {
    const saved = localStorage.getItem('thanout_cart');
    if (saved) {
      AppState.cart = JSON.parse(saved);
      this.updateUI();
    }
  },

  // Mettre à jour l'interface
  updateUI() {
    const badge = document.querySelector('.header__cart-badge');
    if (badge) {
      const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  },

  // Afficher une notification
  showNotification(message) {
    // TODO: Implémenter un système de notification toast
    console.log(message);
  }
};

/**
 * Gestion des favoris
 */
const Favorites = {
  // Ajouter/retirer des favoris
  toggle(productId) {
    const index = AppState.favorites.indexOf(productId);
    
    if (index > -1) {
      AppState.favorites.splice(index, 1);
    } else {
      AppState.favorites.push(productId);
    }
    
    this.save();
    this.updateUI();
  },

  // Vérifier si un produit est en favoris
  has(productId) {
    return AppState.favorites.includes(productId);
  },

  // Sauvegarder
  save() {
    localStorage.setItem('thanout_favorites', JSON.stringify(AppState.favorites));
  },

  // Charger
  load() {
    const saved = localStorage.getItem('thanout_favorites');
    if (saved) {
      AppState.favorites = JSON.parse(saved);
    }
  },

  // Mettre à jour l'interface
  updateUI() {
    document.querySelectorAll('.product-card__favorite').forEach(btn => {
      const productId = btn.dataset.productId;
      if (productId && this.has(productId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
};

/**
 * Gestion du mode sombre
 */
const DarkMode = {
  // Activer/désactiver
  toggle() {
    AppState.darkMode = !AppState.darkMode;
    this.apply();
    this.save();
  },

  // Appliquer le mode
  apply() {
    const html = document.documentElement;
    if (AppState.darkMode) {
      html.classList.remove('light');
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
  },

  // Sauvegarder
  save() {
    localStorage.setItem('thanout_darkMode', JSON.stringify(AppState.darkMode));
  },

  // Charger
  load() {
    const saved = localStorage.getItem('thanout_darkMode');
    if (saved) {
      AppState.darkMode = JSON.parse(saved);
      this.apply();
    }
  }
};

/**
 * Utilitaires
 */
const Utils = {
  // Formater un prix
  formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ').format(price) + ' ' + CONFIG.CURRENCY;
  },

  // Formater une date
  formatDate(date) {
    return new Intl.DateTimeFormat('fr-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  },

  // Debounce pour optimiser les recherches
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

/**
 * Générateur de cartes produits
 */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__image-wrapper">
      <img 
        src="${product.image || 'https://via.placeholder.com/300x400'}" 
        alt="${product.name}"
        class="product-card__image"
      />
      ${product.discount ? `<span class="product-card__badge">-${product.discount}%</span>` : ''}
      <button class="product-card__favorite" data-product-id="${product.id}" aria-label="Ajouter aux favoris">
        <span class="material-symbols-outlined">favorite</span>
      </button>
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__category">${product.category}</p>
      <div class="product-card__pricing">
        <span class="product-card__price">${Utils.formatPrice(product.price)}</span>
        ${product.oldPrice ? `<span class="product-card__price--old">${Utils.formatPrice(product.oldPrice)}</span>` : ''}
      </div>
      ${product.rating ? `
      <div class="product-card__rating">
        <div class="product-card__stars">
          ${generateStars(product.rating)}
        </div>
        <span class="product-card__rating-count">(${product.reviews || 0})</span>
      </div>
      ` : ''}
      <button class="product-card__action" data-product-id="${product.id}">
        Ajouter au panier
      </button>
    </div>
  `;

  // Événements
  const addToCartBtn = card.querySelector('.product-card__action');
  addToCartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    Cart.add(product);
  });

  const favoriteBtn = card.querySelector('.product-card__favorite');
  favoriteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    Favorites.toggle(product.id);
  });

  // Clic sur la carte pour aller vers la page produit
  card.addEventListener('click', () => {
    window.location.href = `product.html?id=${product.id}`;
  });

  return card;
}

// Générer les étoiles de notation
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1">star</span>';
  }

  if (hasHalfStar) {
    stars += '<span class="material-symbols-outlined">star_half</span>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="material-symbols-outlined">star</span>';
  }

  return stars;
}

/**
 * Charger et afficher les produits
 */
async function loadProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  // Données de démonstration (remplacer par un appel API)
  const products = [
    {
      id: 1,
      name: 'Baskets Urbaines',
      category: 'Chaussures',
      price: 15000,
      oldPrice: 20000,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop',
      rating: 4.5,
      reviews: 125
    },
    {
      id: 2,
      name: 'Sac à Main en Cuir',
      category: 'Accessoires',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=400&fit=crop',
      rating: 5,
      reviews: 89
    },
    {
      id: 3,
      name: 'T-Shirt Essentiel',
      category: 'Hommes',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
      rating: 4,
      reviews: 203
    },
    {
      id: 4,
      name: 'Montre Classique',
      category: 'Accessoires',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
      rating: 4.5,
      reviews: 156
    }
  ];

  // Vider la grille
  productsGrid.innerHTML = '';

  // Ajouter les cartes produits
  products.forEach(product => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

/**
 * Hero Slider - Carrousel d'images
 */
const HeroSlider = {
  currentSlide: 0,
  slides: [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      title: 'Tout ce dont vous avez besoin, à portée de clic.',
      subtitle: 'Découvrez des milliers de produits et profitez d\'offres exclusives sur Thanout.'
    },
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
      title: 'Mode et Accessoires',
      subtitle: 'Les dernières tendances livrées chez vous en Algérie.'
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      title: 'Technologie et Innovation',
      subtitle: 'Les meilleurs produits électroniques aux meilleurs prix.'
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      title: 'Livraison dans les 58 Wilayas',
      subtitle: 'Commandez aujourd\'hui, recevez dans 2-5 jours.'
    }
  ],
  autoPlayInterval: null,

  init() {
    const heroElement = document.getElementById('hero-slider');
    if (!heroElement) return;

    // Événements sur les indicateurs
    const indicators = document.querySelectorAll('.hero-indicator');
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetAutoPlay();
      });
    });

    // Démarrer l'autoplay
    this.startAutoPlay();

    // Mettre à jour les indicateurs
    this.updateIndicators();
  },

  goToSlide(index) {
    this.currentSlide = index;
    const heroElement = document.getElementById('hero-slider');
    const slide = this.slides[index];

    if (heroElement && slide) {
      // Changer l'image de fond
      heroElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("${slide.image}")`;
      
      // Mettre à jour le texte
      const title = heroElement.querySelector('h1');
      const subtitle = heroElement.querySelector('p');
      if (title) title.textContent = slide.title;
      if (subtitle) subtitle.textContent = slide.subtitle;

      this.updateIndicators();
    }
  },

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(this.currentSlide);
  },

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Changer toutes les 5 secondes
  },

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  },

  updateIndicators() {
    const indicators = document.querySelectorAll('.hero-indicator');
    indicators.forEach((indicator, index) => {
      if (index === this.currentSlide) {
        indicator.classList.add('bg-white', 'w-8');
        indicator.classList.remove('bg-white/50', 'w-2');
      } else {
        indicator.classList.remove('bg-white', 'w-8');
        indicator.classList.add('bg-white/50', 'w-2');
      }
    });
  }
};

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Charger les données sauvegardées
  Cart.load();
  Favorites.load();
  DarkMode.load();

  // Charger les produits si on est sur une page qui les affiche
  loadProducts();

  // Initialiser le slider hero
  HeroSlider.init();

  // Initialiser le menu mobile
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = mobileMenu.classList.contains('active') ? 'close' : 'menu';
      }
    });
  }

  // Recherche avec debounce
  const searchInput = document.querySelector('.header__search-input');
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce((e) => {
      const query = e.target.value;
      console.log('Recherche:', query);
      // TODO: Implémenter la recherche
    }, 300));
  }
});

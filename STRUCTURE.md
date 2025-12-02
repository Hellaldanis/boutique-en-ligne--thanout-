# Structure du Projet Thanout

## Vue d'ensemble

Ce document détaille l'architecture et l'organisation du projet Thanout.

## Architecture des Dossiers

```
stitch_page_d_accueil/
│
├── src/                              # 📦 Code source principal
│   │
│   ├── assets/                       # 🎨 Ressources statiques
│   │   │
│   │   ├── css/                      # 🎨 Feuilles de style
│   │   │   ├── reset.css             # Reset navigateur
│   │   │   ├── variables.css         # Variables CSS (couleurs, espacements, etc.)
│   │   │   ├── base.css              # Styles de base globaux
│   │   │   │
│   │   │   └── components/           # Styles des composants
│   │   │       ├── header.css        # Navigation principale
│   │   │       ├── footer.css        # Pied de page
│   │   │       └── product-card.css  # Cartes produits
│   │   │
│   │   ├── js/                       # 💻 Scripts JavaScript
│   │   │   ├── components.js         # Chargement dynamique des composants
│   │   │   └── main.js               # Logique principale de l'application
│   │   │
│   │   └── images/                   # 🖼️ Images et médias
│   │       ├── logo/                 # Logos
│   │       ├── products/             # Images produits
│   │       └── banners/              # Bannières et hero images
│   │
│   ├── components/                   # 🧩 Composants HTML réutilisables
│   │   ├── header.html               # En-tête de navigation
│   │   ├── footer.html               # Pied de page
│   │   └── product-card.html         # Template de carte produit
│   │
│   └── pages/                        # 📄 Pages HTML
│       ├── index.html                # Page d'accueil
│       ├── categories.html           # Liste de produits avec filtres
│       ├── product.html              # Détail d'un produit
│       ├── cart.html                 # Panier d'achat
│       └── checkout.html             # Processus de paiement
│
├── confirmation_de_commande_1/       # 📋 Pages de confirmation (legacy)
├── confirmation_de_commande_2/
├── ...
│
└── README.md                         # 📖 Documentation principale
```

## Description des Dossiers

### `/src`
Contient tout le code source de l'application.

### `/src/assets`
Ressources statiques utilisées par l'application.

#### `/src/assets/css`
- **reset.css** : Normalisation des styles par défaut des navigateurs
- **variables.css** : Variables CSS pour le design system (couleurs, typographie, espacements)
- **base.css** : Styles de base appliqués globalement
- **components/** : Styles spécifiques à chaque composant (BEM naming)

#### `/src/assets/js`
- **components.js** : Gestion du chargement dynamique des composants HTML
- **main.js** : Logique principale (panier, favoris, recherche, etc.)

#### `/src/assets/images`
Organisation recommandée pour les images :
- `logo/` : Logos et variations
- `products/` : Images des produits
- `banners/` : Images de bannières et hero sections

### `/src/components`
Composants HTML réutilisables qui sont chargés dynamiquement dans les pages.

### `/src/pages`
Pages HTML complètes de l'application.

## Conventions de Nommage

### CSS
- **BEM (Block Element Modifier)** : `.block__element--modifier`
  - Exemple : `.product-card__title--featured`

### JavaScript
- **camelCase** pour les variables et fonctions
  - Exemple : `addToCart()`, `productPrice`
- **PascalCase** pour les classes et constructeurs
  - Exemple : `ProductCard`, `CartManager`

### Fichiers
- **kebab-case** pour les noms de fichiers
  - Exemple : `product-card.css`, `header-component.html`

## Flux de Chargement

1. **Page HTML** : Charge les ressources (CSS, JS)
2. **components.js** : Charge dynamiquement header et footer
3. **main.js** : Initialise l'état de l'application
4. **Événements** : Gestion des interactions utilisateur

## Ordre des Styles CSS

Recommandation d'importation dans les pages HTML :

```html
<link rel="stylesheet" href="../assets/css/reset.css">
<link rel="stylesheet" href="../assets/css/variables.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/components/header.css">
<link rel="stylesheet" href="../assets/css/components/footer.css">
<!-- Autres composants -->
```

## État de l'Application

L'état global est géré dans `main.js` :

```javascript
const AppState = {
  cart: [],        // Produits dans le panier
  favorites: [],   // Produits favoris
  user: null,      // Utilisateur connecté
  darkMode: false  // Mode sombre activé/désactivé
};
```

## LocalStorage

Les données persistantes sont stockées dans le LocalStorage :
- `thanout_cart` : Panier d'achat
- `thanout_favorites` : Favoris
- `thanout_darkMode` : Préférence du mode sombre

## Responsive Breakpoints

- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

## Prochaines Étapes

1. Ajouter les pages manquantes (détail produit, panier complet)
2. Implémenter l'API backend
3. Ajouter l'authentification utilisateur
4. Système de paiement réel
5. Tests automatisés
6. Optimisation des performances

---

**Dernière mise à jour** : Décembre 2024

# 🛍️ Thanout - Boutique en Ligne Algérie

Bienvenue sur le projet **Thanout**, une plateforme e-commerce moderne conçue pour le marché algérien. Ce projet présente une structure front-end complète et organisée.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Technologies Utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Pages Disponibles](#pages-disponibles)
- [Composants](#composants)
- [Roadmap](#roadmap)

## 🎯 Aperçu

Thanout est une boutique en ligne complète qui propose :
- Une interface moderne et responsive
- Support du mode sombre
- Navigation intuitive
- Système de panier d'achat
- Gestion des favoris
- Filtres de produits avancés
- Paiement sécurisé (CIB, BaridiMob, Paiement à la livraison)

## ✨ Fonctionnalités

### Pages Principales
- ✅ Page d'accueil avec hero section et catégories
- ✅ Page de catégories avec filtres avancés
- ✅ Page de détail produit
- ✅ Panier d'achat
- ✅ Processus de paiement
- ✅ Pages de confirmation de commande

### Fonctionnalités Techniques
- 🎨 Design System complet (variables CSS)
- 📱 Responsive Design (Mobile First)
- 🌙 Mode Sombre / Clair
- 🛒 Gestion du panier avec LocalStorage
- ❤️ Système de favoris
- 🔍 Recherche de produits
- 🎭 Composants réutilisables
- ⚡ Performance optimisée

## 📁 Structure du Projet

```
stitch_page_d_accueil/
│
├── src/                          # Code source
│   ├── assets/                   # Ressources
│   │   ├── css/                  # Feuilles de style
│   │   │   ├── reset.css         # Reset CSS
│   │   │   ├── variables.css     # Variables du design system
│   │   │   ├── base.css          # Styles de base
│   │   │   └── components/       # Styles des composants
│   │   │       ├── header.css
│   │   │       ├── footer.css
│   │   │       └── product-card.css
│   │   │
│   │   ├── js/                   # Scripts JavaScript
│   │   │   ├── components.js     # Chargement dynamique des composants
│   │   │   └── main.js           # Logique principale
│   │   │
│   │   └── images/               # Images et médias
│   │
│   ├── components/               # Composants HTML réutilisables
│   │   ├── header.html           # En-tête de navigation
│   │   ├── footer.html           # Pied de page
│   │   └── product-card.html     # Carte produit
│   │
│   └── pages/                    # Pages HTML
│       ├── index.html            # Page d'accueil
│       ├── categories.html       # Page catégories/produits
│       ├── product.html          # Détail produit
│       ├── cart.html             # Panier
│       └── checkout.html         # Paiement
│
├── confirmation_de_commande_*/   # Pages de confirmation (anciennes)
└── README.md                     # Documentation
```

## 🛠️ Technologies Utilisées

### Front-End
- **HTML5** - Structure sémantique
- **CSS3** - Styling moderne
  - Variables CSS (Design System)
  - Flexbox & Grid Layout
  - Animations et transitions
- **JavaScript (Vanilla)** - Logique interactive
  - Gestion d'état
  - LocalStorage
  - Chargement dynamique de composants

### Librairies & Frameworks
- **Tailwind CSS** (CDN) - Framework CSS utilitaire
- **Google Fonts** - Typographie (Inter, Noto Sans Arabic)
- **Material Symbols** - Icônes

## 🚀 Installation

### Prérequis
- Un navigateur web moderne
- Un serveur local (recommandé) ou simplement ouvrir les fichiers HTML

### Étapes

1. **Cloner ou télécharger le projet**
```bash
cd stitch_page_d_accueil
```

2. **Lancer un serveur local** (recommandé)

Avec Python :
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Avec Node.js (live-server) :
```bash
npm install -g live-server
live-server src/pages
```

Avec PHP :
```bash
php -S localhost:8000
```

3. **Ouvrir dans le navigateur**
```
http://localhost:8000/src/pages/index.html
```

## 💻 Utilisation

### Navigation
- La page d'accueil est accessible via `src/pages/index.html`
- Utilisez la navigation pour accéder aux différentes sections
- Le menu mobile s'active automatiquement sur petits écrans

### Mode Sombre
Le mode sombre est activable via JavaScript :
```javascript
DarkMode.toggle();
```

### Panier d'Achat
```javascript
// Ajouter un produit
Cart.add({
  id: 1,
  name: "Produit",
  price: 15000,
  image: "url.jpg"
});

// Voir le total
const total = Cart.getTotal();
```

### Favoris
```javascript
// Ajouter/retirer des favoris
Favorites.toggle(productId);

// Vérifier si un produit est en favoris
const isFavorite = Favorites.has(productId);
```

## 📄 Pages Disponibles

| Page | Description | Fichier |
|------|-------------|---------|
| **Accueil** | Page principale avec hero, catégories, nouveautés | `index.html` |
| **Catégories** | Liste de produits avec filtres et tri | `categories.html` |
| **Détail Produit** | Informations complètes sur un produit | `product.html` |
| **Panier** | Gestion du panier d'achat | `cart.html` |
| **Paiement** | Processus de commande et paiement | `checkout.html` |

## 🧩 Composants

### Header
En-tête avec logo, navigation, recherche et actions utilisateur.

### Footer
Pied de page avec liens, newsletter et informations de paiement.

### Product Card
Carte produit réutilisable avec image, prix, rating et actions.

## 🎨 Design System

### Couleurs
```css
--primary: #135bec;           /* Bleu primaire */
--background-light: #f6f6f8;  /* Fond clair */
--background-dark: #101622;   /* Fond sombre */
--accent: #FFC107;            /* Accent jaune */
```

### Typographie
- **Police principale** : Inter
- **Police arabe** : Noto Sans Arabic
- **Icônes** : Material Symbols

### Breakpoints
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

## 🗺️ Roadmap

### Phase 1 - Structure ✅ (Complétée)
- [x] Architecture des dossiers
- [x] Design system (variables CSS)
- [x] Composants réutilisables
- [x] Pages principales
- [x] JavaScript de base

### Phase 2 - Backend (À venir)
- [ ] Connexion à une API
- [ ] Authentification utilisateur
- [ ] Base de données produits
- [ ] Système de paiement réel

### Phase 3 - Améliorations (À venir)
- [ ] Animations avancées
- [ ] Optimisation SEO
- [ ] Tests automatisés
- [ ] PWA (Progressive Web App)
- [ ] Multilingue (FR/AR)

## 📝 Notes de Développement

### Convention de Nommage
- **BEM** pour les classes CSS : `.block__element--modifier`
- **camelCase** pour JavaScript
- **kebab-case** pour les fichiers

### Bonnes Pratiques
- Code commenté et documenté
- Responsive Mobile First
- Performance optimisée
- Accessibilité (ARIA labels)
- SEO friendly

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question ou suggestion :
- Email : contact@thanout.dz
- GitHub : [Votre profil]

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Fait avec ❤️ pour le marché algérien** 🇩🇿

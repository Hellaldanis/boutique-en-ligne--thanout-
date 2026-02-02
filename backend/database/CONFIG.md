# Configuration Base de Données

## Connexion PostgreSQL

```env
# Copier ce fichier en .env dans backend/
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thanout_db
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_SSL=false

# En production
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_CONNECTION_TIMEOUT=30000
```

## Schéma: 31 Tables Principales

### 🔐 AUTHENTIFICATION & UTILISATEURS
```
users (Utilisateurs principaux)
├── user_addresses (Adresses multiples)
└── admin_users (Droits admin)
```

### 📦 CATALOGUE PRODUITS
```
categories (Hiérarchie catégories)
brands (Marques)
products (Produits principaux)
├── product_images (Galerie photos)
├── product_variants (Tailles, couleurs)
├── product_features (Caractéristiques)
└── product_tags ←→ tags (Tags N:N)
```

### ⭐ AVIS & ÉVALUATIONS
```
product_reviews (Avis clients 1-5★)
└── review_helpful (Votes "utile")
```

### 🎁 PROMOTIONS
```
promo_codes (Codes promo)
└── promo_code_usage (Historique utilisation)
```

### 🛒 COMMANDES
```
orders (Commandes)
├── order_items (Lignes commande)
├── order_shipping (Adresse livraison)
└── order_status_history (Audit trail)
```

### ↩️ RETOURS
```
returns (Demandes retour)
└── return_items (Articles retournés)
```

### ❤️ PANIER & FAVORIS
```
cart (Panier)
└── cart_items (Articles panier)

favorites (Produits favoris)
```

### 📧 COMMUNICATION
```
newsletter_subscribers (Newsletter)
contact_messages (Formulaire contact)
notifications (Notifications in-app)
```

### 📊 AUDIT
```
activity_logs (Logs toutes actions)
```

## 📐 Relations Clés

### 1:N (One-to-Many)
- user → addresses (1 user → N addresses)
- user → orders (1 user → N orders)
- order → order_items (1 order → N items)
- product → images (1 product → N images)
- category → products (1 category → N products)

### N:N (Many-to-Many)
- products ←→ tags (via product_tags)
- users ←→ reviews ←→ products

### 1:1
- order ↔ order_shipping (1:1)
- user ↔ admin_users (0:1 optionnel)

## 🔑 Contraintes Importantes

### UNIQUE
- users.email
- products.slug
- products.sku
- orders.order_number
- promo_codes.code
- (product_id, user_id) dans reviews

### CHECK
- price >= 0
- quantity > 0
- rating BETWEEN 1 AND 5
- email format valide
- status IN (énumérations)

### FOREIGN KEYS avec Policies
- **CASCADE**: Supprimer enfants avec parent
  - product → product_images
  - order → order_items
  
- **RESTRICT**: Empêcher suppression si référencé
  - category → products (ne pas supprimer si produits)
  - product → order_items (historique)
  
- **SET NULL**: Mettre NULL si parent supprimé
  - brand → products.brand_id

## 📈 Index Créés

### Performance critique:
- Toutes PK et FK (auto)
- users.email
- products.slug, category_id, is_active
- orders.user_id, status, created_at
- Champs de recherche/filtre fréquents

## 🔍 Vues Matérialisées

### v_products_with_stats
```sql
- Produits avec avg_rating
- Compteur reviews
- Compteur favorites
- Image primaire
```

### v_orders_with_details
```sql
- Commandes enrichies
- Infos user et shipping
- Compteur items
```

## 🔄 Triggers

### update_updated_at_column()
Auto-update du champ `updated_at` sur toute modification

Appliqué sur:
- users
- user_addresses
- categories
- products
- orders
- product_reviews
- cart & cart_items

## 💾 Types de Données

| Type | Usage | Exemple |
|------|-------|---------|
| BIGSERIAL | IDs (auto-increment) | user_id |
| VARCHAR(n) | Texte court limité | email, name |
| TEXT | Texte long | description |
| DECIMAL(10,2) | Prix/montants | 15000.00 |
| INTEGER | Compteurs | stock_quantity |
| BOOLEAN | Flags | is_active |
| TIMESTAMP | Dates avec heure | created_at |
| JSONB | Données flexibles | permissions |

## 🎯 Normalisation (3NF/BCNF)

### ✅ Forme Normale Atteinte
- **1NF**: Attributs atomiques ✓
- **2NF**: Pas de dépendance partielle ✓
- **3NF**: Pas de dépendance transitive ✓
- **BCNF**: Toutes dépendances via clés candidates ✓

### Exemples:
1. **Adresses séparées** (vs colonnes dans users)
2. **Variantes séparées** (vs colonnes size1, size2...)
3. **Historique statuts** (vs 1 colonne status)
4. **Snapshot commande** (product_name dans order_items)

## 🚀 Évolutivité

### Capacités:
- **Utilisateurs**: Illimité (BIGINT = 9 quintillions)
- **Produits**: Illimité
- **Commandes**: Illimité
- **Performance**: Index optimisés pour millions d'enregistrements

### Extensions futures:
- Multi-tenant (ajouter company_id)
- Multi-devise (table currencies)
- Multi-langue (tables *_translations)
- Marketplace (table vendors)
- Abonnements (table subscriptions)
- Points fidélité (table loyalty_points)
- Warehouse management (table warehouses)

## 🔐 Sécurité

### En Production:
1. ✅ Pas de CASCADE sur orders (RESTRICT)
2. ✅ Soft delete (is_active flags)
3. ✅ Activity logs pour audit
4. ✅ Mots de passe hashés (bcrypt)
5. ✅ Tokens pour actions sensibles
6. ✅ Validation email par regex
7. ✅ Constraints pour intégrité données

### À Implémenter côté APP:
- Rate limiting
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens
- JWT authentication

## 📊 Statistiques Schéma

```
Tables: 31
Relations: ~50 foreign keys
Index: ~80 index
Contraintes CHECK: ~30
Contraintes UNIQUE: ~15
Triggers: 8
Vues: 2
Fonctions: 1
```

## 🧪 Tests de Seed

Les données de test incluent:
- 5 utilisateurs (dont 1 admin)
- 10 produits variés
- 7 catégories
- 5 marques
- ~30 images produits
- ~20 variantes
- ~30 caractéristiques
- 4 codes promo actifs
- 5 avis produits
- 3 abonnés newsletter

## 📞 Prochaines Étapes

1. ✅ Schéma créé
2. ⏭️ Créer API REST (Node.js/Express)
3. ⏭️ ORM/Query Builder (Prisma/TypeORM)
4. ⏭️ Endpoints CRUD
5. ⏭️ Authentication JWT
6. ⏭️ Intégration Frontend

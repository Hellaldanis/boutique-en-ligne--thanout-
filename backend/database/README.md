# Documentation Schéma Base de Données - THANOUT E-Commerce

## 📊 Vue d'ensemble

Base de données relationnelle en **3NF/BCNF** pour une plateforme e-commerce complète.

**SGBD:** PostgreSQL (compatible MySQL)
**Nombre de tables:** 31 tables principales
**Relations:** Complètement normalisées avec contraintes d'intégrité référentielle

---

## 🗂️ Tables et Relations

### 1. GESTION DES UTILISATEURS

#### **users**
- **Clé primaire:** user_id
- **Description:** Comptes utilisateurs avec authentification
- **Champs principaux:** email, password_hash, first_name, last_name, phone
- **Règles métier:**
  - Email unique et validé par regex
  - Support suspension de compte
  - Tracking dernière connexion
  - Tokens pour vérification email et reset password

#### **user_addresses**
- **Clé primaire:** address_id
- **Clé étrangère:** user_id → users
- **Description:** Adresses multiples par utilisateur (livraison/facturation)
- **Règles métier:**
  - Un utilisateur peut avoir plusieurs adresses
  - Une adresse peut être marquée par défaut

#### **admin_users**
- **Clé primaire:** admin_id
- **Clé étrangère:** user_id → users (UNIQUE)
- **Description:** Droits administrateurs avec rôles
- **Rôles:** super_admin, admin, manager, support
- **Permissions:** JSONB pour granularité fine

---

### 2. CATALOGUE PRODUITS

#### **categories**
- **Clé primaire:** category_id
- **Description:** Hiérarchie de catégories (support sous-catégories)
- **Auto-référence:** parent_category_id → categories
- **Champs:** name, slug, description, image_url, display_order

#### **brands**
- **Clé primaire:** brand_id
- **Description:** Marques produits
- **Champs:** name, slug, logo_url, website_url

#### **products**
- **Clé primaire:** product_id
- **Clés étrangères:** 
  - category_id → categories (RESTRICT)
  - brand_id → brands (SET NULL)
- **Description:** Produits principaux avec pricing et stock
- **Champs métier:**
  - price, old_price, cost_price (marges)
  - discount_percentage calculé
  - stock_quantity avec low_stock_threshold
  - sku, barcode pour gestion inventaire
  - Flags: is_featured, is_new, is_bestseller
  - SEO: meta_title, meta_description, meta_keywords
- **Contraintes:**
  - old_price > price (si défini)
  - Tous les prix >= 0

#### **product_images**
- **Clé primaire:** image_id
- **Clé étrangère:** product_id → products (CASCADE)
- **Description:** Galerie images multi-produits
- **Règles:** Une image primaire par produit

#### **product_variants**
- **Clé primaire:** variant_id
- **Clé étrangère:** product_id → products (CASCADE)
- **Description:** Variantes (taille, couleur, matériau)
- **Types:** size, color, material
- **Champs:** variant_type, variant_value, price_adjustment, stock_quantity
- **Contrainte unique:** (product_id, variant_type, variant_value)

#### **product_features**
- **Clé primaire:** feature_id
- **Clé étrangère:** product_id → products (CASCADE)
- **Description:** Caractéristiques techniques produits
- **Format:** feature_name / feature_value

#### **tags + product_tags**
- **Tables de liaison N:N**
- **Description:** Tags pour recherche et filtrage
- **Exemples:** "promo", "bio", "nouveau"

---

### 3. AVIS ET ÉVALUATIONS

#### **product_reviews**
- **Clé primaire:** review_id
- **Clés étrangères:**
  - product_id → products (CASCADE)
  - user_id → users (CASCADE)
- **Description:** Avis clients avec notation 1-5 étoiles
- **Champs:** rating, title, comment, helpful_count
- **Workflow:** is_approved (modération), admin_response
- **Contrainte:** Un avis par utilisateur par produit

#### **review_helpful**
- **Clé composite:** (user_id, review_id)
- **Description:** Votes "utile" sur avis
- **Permet:** Tracking qui a voté

---

### 4. PROMOTIONS

#### **promo_codes**
- **Clé primaire:** promo_id
- **Description:** Codes promotionnels
- **Types de réduction:**
  - percentage: % sur total
  - fixed: montant fixe
  - shipping: livraison gratuite
- **Champs de contrôle:**
  - usage_limit: total utilisations
  - usage_per_user: limite par utilisateur
  - min_purchase_amount: montant minimum
  - valid_from / valid_until: période validité

#### **promo_code_usage**
- **Clé primaire:** usage_id
- **Clés étrangères:**
  - promo_id → promo_codes
  - user_id → users
  - order_id → orders
- **Description:** Historique d'utilisation

---

### 5. COMMANDES

#### **orders**
- **Clé primaire:** order_id
- **Clé étrangère:** user_id → users (RESTRICT)
- **Description:** Commandes avec workflow complet
- **Statuts possibles:**
  - pending, confirmed, processing, shipped, delivered
  - cancelled, returned, refunded
- **Statuts paiement:**
  - pending, paid, failed, refunded, partial_refund
- **Méthodes paiement:**
  - cash, card, bank_transfer, mobile_money
- **Calculs:**
  - subtotal: somme articles
  - shipping_cost: frais livraison
  - discount_amount: réductions appliquées
  - tax_amount: taxes
  - total_amount: total final
- **Timestamps:** confirmed_at, shipped_at, delivered_at, cancelled_at

#### **order_items**
- **Clé primaire:** order_item_id
- **Clés étrangères:**
  - order_id → orders (CASCADE)
  - product_id → products (RESTRICT)
  - variant_id → product_variants (SET NULL)
- **Description:** Lignes de commande
- **Snapshot:** product_name, product_sku (données au moment de la commande)
- **variant_details:** JSONB pour stocker sélection complète

#### **order_shipping**
- **Clé primaire:** shipping_id
- **Clé étrangère:** order_id → orders (UNIQUE, CASCADE)
- **Description:** Adresse et informations de livraison
- **Champs livraison:** tracking_number, carrier, estimated_delivery

#### **order_status_history**
- **Clé primaire:** history_id
- **Clé étrangère:** order_id → orders (CASCADE)
- **Description:** Audit trail des changements de statut
- **Permet:** Traçabilité complète

---

### 6. RETOURS

#### **returns**
- **Clé primaire:** return_id
- **Clés étrangères:**
  - order_id → orders (RESTRICT)
  - user_id → users (RESTRICT)
- **Description:** Demandes de retour
- **Statuts:** requested, approved, rejected, received, refunded
- **Workflow:** reason, description, admin_notes, refund_amount

#### **return_items**
- **Clé primaire:** return_item_id
- **Clés étrangères:**
  - return_id → returns (CASCADE)
  - order_item_id → order_items (RESTRICT)
- **Description:** Articles spécifiques retournés
- **Permet:** Retour partiel

---

### 7. PANIER ET FAVORIS

#### **cart**
- **Clé primaire:** cart_id
- **Description:** Panier utilisateur ou session
- **Support:** Utilisateurs connectés (user_id) ou invités (session_id)
- **Contrainte:** Au moins user_id OU session_id requis

#### **cart_items**
- **Clé primaire:** cart_item_id
- **Clés étrangères:**
  - cart_id → cart (CASCADE)
  - product_id → products (CASCADE)
  - variant_id → product_variants (SET NULL)
- **Contrainte unique:** (cart_id, product_id, variant_id)

#### **favorites**
- **Clé primaire:** favorite_id
- **Clés étrangères:**
  - user_id → users (CASCADE)
  - product_id → products (CASCADE)
- **Contrainte unique:** (user_id, product_id)

---

### 8. COMMUNICATION

#### **newsletter_subscribers**
- **Clé primaire:** subscriber_id
- **Description:** Abonnés newsletter
- **Champs:** email (unique), is_subscribed, subscription_token
- **Permet:** Désabonnement avec token

#### **contact_messages**
- **Clé primaire:** message_id
- **Description:** Messages formulaire de contact
- **Statuts:** new, read, replied, archived
- **Workflow:** admin_response, responded_at

#### **notifications**
- **Clé primaire:** notification_id
- **Clé étrangère:** user_id → users (CASCADE)
- **Description:** Notifications in-app
- **Types:** order, promo, product, system
- **Champs:** title, message, link, is_read

---

### 9. AUDIT ET LOGS

#### **activity_logs**
- **Clé primaire:** log_id
- **Description:** Logs de toutes les actions importantes
- **Tracking:** user_id, admin_id, action, entity_type, entity_id
- **Détails:** JSONB pour données structurées
- **Permet:** Audit, sécurité, analytics

---

## 🔗 Diagramme Relations (ERD simplifié)

```
users (1) ----< (N) user_addresses
users (1) ----< (N) orders
users (1) ----< (N) product_reviews
users (1) ----< (N) favorites
users (1) ----< (1) cart
users (1) ----< (N) notifications

categories (1) ----< (N) products
brands (1) ----< (N) products
products (1) ----< (N) product_images
products (1) ----< (N) product_variants
products (1) ----< (N) product_features
products (1) ----< (N) product_reviews
products (N) ----< (N) tags (via product_tags)

orders (1) ----< (N) order_items
orders (1) ----< (1) order_shipping
orders (1) ----< (N) order_status_history
orders (1) ----< (N) returns

cart (1) ----< (N) cart_items

promo_codes (1) ----< (N) promo_code_usage
promo_codes (1) ----< (N) orders
```

---

## 🎯 Normalisation (3NF/BCNF)

### ✅ Conformité 3NF
1. **1NF:** Tous les attributs sont atomiques
2. **2NF:** Pas de dépendance partielle (toutes les clés sont simples ou composites complètes)
3. **3NF:** Pas de dépendance transitive

### Exemples de normalisation appliquée:

#### Séparation user_addresses
Au lieu de stocker plusieurs adresses dans `users`, table séparée permet:
- Multiple adresses par utilisateur
- Éviter la redondance
- Historique des adresses

#### product_variants séparé
Plutôt que des colonnes `size`, `color` dans `products`:
- Flexibilité sur types de variantes
- Gestion stock par variante
- Prix ajustables par variante

#### order_items snapshot
Stockage des données produit au moment de la commande:
- Préserve l'historique même si produit modifié/supprimé
- Intégrité des factures

---

## 🔐 Contraintes et Règles Métier

### Contraintes CHECK
- Emails: Validation regex
- Prix: Toujours >= 0
- Quantités: > 0
- Ratings: Entre 1 et 5
- Dates: valid_until > valid_from
- Status: Énumérations strictes

### Contraintes UNIQUE
- Emails utilisateurs
- SKUs produits
- Order numbers
- Combinaisons (product_id, user_id) pour reviews

### ON DELETE Policies
- **CASCADE:** Suppression en cascade (ex: product → product_images)
- **RESTRICT:** Empêcher suppression (ex: products référencés dans orders)
- **SET NULL:** Mise à NULL (ex: brand supprimée → products.brand_id = NULL)

---

## 📈 Index et Performance

### Index créés sur:
- Toutes les clés primaires (automatique)
- Toutes les clés étrangères
- Champs de recherche fréquents (email, slug, name)
- Champs de filtrage (is_active, status, dates)
- Champs de tri (price, created_at)

### Vues matérialisées
- `v_products_with_stats`: Produits avec avg_rating, review_count
- `v_orders_with_details`: Commandes enrichies avec infos user et shipping

---

## 🔄 Triggers

### update_updated_at_column()
- Automatique sur UPDATE
- Appliqué à toutes les tables avec `updated_at`
- Maintient timestamps à jour

---

## 💾 Types de Données

- **BIGSERIAL:** IDs auto-incrémentés (64-bit, évolutif)
- **VARCHAR:** Textes courts avec limite
- **TEXT:** Textes longs sans limite
- **DECIMAL(10,2):** Prix (précision 2 décimales)
- **JSONB:** Données semi-structurées (permissions, variant_details)
- **TIMESTAMP:** Dates avec heure
- **BOOLEAN:** Flags binaires

---

## 🚀 Utilisation

### 1. Créer la base de données
```sql
CREATE DATABASE thanout_db;
```

### 2. Exécuter le schéma
```bash
psql -U postgres -d thanout_db -f schema.sql
```

### 3. Vérifier les tables
```sql
\dt -- Liste toutes les tables
```

---

## 📝 Notes Importantes

1. **Évolutivité:** Structure permet d'ajouter facilement de nouvelles fonctionnalités
2. **Sécurité:** Mots de passe hashés, tokens pour actions sensibles
3. **Audit:** activity_logs pour traçabilité complète
4. **Flexibilité:** JSONB pour données dynamiques
5. **Performance:** Index optimisés pour requêtes fréquentes

---

## 🔮 Extensions Futures Possibles

- Multi-tenant (wilayas, pays multiples)
- Inventory management avancé (warehouses)
- Système de points de fidélité
- Abonnements et produits récurrents
- Marketplaces multi-vendeurs
- Analytics et reporting avancés

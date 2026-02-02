# Guide d'Installation et Configuration de la Base de Données

## 📋 Prérequis

- PostgreSQL 12+ installé
- Accès administrateur à PostgreSQL
- Terminal/PowerShell

## 🚀 Installation Rapide

### 1. Créer la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql:
CREATE DATABASE thanout_db;
\c thanout_db
\q
```

### 2. Exécuter le schéma

```bash
# Depuis le dossier backend/database
psql -U postgres -d thanout_db -f schema.sql
```

### 3. Insérer les données de test

```bash
psql -U postgres -d thanout_db -f seeds/seed_data.sql
```

## 🔄 Commandes Utiles

### Vérifier les tables créées
```sql
\dt
```

### Voir le détail d'une table
```sql
\d users
\d products
```

### Compter les enregistrements
```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

### Réinitialiser complètement
```bash
# ATTENTION: Supprime toutes les données!
psql -U postgres -d thanout_db -f migrations/down.sql
psql -U postgres -d thanout_db -f schema.sql
psql -U postgres -d thanout_db -f seeds/seed_data.sql
```

## 📊 Données de Test Incluses

### Utilisateurs (5)
- admin@thanout.com (Admin)
- marie.lambert@email.dz
- amadou.diallo@email.dz  
- fatou.sow@email.dz
- karim.benali@email.dz

**Note:** Tous les mots de passe sont hashés avec bcrypt

### Produits (10)
- Baskets, sacs, vêtements, électronique, etc.
- Avec images, variantes, avis
- Stock et prix réalistes

### Catégories (7)
- Électronique, Mode, Chaussures, Accessoires, Maison, Sport, Beauté

### Codes Promo (4)
- WELCOME10 (10% de réduction)
- THANOUT20 (20% de réduction)
- SAVE5000 (5000 DA de réduction)
- FREESHIP (Livraison gratuite)

## 🔍 Requêtes d'Exemple

### Produits avec statistiques
```sql
SELECT * FROM v_products_with_stats;
```

### Produits les mieux notés
```sql
SELECT 
    p.name,
    AVG(pr.rating) as avg_rating,
    COUNT(pr.review_id) as review_count
FROM products p
LEFT JOIN product_reviews pr ON p.product_id = pr.product_id
WHERE pr.is_approved = TRUE
GROUP BY p.product_id, p.name
ORDER BY avg_rating DESC;
```

### Produits en promotion
```sql
SELECT 
    name,
    price,
    old_price,
    discount_percentage
FROM products
WHERE old_price IS NOT NULL
ORDER BY discount_percentage DESC;
```

### Commandes par statut
```sql
SELECT 
    status,
    COUNT(*) as count,
    SUM(total_amount) as total_revenue
FROM orders
GROUP BY status;
```

## 🛠️ Configuration pour MySQL

Si vous utilisez MySQL au lieu de PostgreSQL:

1. Modifier les types de données:
   - `BIGSERIAL` → `BIGINT AUTO_INCREMENT`
   - `SERIAL` → `INT AUTO_INCREMENT`
   - `BOOLEAN` → `TINYINT(1)`
   - `TIMESTAMP` → `DATETIME`

2. Modifier les contraintes CHECK:
   MySQL < 8.0 ne supporte pas CHECK, utiliser des triggers

3. Fonction trigger différente:
```sql
-- MySQL version
DELIMITER $$
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;
```

## 🔐 Sécurité

### En Production:
1. **Changer les mots de passe** de seed
2. **Créer un utilisateur dédié** (pas postgres)
```sql
CREATE USER thanout_api WITH PASSWORD 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON DATABASE thanout_db TO thanout_api;
```
3. **Configurer pg_hba.conf** pour accès réseau
4. **Activer SSL/TLS**
5. **Backups réguliers**

### Backup automatique
```bash
# Backup
pg_dump -U postgres thanout_db > backup_$(date +%Y%m%d).sql

# Restauration
psql -U postgres -d thanout_db < backup_20260202.sql
```

## 📈 Performance

### Index recommandés en production:
```sql
-- Index composite pour recherche produits
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('french', name || ' ' || description));

-- Index sur dates fréquentes
CREATE INDEX idx_orders_date_range ON orders(created_at, status);

-- Index sur prix pour filtrage
CREATE INDEX idx_products_price_range ON products(price) WHERE is_active = TRUE;
```

### Maintenance régulière:
```sql
-- Analyser les stats
ANALYZE;

-- Nettoyer les tables
VACUUM;

-- Vacuum complet (offline)
VACUUM FULL;
```

## 🐛 Dépannage

### Erreur: "relation already exists"
```sql
-- Supprimer d'abord les tables existantes
\i migrations/down.sql
```

### Erreur: "permission denied"
```sql
-- Donner les droits
GRANT ALL ON ALL TABLES IN SCHEMA public TO votre_utilisateur;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO votre_utilisateur;
```

### Erreur: "could not serialize access"
```sql
-- Augmenter le niveau d'isolation
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

## 📞 Support

Pour toute question sur la base de données:
1. Consulter le [README.md](README.md) complet
2. Vérifier les logs PostgreSQL: `/var/log/postgresql/`
3. Consulter la documentation officielle PostgreSQL

## 🎯 Prochaines Étapes

Après configuration de la DB:
1. ✅ Base de données créée
2. 🔄 Créer l'API backend (Node.js/Express)
3. 🔄 Connecter l'API à la DB
4. 🔄 Créer les endpoints REST
5. 🔄 Intégrer avec le frontend React

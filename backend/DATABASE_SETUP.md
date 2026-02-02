# Guide de configuration de la base de données

## Configuration PostgreSQL

### 1. Installation de PostgreSQL

**Windows:**
- Télécharger depuis https://www.postgresql.org/download/windows/
- Exécuter l'installateur
- Noter le mot de passe du superutilisateur `postgres`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

### 2. Création de la base de données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE thanout_db;

# Créer un utilisateur dédié (optionnel mais recommandé)
CREATE USER thanout_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';

# Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE thanout_db TO thanout_user;

# Quitter
\q
```

### 3. Configuration du fichier .env

Mettez à jour la variable `DATABASE_URL` dans le fichier `.env` :

```env
# Si vous utilisez le superutilisateur postgres
DATABASE_URL="postgresql://postgres:votre_mot_de_passe@localhost:5432/thanout_db?schema=public"

# Si vous avez créé un utilisateur dédié
DATABASE_URL="postgresql://thanout_user:votre_mot_de_passe@localhost:5432/thanout_db?schema=public"
```

## Initialisation avec Prisma

### 1. Générer le client Prisma

```bash
npx prisma generate
```

### 2. Créer les migrations

```bash
# Créer et appliquer la migration initiale
npx prisma migrate dev --name init
```

Cette commande va :
- Créer les tables dans la base de données
- Générer les fichiers de migration dans `prisma/migrations/`
- Régénérer le client Prisma

### 3. Vérifier les tables

```bash
# Ouvrir Prisma Studio (interface visuelle)
npx prisma studio
```

Ou via psql :

```bash
psql -U postgres -d thanout_db

# Lister les tables
\dt

# Décrire une table
\d users

# Quitter
\q
```

## Données de test (seed)

### Option 1 : Seed SQL manuel

```bash
# Exécuter le script SQL de seed
psql -U postgres -d thanout_db -f database/seeds/seed_data.sql
```

### Option 2 : Script Prisma Seed (à créer)

Créez un fichier `prisma/seed.js` :

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Créer des catégories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Électronique', slug: 'electronique', description: 'Produits électroniques' },
      { name: 'Mode', slug: 'mode', description: 'Vêtements et accessoires' },
      // ... autres catégories
    ]
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Ajouter dans `package.json` :

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Exécuter :

```bash
npx prisma db seed
```

## Commandes utiles

### Réinitialiser la base de données

```bash
# Attention : Cela supprime toutes les données !
npx prisma migrate reset
```

### Créer une nouvelle migration

```bash
npx prisma migrate dev --name description_de_la_modification
```

### Appliquer les migrations en production

```bash
npx prisma migrate deploy
```

### Synchroniser le schéma sans migration

```bash
npx prisma db push
```

### Générer le SQL d'une migration

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql
```

## Problèmes courants

### Erreur de connexion

```
Error: Can't reach database server at `localhost:5432`
```

**Solutions :**
- Vérifier que PostgreSQL est démarré : `sudo service postgresql status`
- Vérifier le port : PostgreSQL utilise par défaut le port 5432
- Vérifier les credentials dans DATABASE_URL

### Erreur de permissions

```
Error: permission denied for schema public
```

**Solutions :**
```sql
GRANT ALL ON SCHEMA public TO thanout_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO thanout_user;
```

### Erreur de migration

```
Error: Migration failed to apply
```

**Solutions :**
- Vérifier les erreurs dans les logs
- Réinitialiser : `npx prisma migrate reset`
- Appliquer manuellement via psql si nécessaire

### BigInt serialization

Si vous avez des erreurs avec BigInt dans les réponses JSON :

```javascript
// Ajouter dans server.js
BigInt.prototype.toJSON = function() {
  return this.toString();
};
```

## Backup et Restore

### Backup

```bash
# Backup complet
pg_dump -U postgres thanout_db > thanout_backup.sql

# Backup avec données uniquement
pg_dump -U postgres --data-only thanout_db > data_backup.sql

# Backup d'une table spécifique
pg_dump -U postgres -t users thanout_db > users_backup.sql
```

### Restore

```bash
# Restore complet
psql -U postgres thanout_db < thanout_backup.sql

# Restore avec recréation de la DB
dropdb -U postgres thanout_db
createdb -U postgres thanout_db
psql -U postgres thanout_db < thanout_backup.sql
```

## Configuration pour la production

### Variables d'environnement

```env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@production-host:5432/thanout_db?schema=public&sslmode=require"
```

### SSL pour connexions sécurisées

```env
DATABASE_URL="postgresql://user:password@host:5432/thanout_db?schema=public&sslmode=require&sslcert=/path/to/cert.pem"
```

### Connection Pooling

Pour améliorer les performances :

```javascript
// Dans schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 5
}
```

## Monitoring

### Vérifier les connexions actives

```sql
SELECT * FROM pg_stat_activity WHERE datname = 'thanout_db';
```

### Vérifier la taille de la base

```sql
SELECT pg_size_pretty(pg_database_size('thanout_db'));
```

### Analyser les performances

```sql
-- Requêtes lentes
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

## Support

Pour plus d'informations :
- Documentation Prisma : https://www.prisma.io/docs
- Documentation PostgreSQL : https://www.postgresql.org/docs/

# Installation de PostgreSQL pour Thanout E-commerce

## Étape 1 : Télécharger PostgreSQL

1. Visitez : https://www.postgresql.org/download/windows/
2. Téléchargez PostgreSQL 15 ou 16 (version recommandée)
3. Ou téléchargez directement : https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

## Étape 2 : Installation

1. Exécutez l'installeur téléchargé
2. **Important** : Notez le mot de passe que vous définissez pour l'utilisateur `postgres`
3. Port par défaut : `5432` (gardez ce port)
4. Locale : Choisissez votre région (par défaut : English)
5. Terminez l'installation

## Étape 3 : Configuration de la base de données

### Option A : Avec pgAdmin (Interface graphique - Recommandé)

1. Ouvrez **pgAdmin 4** (installé avec PostgreSQL)
2. Connectez-vous avec le mot de passe défini
3. Clic droit sur "Databases" → "Create" → "Database"
4. Nom de la base de données : `thanout_db`
5. Cliquez sur "Save"

### Option B : Avec ligne de commande

```cmd
# Ouvrez PowerShell en tant qu'administrateur
psql -U postgres

# Dans psql, créez la base de données :
CREATE DATABASE thanout_db;

# Quittez psql :
\q
```

## Étape 4 : Configuration du projet

1. Ouvrez le fichier `backend\.env`
2. Modifiez la ligne `DATABASE_URL` avec votre mot de passe :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/thanout_db?schema=public"
```

Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe que vous avez défini lors de l'installation.

## Étape 5 : Initialisation de la base de données

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
# Générer le client Prisma
cd backend
npx prisma generate

# Créer les tables
npx prisma db push

# Remplir avec des données de test
node prisma/seed.js
```

## Étape 6 : Vérification

Pour vérifier que tout fonctionne :

```powershell
# Voir les tables créées
npx prisma studio
```

Cela ouvrira une interface web sur http://localhost:5555 où vous pourrez voir vos données.

## En cas de problème

### Erreur : "Can't reach database server"
- Vérifiez que PostgreSQL est bien démarré (Service Windows)
- Vérifiez le mot de passe dans le fichier .env
- Vérifiez que le port 5432 est disponible

### Erreur : "Database does not exist"
- Créez la base de données `thanout_db` via pgAdmin ou psql

### Erreur : "password authentication failed"
- Vérifiez le mot de passe dans DATABASE_URL dans le fichier .env

## Comptes de test après le seed

### Admin :
- Email: `admin@thanout.com`
- Mot de passe: `Admin123!`

### Utilisateur :
- Email: `user@test.com`
- Mot de passe: `User123!`

## Codes promo disponibles :
- `WELCOME10` - 10% de réduction (min 5000 DA)
- `THANOUT20` - 20% de réduction (min 10000 DA)
- `SAVE5000` - 5000 DA de réduction (min 20000 DA)
- `FREESHIP` - Livraison gratuite (min 15000 DA)

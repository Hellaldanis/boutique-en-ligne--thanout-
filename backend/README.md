# Backend Thanout - API REST

API REST complète pour la boutique en ligne Thanout, développée avec Node.js, Express et Prisma ORM.

## 🚀 Technologies utilisées

- **Node.js** (v18+)
- **Express** - Framework web
- **Prisma ORM** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des données
- **Winston** - Logging
- **Helmet** - Sécurité HTTP
- **CORS** - Cross-Origin Resource Sharing
- **express-rate-limit** - Limitation de débit
- **Stripe** - Paiements en ligne
- **Nodemailer** - Envoi d'emails

## 📁 Structure du projet

```
backend/
├── src/
│   ├── controllers/      # Contrôleurs (logique des routes)
│   ├── services/         # Services (logique métier)
│   ├── routes/           # Définition des routes
│   ├── middlewares/      # Middlewares personnalisés
│   ├── validators/       # Schémas de validation
│   ├── utils/            # Fonctions utilitaires
│   └── server.js         # Point d'entrée de l'application
├── prisma/
│   └── schema.prisma     # Schéma de la base de données
├── database/
│   ├── schema.sql        # Schéma SQL brut
│   └── seeds/            # Données de test
├── logs/                 # Fichiers de logs
├── .env                  # Variables d'environnement
├── .env.example          # Exemple de variables d'environnement
├── .gitignore           
├── package.json
└── README.md
```

## 🔧 Installation

### Prérequis

- Node.js 18+ installé
- PostgreSQL installé et en cours d'exécution
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**

```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement**

Copiez `.env.example` vers `.env` et configurez vos valeurs :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos configurations :

- `DATABASE_URL` : URL de connexion PostgreSQL
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `SMTP_*` : Configuration email pour Nodemailer
- `STRIPE_SECRET_KEY` : Clé Stripe pour les paiements

3. **Créer la base de données**

```bash
# Créer la base de données PostgreSQL
createdb thanout_db

# Ou via SQL
psql -U postgres -c "CREATE DATABASE thanout_db;"
```

4. **Exécuter les migrations Prisma**

```bash
npx prisma migrate dev --name init
```

5. **Générer le client Prisma**

```bash
npx prisma generate
```

6. **Insérer les données de test (optionnel)**

```bash
psql -U postgres -d thanout_db -f database/seeds/seed_data.sql
```

## 🎯 Lancement

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Mode production

```bash
npm start
```

### Autres commandes utiles

```bash
# Ouvrir Prisma Studio (interface visuelle de la BDD)
npm run prisma:studio

# Générer le client Prisma après modification du schéma
npm run prisma:generate

# Créer une nouvelle migration
npm run prisma:migrate

# Linter le code
npm run lint

# Formater le code
npm run format

# Tests (à configurer)
npm test
```

## 📡 API Endpoints

### Authentification (`/api/auth`)

- `POST /register` - Inscription
- `POST /login` - Connexion
- `POST /logout` - Déconnexion
- `GET /verify-email/:token` - Vérifier l'email
- `POST /forgot-password` - Demander réinitialisation mot de passe
- `POST /reset-password` - Réinitialiser le mot de passe
- `GET /profile` - Obtenir le profil (authentifié)
- `PUT /profile` - Mettre à jour le profil (authentifié)
- `POST /change-password` - Changer le mot de passe (authentifié)

### Produits (`/api/products`)

- `GET /` - Liste des produits (avec filtres)
- `GET /:slug` - Détails d'un produit
- `GET /:id/related` - Produits liés
- `POST /` - Créer un produit (admin)
- `PUT /:id` - Modifier un produit (admin)
- `DELETE /:id` - Supprimer un produit (admin)

### Commandes (`/api/orders`)

- `POST /` - Créer une commande (authentifié)
- `GET /` - Liste des commandes utilisateur (authentifié)
- `GET /:id` - Détails d'une commande (authentifié)
- `POST /:id/cancel` - Annuler une commande (authentifié)
- `POST /validate-promo` - Valider un code promo (authentifié)

### Panier (`/api/cart`)

- `GET /` - Obtenir le panier
- `POST /items` - Ajouter un article
- `PUT /items/:itemId` - Mettre à jour la quantité
- `DELETE /items/:itemId` - Supprimer un article
- `DELETE /` - Vider le panier

### Avis (`/api/reviews`)

- `GET /product/:productId` - Avis d'un produit
- `POST /product/:productId` - Créer un avis (authentifié)
- `POST /:reviewId/helpful` - Marquer comme utile (authentifié)
- `DELETE /:reviewId` - Supprimer son avis (authentifié)

### Favoris (`/api/favorites`)

- `GET /` - Liste des favoris (authentifié)
- `POST /:productId` - Ajouter aux favoris (authentifié)
- `DELETE /:productId` - Retirer des favoris (authentifié)
- `GET /:productId/check` - Vérifier si en favori (authentifié)

### Catégories (`/api/categories`)

- `GET /` - Liste des catégories
- `GET /:slug` - Détails d'une catégorie
- `POST /` - Créer une catégorie (admin)
- `PUT /:id` - Modifier une catégorie (admin)
- `DELETE /:id` - Supprimer une catégorie (admin)

### Newsletter (`/api/newsletter`)

- `POST /subscribe` - S'abonner
- `GET /unsubscribe/:token` - Se désabonner
- `GET /subscribers` - Liste des abonnés (admin)

### Contact (`/api/contact`)

- `POST /` - Envoyer un message
- `GET /` - Liste des messages (admin)
- `GET /:id` - Détails d'un message (admin)
- `POST /:id/respond` - Répondre à un message (admin)
- `PATCH /:id/read` - Marquer comme lu (admin)

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Utilisation

1. Connexion via `POST /api/auth/login` pour obtenir un token
2. Inclure le token dans les requêtes suivantes :

```
Authorization: Bearer <votre_token>
```

### Types de tokens

- **Access Token** : Expire en 1h, utilisé pour les requêtes API
- **Refresh Token** : Expire en 7 jours, stocké en cookie HTTP-only

## 🛡️ Sécurité

- Helmet pour les headers HTTP sécurisés
- Rate limiting (100 req/15min par défaut)
- Validation des données avec express-validator
- CORS configuré
- Mots de passe hashés avec bcrypt (10 rounds)
- Cookies HTTP-only pour les refresh tokens
- Protection CSRF (à implémenter si nécessaire)

## 📝 Variables d'environnement

Voir le fichier `.env.example` pour la liste complète des variables.

### Variables essentielles

```env
NODE_ENV=development|production
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/thanout_db
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## 🧪 Tests

Les tests unitaires et d'intégration sont à configurer avec Jest et Supertest.

```bash
npm test
```

## 📊 Monitoring et Logs

Les logs sont gérés par Winston et stockés dans le dossier `logs/` :

- `error.log` : Erreurs uniquement
- `combined.log` : Tous les logs

## 🚢 Déploiement

### Avec Docker (à venir)

```bash
docker-compose up -d
```

### Manuel

1. Configurer les variables d'environnement de production
2. Exécuter les migrations : `npx prisma migrate deploy`
3. Démarrer le serveur : `npm start`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée pour Thanout.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

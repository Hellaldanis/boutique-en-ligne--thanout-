# 🐳 Guide Docker - Thanout E-commerce

## 📋 Prérequis

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **4 Go RAM** minimum recommandé

## 🚀 Démarrage Rapide (Développement)

### 1. Lancer le projet

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up --build -d
```

### 2. Accéder à l'application

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Application React |
| **Backend API** | http://localhost:5000/api | API REST |
| **Health Check** | http://localhost:5000/health | État du serveur |

### 3. Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@thanout.com` | `Admin123!` |
| User | `user@test.com` | `User123!` |

## 📦 Commandes Docker Utiles

### Gestion des conteneurs

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (reset complet)
docker-compose down -v

# Redémarrer un service
docker-compose restart backend
```

### Base de données

```bash
# Accéder au conteneur backend
docker-compose exec backend sh

# Exécuter Prisma Studio (visualiser la DB)
docker-compose exec backend npx prisma studio

# Réinitialiser la base de données
docker-compose exec backend npx prisma db push --force-reset
docker-compose exec backend npx prisma db seed
```

### Debug

```bash
# Vérifier l'état des conteneurs
docker-compose ps

# Voir les ressources utilisées
docker stats

# Inspecter un conteneur
docker inspect thanout-backend
```

## 🏭 Déploiement Production

### 1. Configuration

Créer un fichier `.env.prod` :

```env
JWT_SECRET=votre-secret-jwt-tres-securise-production
JWT_REFRESH_SECRET=votre-refresh-secret-production
CORS_ORIGIN=https://votre-domaine.com
API_URL=https://api.votre-domaine.com/api
```

### 2. Build et lancement

```bash
# Build de production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

# Vérifier que tout fonctionne
docker-compose -f docker-compose.prod.yml ps
```

## 🔧 Structure des fichiers Docker

```
thanout/
├── docker-compose.yml          # Orchestration développement
├── docker-compose.prod.yml     # Orchestration production
├── Dockerfile                  # Build frontend (dev)
├── Dockerfile.prod             # Build frontend (prod + Nginx)
├── nginx.conf                  # Config Nginx production
├── .dockerignore               # Fichiers exclus du build
└── backend/
    ├── Dockerfile              # Build backend
    ├── docker-entrypoint.sh    # Script d'initialisation
    └── .dockerignore           # Fichiers exclus du build
```

## 🔄 Hot Reload (Développement)

Le hot reload est activé par défaut grâce aux volumes montés :

- **Frontend** : Modifications dans `src/` → Rechargement automatique
- **Backend** : Modifications dans `backend/src/` → Redémarrage nécessaire

Pour le backend avec nodemon (optionnel), modifiez la commande :

```yaml
# Dans docker-compose.yml
backend:
  command: ["npx", "nodemon", "src/server.js"]
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Réinitialiser la base de données
docker-compose down -v
docker-compose up --build
```

### Erreur CORS

Vérifiez que `CORS_ORIGIN` dans le backend correspond au port du frontend :

```yaml
environment:
  - CORS_ORIGIN=http://localhost:5173
```

### Le frontend ne trouve pas l'API

Vérifiez que `VITE_API_URL` est correct :

```yaml
environment:
  - VITE_API_URL=http://localhost:5000/api
```

### Port déjà utilisé

```bash
# Trouver le processus
netstat -ano | findstr :5000

# Ou changer les ports dans docker-compose.yml
ports:
  - "5001:5000"  # Mapper sur 5001 au lieu de 5000
```

## 📊 Monitoring

### Vérifier la santé des services

```bash
# État des conteneurs
docker-compose ps

# Health check backend
curl http://localhost:5000/health

# Ressources utilisées
docker stats --no-stream
```

## 🔒 Sécurité Production

1. **Ne jamais** commiter `.env.prod` avec les secrets
2. Utiliser des secrets Docker ou un gestionnaire de secrets
3. Activer HTTPS avec Let's Encrypt
4. Mettre à jour régulièrement les images de base

---

**🎉 Bon développement avec Thanout !**

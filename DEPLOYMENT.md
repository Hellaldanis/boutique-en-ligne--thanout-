# 🚀 Guide de Déploiement - Thanout E-commerce

## 📋 Résumé du projet

| Composant | Stack | Prêt |
|-----------|-------|------|
| **Frontend** | React 18 + Vite + Tailwind | ✅ |
| **Backend** | Node.js + Express + Prisma | ✅ |
| **Base de données** | SQLite (dev) / PostgreSQL (prod) | ✅ |
| **Docker** | Dockerfile + docker-compose | ✅ |

---

## 🌐 Options de déploiement

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend sur Vercel

1. **Connecter le repo GitHub** à Vercel
2. **Variables d'environnement** :
   ```
   VITE_API_URL=https://votre-backend.railway.app/api
   ```
3. **Build settings** (auto-détectés) :
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Backend sur Railway

1. **Créer un projet Railway**
2. **Connecter le repo GitHub** (dossier `/backend`)
3. **Variables d'environnement** :
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://...  # Railway fournit PostgreSQL
   JWT_SECRET=votre-secret-securise-32-chars
   JWT_REFRESH_SECRET=votre-refresh-secret-32-chars
   CORS_ORIGIN=https://votre-frontend.vercel.app
   ```
4. **Start Command** : `npm start`

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend sur Netlify

1. **Connecter le repo GitHub** à Netlify
2. **Variables d'environnement** :
   ```
   VITE_API_URL=https://votre-backend.onrender.com/api
   ```
3. **Build settings** :
   - Build Command: `npm run build`
   - Publish Directory: `dist`

#### Backend sur Render

1. **Créer un Web Service** sur Render
2. **Root Directory** : `backend`
3. **Build Command** : `npm install && npx prisma generate && npx prisma db push`
4. **Start Command** : `npm start`
5. **Variables d'environnement** :
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...  # Render fournit PostgreSQL
   JWT_SECRET=votre-secret-securise
   JWT_REFRESH_SECRET=votre-refresh-secret
   CORS_ORIGIN=https://votre-frontend.netlify.app
   ```

---

### Option 3: Docker (VPS - DigitalOcean, AWS, etc.)

1. **Sur le serveur** :
   ```bash
   git clone https://github.com/Hellaldanis/boutique-en-ligne--thanout-.git
   cd boutique-en-ligne--thanout-
   ```

2. **Créer `.env.prod`** :
   ```env
   JWT_SECRET=votre-secret-production-tres-securise
   JWT_REFRESH_SECRET=votre-refresh-secret-production
   CORS_ORIGIN=https://votre-domaine.com
   API_URL=https://api.votre-domaine.com/api
   ```

3. **Lancer** :
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
   ```

---

## 📦 Fichiers de configuration existants

| Fichier | Plateforme |
|---------|------------|
| `vercel.json` | Vercel ✅ |
| `netlify.toml` | Netlify ✅ |
| `docker-compose.yml` | Docker Dev ✅ |
| `docker-compose.prod.yml` | Docker Prod ✅ |
| `Dockerfile` | Frontend Dev ✅ |
| `Dockerfile.prod` | Frontend Prod ✅ |
| `backend/Dockerfile` | Backend ✅ |
| `nginx.conf` | Nginx Prod ✅ |

---

## ⚠️ Checklist avant déploiement

### Backend
- [ ] Changer `JWT_SECRET` (min 32 caractères)
- [ ] Changer `JWT_REFRESH_SECRET`
- [ ] Configurer `CORS_ORIGIN` avec le domaine frontend
- [ ] Migrer vers PostgreSQL (recommandé pour prod)
- [ ] Configurer les variables d'environnement sur la plateforme

### Frontend
- [ ] Définir `VITE_API_URL` vers le backend de production
- [ ] Tester le build localement : `npm run build`
- [ ] Vérifier que toutes les routes fonctionnent

### Base de données
- [ ] Créer la base PostgreSQL sur la plateforme
- [ ] Exécuter les migrations : `npx prisma db push`
- [ ] Seeder les données initiales : `npx prisma db seed`

---

## 🔐 Variables d'environnement requises

### Frontend (.env)
```env
VITE_API_URL=https://votre-api.com/api
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/thanout
JWT_SECRET=changez-moi-en-production-min-32-caracteres
JWT_REFRESH_SECRET=changez-moi-aussi-en-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://votre-frontend.com
```

---

## 🧪 Tester le build localement

```bash
# Frontend
cd boutique-en-ligne--thanout-
npm run build
npm run preview

# Backend
cd backend
npm start
```

---

## 📞 Support

- **Repo GitHub** : https://github.com/Hellaldanis/boutique-en-ligne--thanout-
- **Documentation API** : Voir `backend/API_DOCUMENTATION.md`
- **Guide Docker** : Voir `DOCKER.md`

---

**✅ Le projet est PRÊT pour le déploiement !**

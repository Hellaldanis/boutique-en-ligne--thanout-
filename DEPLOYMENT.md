# Guide de Déploiement - Boutique Thanout

Ce guide vous explique comment héberger votre boutique en ligne gratuitement sur différentes plateformes.

## 📋 Options d'Hébergement

### 1. 🚀 Netlify (Recommandé - Le plus simple)

**Gratuit avec :**
- Déploiement automatique depuis Git
- HTTPS automatique
- CDN mondial
- Builds illimités

**Étapes :**

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre dépôt GitHub
4. Netlify détectera automatiquement la configuration (fichier `netlify.toml`)
5. Cliquez sur "Deploy"
6. Votre site sera disponible à : `https://votre-site.netlify.app`

**Personnaliser le domaine :**
- Site settings → Domain management → Add custom domain

---

### 2. ▲ Vercel

**Gratuit avec :**
- Performance optimale
- Déploiement instantané
- Analytics basiques

**Étapes :**

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New Project"
3. Importez votre dépôt GitHub
4. Vercel détectera Vite automatiquement
5. Cliquez sur "Deploy"
6. Votre site sera disponible à : `https://votre-site.vercel.app`

---

### 3. 📄 GitHub Pages

**Gratuit avec :**
- Hébergement directement depuis GitHub
- URL : `https://votre-username.github.io/boutique-en-ligne--thanout-`

**Étapes :**

1. Activez GitHub Pages dans votre dépôt :
   - Settings → Pages
   - Source : "GitHub Actions"

2. Le workflow `.github/workflows/deploy.yml` est déjà configuré

3. Pushez votre code :
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push
   ```

4. Le site se déploiera automatiquement à chaque push

---

### 4. 🔥 Firebase Hosting

**Gratuit avec :**
- CDN rapide de Google
- SSL automatique
- 10 GB de stockage

**Étapes :**

1. Installez Firebase CLI :
   ```bash
   npm install -g firebase-tools
   ```

2. Connectez-vous :
   ```bash
   firebase login
   ```

3. Initialisez Firebase :
   ```bash
   firebase init hosting
   ```
   - Public directory : `dist`
   - Single-page app : `Yes`
   - GitHub integration : `Optional`

4. Buildez et déployez :
   ```bash
   npm run build
   firebase deploy
   ```

---

### 5. 💧 Render

**Gratuit avec :**
- Sites statiques illimités
- HTTPS automatique
- Déploiement continu

**Étapes :**

1. Créez un compte sur [render.com](https://render.com)
2. Cliquez sur "New +" → "Static Site"
3. Connectez votre dépôt GitHub
4. Configuration :
   - Build Command : `npm run build`
   - Publish Directory : `dist`
5. Cliquez sur "Create Static Site"

---

## 🛠️ Commandes Locales

```bash
# Développement local
npm run dev

# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🌍 Personnalisation du Domaine

### Acheter un domaine en Algérie :

1. **CERIST (.dz)** : [https://www.cerist.dz](https://www.cerist.dz)
   - Domaines .dz officiels

2. **NIC.DZ** : Service de domaines algériens

3. **Registrars internationaux** :
   - Namecheap
   - Google Domains
   - Cloudflare

### Connecter votre domaine :

**Pour Netlify/Vercel :**
1. Ajoutez le domaine dans les paramètres
2. Mettez à jour les DNS records chez votre registrar :
   ```
   Type: A Record
   Name: @
   Value: [IP fournie par la plateforme]
   
   Type: CNAME
   Name: www
   Value: votre-site.netlify.app (ou vercel.app)
   ```

---

## 📊 Performance & SEO

Après le déploiement :

1. **Vérifiez la performance** : [PageSpeed Insights](https://pagespeed.web.dev/)
2. **Testez le SEO** : [Google Search Console](https://search.google.com/search-console)
3. **Ajoutez Google Analytics** (optionnel)
4. **Configurez un sitemap.xml**

---

## 🔒 Sécurité

✅ HTTPS est automatiquement activé sur toutes ces plateformes
✅ Headers de sécurité sont configurés
✅ Protection DDoS incluse

---

## 💡 Recommandation

**Pour démarrer rapidement** : Utilisez **Netlify** ou **Vercel**
- Déploiement en 2 minutes
- Configuration automatique
- Performance excellente

**Pour un contrôle total** : Utilisez **Firebase** ou votre propre **serveur VPS**

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de build sur la plateforme
2. Assurez-vous que `npm run build` fonctionne localement
3. Consultez la documentation de la plateforme choisie

---

Bonne chance avec votre boutique Thanout ! 🎉

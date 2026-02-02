# ================================
# Dockerfile Frontend - Thanout
# React 18 + Vite + Tailwind CSS
# ================================

FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY . .

# Variables d'environnement
ENV VITE_API_URL=http://localhost:5000/api
ENV NODE_ENV=development

# Exposer le port Vite
EXPOSE 5173

# Commande de démarrage pour le développement avec hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

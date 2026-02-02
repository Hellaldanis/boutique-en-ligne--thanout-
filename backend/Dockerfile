# ================================
# Dockerfile Backend - Thanout API
# Node.js + Express + Prisma + SQLite
# ================================

FROM node:20-alpine

# Installer les dépendances système pour SQLite et Prisma
RUN apk add --no-cache openssl

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production
RUN npm install -g prisma

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code source
COPY . .

# Créer le dossier pour la base de données SQLite
RUN mkdir -p /app/prisma

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./dev.db"

# Exposer le port
EXPOSE 5000

# Script de démarrage
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Commande de démarrage
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "src/server.js"]

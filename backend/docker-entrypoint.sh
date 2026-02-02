#!/bin/sh
set -e

echo "🚀 Démarrage du backend Thanout..."

# Attendre que le fichier prisma soit prêt
echo "📦 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations (créer/mettre à jour la base de données)
echo "🗄️ Application des migrations Prisma..."
npx prisma db push --accept-data-loss

# Seeder la base de données si elle est vide
echo "🌱 Vérification des données de seed..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndSeed() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    console.log('Base de données vide, exécution du seed...');
    require('child_process').execSync('npx prisma db seed', { stdio: 'inherit' });
  } else {
    console.log('Base de données déjà initialisée avec', userCount, 'utilisateurs');
  }
  await prisma.\$disconnect();
}

checkAndSeed().catch(console.error);
"

echo "✅ Backend prêt!"

# Exécuter la commande passée en paramètre
exec "$@"

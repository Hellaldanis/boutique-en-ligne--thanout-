require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // 1. Créer un utilisateur admin
  console.log('📝 Création de l\'utilisateur admin...');
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thanout.com' },
    update: {},
    create: {
      email: 'admin@thanout.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'Thanout',
      phone: '+213555123456',
      isActive: true,
      isVerified: true,
      adminUser: {
        create: {
          role: 'super_admin',
          permissions: JSON.stringify(['all']),
        }
      }
    },
  });
  console.log('✅ Admin créé:', admin.email);

  // 2. Créer un utilisateur test
  console.log('📝 Création de l\'utilisateur test...');
  const userPassword = await bcrypt.hash('User123!', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      passwordHash: userPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: '+213555654321',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Utilisateur test créé:', user.email);

  // 3. Créer des catégories
  console.log('📝 Création des catégories...');
  const categories = [
    { name: 'Électronique', slug: 'electronique', description: 'Smartphones, ordinateurs et accessoires électroniques' },
    { name: 'Mode', slug: 'mode', description: 'Vêtements et accessoires de mode' },
    { name: 'Chaussures', slug: 'chaussures', description: 'Chaussures pour tous les styles' },
    { name: 'Accessoires', slug: 'accessoires', description: 'Sacs, montres et bijoux' },
    { name: 'Maison', slug: 'maison', description: 'Décoration et articles pour la maison' },
    { name: 'Sport', slug: 'sport', description: 'Équipement et vêtements de sport' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
    console.log('✅ Catégorie créée:', category.name);
  }

  // 4. Créer des produits
  console.log('📝 Création des produits...');
  const products = [
    {
      name: 'iPhone 14 Pro Max',
      slug: 'iphone-14-pro-max',
      description: 'Le dernier smartphone d\'Apple avec écran Super Retina XDR de 6.7 pouces',
      price: 180000,
      oldPrice: 200000,
      sku: 'IPHONE-14-PM-256',
      barcode: '194253397496',
      categoryId: createdCategories[0].id,
      stockQuantity: 50,
      isActive: true,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1678652197950-82d48e046959?w=500&h=500&fit=crop',
      tags: ['smartphone', 'apple', 'premium'],
    },
    {
      name: 'Samsung Galaxy S23 Ultra',
      slug: 'samsung-galaxy-s23-ultra',
      description: 'Smartphone haut de gamme avec stylet S Pen intégré',
      price: 160000,
      oldPrice: 180000,
      sku: 'SAMSUNG-S23-ULTRA',
      barcode: '887276652580',
      categoryId: createdCategories[0].id,
      stockQuantity: 35,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
      tags: ['smartphone', 'samsung', 'android'],
    },
    {
      name: 'MacBook Pro M2',
      slug: 'macbook-pro-m2',
      description: 'Ordinateur portable professionnel avec puce M2',
      price: 250000,
      oldPrice: 280000,
      sku: 'MBP-M2-14',
      barcode: '194253408185',
      categoryId: createdCategories[0].id,
      stockQuantity: 20,
      isActive: true,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
      tags: ['laptop', 'apple', 'professionnel'],
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Baskets Nike avec technologie Air Max pour un confort optimal',
      price: 25000,
      oldPrice: 30000,
      sku: 'NIKE-AM-270',
      categoryId: createdCategories[2].id,
      stockQuantity: 100,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      tags: ['chaussures', 'nike', 'sport'],
    },
    {
      name: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      description: 'Chaussures de running avec technologie Boost',
      price: 28000,
      sku: 'ADIDAS-UB-22',
      categoryId: createdCategories[2].id,
      stockQuantity: 75,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
      tags: ['chaussures', 'adidas', 'running'],
    },
    {
      name: 'Veste en Jean Levi\'s',
      slug: 'veste-jean-levis',
      description: 'Veste en jean classique Levi\'s pour homme',
      price: 12000,
      oldPrice: 15000,
      sku: 'LEVIS-JACKET-M',
      categoryId: createdCategories[1].id,
      stockQuantity: 60,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
      tags: ['mode', 'levis', 'veste'],
    },
    {
      name: 'T-Shirt H&M Essential',
      slug: 't-shirt-hm-essential',
      description: 'T-shirt basique en coton biologique',
      price: 2500,
      sku: 'HM-TSHIRT-ESS',
      categoryId: createdCategories[1].id,
      stockQuantity: 200,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      tags: ['mode', 'basique', 'coton'],
    },
    {
      name: 'Sac à Main Louis Vuitton',
      slug: 'sac-main-lv',
      description: 'Sac à main de luxe en cuir véritable',
      price: 85000,
      sku: 'LV-BAG-001',
      categoryId: createdCategories[3].id,
      stockQuantity: 15,
      isActive: true,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop',
      tags: ['luxe', 'sac', 'cuir'],
    },
    {
      name: 'Montre Rolex Submariner',
      slug: 'montre-rolex-submariner',
      description: 'Montre de plongée automatique de luxe',
      price: 1200000,
      sku: 'ROLEX-SUB',
      categoryId: createdCategories[3].id,
      stockQuantity: 5,
      isActive: true,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      tags: ['luxe', 'montre', 'automatique'],
    },
    {
      name: 'Canapé Moderne 3 Places',
      slug: 'canape-moderne-3-places',
      description: 'Canapé confortable en tissu gris',
      price: 65000,
      oldPrice: 75000,
      sku: 'SOFA-MOD-3P',
      categoryId: createdCategories[4].id,
      stockQuantity: 25,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
      tags: ['meuble', 'salon', 'confort'],
    },
    {
      name: 'AirPods Pro 2',
      slug: 'airpods-pro-2',
      description: 'Écouteurs sans fil avec réduction de bruit active',
      price: 32000,
      oldPrice: 38000,
      sku: 'APPLE-APP-2',
      categoryId: createdCategories[0].id,
      stockQuantity: 80,
      isActive: true,
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&h=500&fit=crop',
      tags: ['audio', 'apple', 'sans-fil'],
    },
    {
      name: 'PlayStation 5',
      slug: 'playstation-5',
      description: 'Console de jeux nouvelle génération',
      price: 95000,
      sku: 'SONY-PS5',
      categoryId: createdCategories[0].id,
      stockQuantity: 30,
      isActive: true,
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop',
      tags: ['gaming', 'console', 'sony'],
    },
  ];

  for (const prod of products) {
    // Retirer les champs qui ne sont pas dans le schéma
    const { image, tags, ...productData } = prod;
    
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: {
          create: {
            imageUrl: image,
            altText: productData.name,
            displayOrder: 1,
            isPrimary: true,
          }
        }
      },
    });
    console.log('✅ Produit créé:', product.name);
  }

  // 5. Créer des codes promo
  console.log('📝 Création des codes promo...');
  const promoCodes = [
    {
      code: 'WELCOME10',
      description: 'Réduction de 10% pour les nouveaux clients',
      discountType: 'percentage',
      discountValue: 10,
      minPurchaseAmount: 5000,
      maxDiscountAmount: 10000,
      usageLimit: 1000,
      usageCount: 0,
      validFrom: new Date(),
      validUntil: new Date('2026-12-31'),
      isActive: true,
    },
    {
      code: 'THANOUT20',
      description: 'Réduction de 20% sur tout le site',
      discountType: 'percentage',
      discountValue: 20,
      minPurchaseAmount: 10000,
      maxDiscountAmount: 30000,
      usageLimit: 500,
      usageCount: 0,
      validFrom: new Date(),
      validUntil: new Date('2026-06-30'),
      isActive: true,
    },
    {
      code: 'SAVE5000',
      description: 'Réduction fixe de 5000 DA',
      discountType: 'fixed',
      discountValue: 5000,
      minPurchaseAmount: 20000,
      usageLimit: 300,
      usageCount: 0,
      validFrom: new Date(),
      validUntil: new Date('2026-12-31'),
      isActive: true,
    },
    {
      code: 'FREESHIP',
      description: 'Livraison gratuite',
      discountType: 'free_shipping',
      discountValue: 0,
      minPurchaseAmount: 15000,
      usageLimit: 2000,
      usageCount: 0,
      validFrom: new Date(),
      validUntil: new Date('2026-12-31'),
      isActive: true,
    },
  ];

  for (const promo of promoCodes) {
    const promoCode = await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    });
    console.log('✅ Code promo créé:', promoCode.code);
  }

  console.log('✨ Seeding terminé avec succès!');
  console.log('\n📋 Informations de connexion:');
  console.log('👤 Admin:');
  console.log('   Email: admin@thanout.com');
  console.log('   Mot de passe: Admin123!');
  console.log('\n👤 Utilisateur:');
  console.log('   Email: user@test.com');
  console.log('   Mot de passe: User123!');
  console.log('\n🎫 Codes promo disponibles:');
  console.log('   WELCOME10 - 10% de réduction (min 5000 DA)');
  console.log('   THANOUT20 - 20% de réduction (min 10000 DA)');
  console.log('   SAVE5000 - 5000 DA de réduction (min 20000 DA)');
  console.log('   FREESHIP - Livraison gratuite (min 15000 DA)');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


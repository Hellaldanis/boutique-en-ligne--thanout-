export const products = [
  {
    id: 1,
    name: 'Baskets Urbaines Premium',
    category: 'Chaussures',
    price: 15000,
    oldPrice: 20000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviews: 128,
    description: 'Des baskets urbaines premium conçues pour le confort et le style. Idéales pour un usage quotidien avec une semelle amortissante et un design moderne.',
    features: ['Semelle amortissante', 'Respirant', 'Léger', 'Design moderne'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Noir', 'Blanc', 'Gris', 'Bleu'],
    stock: 45,
    brand: 'UrbanStyle',
    tags: ['sport', 'casual', 'confort'],
    isNew: true
  },
  {
    id: 2,
    name: 'Sac à Main en Cuir Véritable',
    category: 'Accessoires',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop'
    ],
    rating: 5,
    reviews: 89,
    description: 'Sac à main élégant en cuir véritable, parfait pour toutes les occasions. Spacieux avec plusieurs compartiments pour organiser vos affaires.',
    features: ['Cuir véritable', 'Multiple compartiments', 'Fermeture éclair sécurisée', 'Bandoulière ajustable'],
    colors: ['Marron', 'Noir', 'Beige'],
    stock: 23,
    brand: 'LuxeLeather',
    tags: ['luxe', 'élégant', 'cuir'],
    isNew: true
  },
  {
    id: 3,
    name: 'T-Shirt Essentiel Cotton Bio',
    category: 'Mode',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop'
    ],
    rating: 4,
    reviews: 203,
    description: 'Un t-shirt basique indispensable en coton bio doux et confortable. Coupe classique qui s\'adapte à toutes les morphologies.',
    features: ['100% Coton Bio', 'Coupe classique', 'Col rond', 'Lavable en machine'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Noir', 'Gris', 'Bleu Marine'],
    stock: 150,
    brand: 'EcoWear',
    tags: ['basique', 'confortable', 'bio']
  },
  {
    id: 4,
    name: 'Montre Classique Automatique',
    category: 'Accessoires',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviews: 156,
    description: 'Montre automatique au design intemporel. Bracelet en cuir véritable et cadran minimaliste pour une élégance au quotidien.',
    features: ['Mouvement automatique', 'Verre saphir', 'Bracelet cuir', 'Résistant à l\'eau 5ATM'],
    colors: ['Argent/Noir', 'Or/Marron'],
    stock: 15,
    brand: 'TimeMaster',
    tags: ['élégant', 'automatique', 'classique']
  },
  {
    id: 5,
    name: 'Écouteurs Sans Fil Pro',
    category: 'Électronique',
    price: 18000,
    oldPrice: 24000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviews: 312,
    description: 'Expérience sonore immersive avec réduction de bruit active. Autonomie longue durée et confort exceptionnel.',
    features: ['Réduction de bruit active', 'Bluetooth 5.2', 'Autonomie 30h', 'Charge rapide'],
    colors: ['Noir', 'Argent'],
    stock: 60,
    brand: 'AudioTech',
    tags: ['audio', 'bluetooth', 'premium']
  },
  {
    id: 6,
    name: 'Veste en Jean Délavé',
    category: 'Mode',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542272617-08f086302542?w=800&h=800&fit=crop'
    ],
    rating: 4.3,
    reviews: 95,
    description: 'Veste en jean style vintage avec effet délavé. Un classique indémodable pour compléter votre garde-robe.',
    features: ['Denim 100% coton', 'Coupe regular', '4 poches', 'Boutons métalliques'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bleu Délavé', 'Noir'],
    stock: 35,
    brand: 'DenimCo',
    tags: ['denim', 'vintage', 'casual']
  }
];

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCartStore, useFavoritesStore, useCompareStore } from '../store';

// Données de produits (normalement viendraient d'une API)
const allProducts = [
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
    brand: 'UrbanStyle'
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
    brand: 'LuxeLeather'
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
    description: 'T-shirt basique en coton bio de haute qualité. Doux au toucher et respectueux de l\'environnement.',
    features: ['100% Coton Bio', 'Coupe régulière', 'Col rond', 'Durable'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir', 'Blanc', 'Gris', 'Bleu Marine'],
    stock: 150,
    brand: 'EcoWear'
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
    description: 'Montre automatique au design intemporel. Mécanisme de précision et bracelet en cuir véritable.',
    features: ['Mouvement automatique', 'Verre saphir', 'Étanche 50m', 'Bracelet cuir'],
    colors: ['Argent/Noir', 'Or/Marron'],
    stock: 15,
    brand: 'TimeMaster'
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
    description: 'Expérience audio immersive avec réduction de bruit active. Autonomie longue durée et confort exceptionnel.',
    features: ['Réduction de bruit active', 'Bluetooth 5.2', 'Autonomie 24h', 'Microphone HD'],
    colors: ['Noir', 'Blanc', 'Argent'],
    stock: 80,
    brand: 'AudioTech'
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
    description: 'Veste en jean style vintage avec effet délavé. Un classique indémodable pour votre garde-robe.',
    features: ['Denim robuste', 'Coupe ajustée', '4 poches', 'Boutons métalliques'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bleu Délavé', 'Noir', 'Gris'],
    stock: 40,
    brand: 'DenimCo'
  },
  {
    id: 7,
    name: 'Smartphone Pro Max',
    category: 'Électronique',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff23?w=800&h=800&fit=crop'
    ],
    rating: 4.9,
    reviews: 421,
    description: 'Le dernier cri de la technologie mobile. Écran ultra-fluide, appareil photo professionnel et performances inégalées.',
    features: ['Écran OLED 120Hz', 'Processeur dernière génération', 'Triple capteur photo', '5G'],
    colors: ['Graphite', 'Argent', 'Or', 'Bleu Pacifique'],
    stock: 10,
    brand: 'TechGiant'
  },
  {
    id: 8,
    name: 'Lunettes de Soleil Polarisées',
    category: 'Accessoires',
    price: 6500,
    oldPrice: 9000,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviews: 178,
    description: 'Protection optimale et style affirmé. Verres polarisés pour une vision claire sans reflets.',
    features: ['Verres polarisés UV400', 'Monture légère', 'Anti-rayures', 'Étui inclus'],
    colors: ['Noir', 'Écaille', 'Doré'],
    stock: 60,
    brand: 'SunStyle'
  }
];

function ProductDetail() {
  const { id } = useParams();
  const product = allProducts.find(p => p.id === parseInt(id)) || allProducts[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState('');

  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToCompare } = useCompareStore();

  const handleAddToCart = () => {
    addItem({ ...product, selectedSize, selectedColor, quantity });
    setShowNotification('Ajouté au panier');
    setTimeout(() => setShowNotification(''), 2000);
  };

  const handleCompare = () => {
    const result = addToCompare(product);
    setShowNotification(result.message);
    setTimeout(() => setShowNotification(''), 2000);
  };

  const productIsFavorite = isFavorite(product.id);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl z-50"
          >
            {showNotification}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative px-4 sm:px-6 lg:px-10 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-gray-500 hover:text-primary">Accueil</Link>
          <span className="text-gray-400">/</span>
          <Link to="/categories" className="text-gray-500 hover:text-primary">{product.category}</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div 
              className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl"
              layoutId={`product-${product.id}`}
            >
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  -{product.discount}%
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.brand && (
              <p className="text-primary font-semibold">{product.brand}</p>
            )}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < product.rating ? "'FILL' 1" : "'FILL' 0" }}>
                      star
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {product.rating} ({product.reviews} avis)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-bold text-primary">
                {new Intl.NumberFormat('fr-DZ').format(product.price)} DA
              </p>
              {product.oldPrice && (
                <p className="text-xl text-gray-400 line-through">
                  {new Intl.NumberFormat('fr-DZ').format(product.oldPrice)} DA
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-semibold mb-3">Caractéristiques :</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && (
              <div>
                <h3 className="font-semibold mb-3">Taille :</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 dark:border-gray-700 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && (
              <div>
                <h3 className="font-semibold mb-3">Couleur : <span className="text-primary">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 dark:border-gray-700 hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantité :</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="px-6 py-2 font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {product.stock} en stock
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Ajouter au panier
              </motion.button>

              <motion.button
                onClick={() => toggleFavorite(product)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all ${
                  productIsFavorite
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-gray-300 dark:border-gray-700 hover:border-red-500'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: productIsFavorite ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
              </motion.button>

              <motion.button
                onClick={handleCompare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-gray-300 dark:border-gray-700 hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined">compare</span>
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;

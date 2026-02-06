import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductReviews from '../components/ProductReviews';
import { useCartStore, useFavoritesStore, useAuthStore } from '../store';
import { API_ENDPOINTS } from '../config/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState('');

  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore((state) => ({ isAuthenticated: state.isAuthenticated }));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS.DETAIL(id)}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setSelectedSize(data.sizes?.[0] || null);
          setSelectedColor(data.colors?.[0] || null);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
            <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Ensure arrays exist to prevent errors if data is missing
  const images = product.images || [product.image];
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const features = product.features || [];

  const handleAddToCart = () => {
    addItem({ ...product, selectedSize, selectedColor, quantity });
    setShowNotification('Ajouté au panier');
    setTimeout(() => setShowNotification(''), 2000);
  };

  const handleBuyNow = () => {
    // Ajouter au panier
    addItem({ ...product, selectedSize, selectedColor, quantity });
    
    // Vérifier si connecté
    if (!isAuthenticated) {
      // Rediriger vers login puis checkout
      navigate('/login?redirect=checkout');
    } else {
      // Rediriger directement vers checkout
      navigate('/checkout');
    }
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
                src={images[selectedImage] || product.image}
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
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((img, index) => (
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
            {features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Caractéristiques :</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Taille :</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
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
            {colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Couleur : <span className="text-primary">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
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
            <div className="space-y-3 pt-4">
              <motion.button
                onClick={handleBuyNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Acheter maintenant
              </motion.button>

              <div className="flex gap-3">
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
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Reviews Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;

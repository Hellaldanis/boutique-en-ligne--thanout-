import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const bestSellers = [
  {
    id: 3,
    name: 'T-Shirt Essentiel Cotton Bio',
    category: 'Mode',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    rating: 4,
    reviews: 203,
    tags: ['basique', 'confortable', 'bio'],
    bestseller: true
  },
  {
    id: 1,
    name: 'Baskets Urbaines Premium',
    category: 'Chaussures',
    price: 15000,
    oldPrice: 20000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop',
    rating: 4.5,
    reviews: 128,
    tags: ['sport', 'casual', 'confort'],
    bestseller: true
  },
  {
    id: 4,
    name: 'Montre Classique Automatique',
    category: 'Accessoires',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop',
    rating: 4.5,
    reviews: 156,
    tags: ['élégant', 'automatique', 'classique'],
    bestseller: true
  },
  {
    id: 2,
    name: 'Sac à Main en Cuir Véritable',
    category: 'Accessoires',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=400&fit=crop',
    rating: 5,
    reviews: 89,
    tags: ['luxe', 'élégant', 'cuir'],
    bestseller: true
  },
];

function BestSellers() {
  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
            Meilleures Ventes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Les produits préférés de nos clients
          </p>
        </div>
        <Link to="/categories" className="text-sm font-medium text-primary hover:underline">
          Voir tout →
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {bestSellers.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default BestSellers;

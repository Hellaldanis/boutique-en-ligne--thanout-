import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const recentProducts = [
  {
    id: 5,
    name: 'Écouteurs Sans Fil Pro',
    category: 'Électronique',
    price: 18000,
    oldPrice: 24000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop',
    rating: 4.8,
    reviews: 312,
    tags: ['audio', 'bluetooth', 'premium'],
    isNew: true
  },
  {
    id: 6,
    name: 'Veste en Jean Délavé',
    category: 'Mode',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    rating: 4.3,
    reviews: 95,
    tags: ['denim', 'vintage', 'casual'],
    isNew: true
  },
  {
    id: 7,
    name: 'Smartphone Pro Max',
    category: 'Électronique',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=400&fit=crop',
    rating: 4.9,
    reviews: 421,
    tags: ['technologie', '5G', 'premium'],
    isNew: true
  },
  {
    id: 8,
    name: 'Lunettes de Soleil Polarisées',
    category: 'Accessoires',
    price: 6500,
    oldPrice: 9000,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop',
    rating: 4.6,
    reviews: 178,
    tags: ['protection', 'style', 'été'],
    isNew: true
  },
];

function RecentlyAdded() {
  return (
    <section className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
            Nouveautés
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Découvrez nos derniers arrivages
          </p>
        </div>
        <Link to="/nouveautes" className="text-sm font-medium text-primary hover:underline">
          Voir tout →
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {recentProducts.map((product, index) => (
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

export default RecentlyAdded;

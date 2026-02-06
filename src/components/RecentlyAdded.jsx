import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { API_ENDPOINTS } from '../config/api';
import { getNormalizedProductArray } from '../utils/product';

function RecentlyAdded() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS.LIST}?isNew=true&sortBy=createdAt&sortOrder=desc&limit=8`);
        if (response.ok) {
          const data = await response.json();
          setRecentProducts(getNormalizedProductArray(data));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des nouveautés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <section className="mt-12">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  if (recentProducts.length === 0) {
    return null;
  }

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
        {recentProducts.slice(0, 4).map((product, index) => (
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

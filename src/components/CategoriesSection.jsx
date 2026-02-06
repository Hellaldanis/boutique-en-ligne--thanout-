import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const ICONS_BY_SLUG = {
  electronique: 'phone_iphone',
  mode: 'checkroom',
  maison: 'chair',
  gaming: 'sports_esports',
  livres: 'auto_stories',
  supermarche: 'lunch_dining',
  beaute: 'spa',
  sport: 'fitness_center',
  jouets: 'toys',
};

const getCategoryIcon = (slug) => ICONS_BY_SLUG[slug?.toLowerCase()] || 'category';

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES.LIST);
        if (!response.ok) {
          throw new Error('Impossible de charger les catégories');
        }
        const data = await response.json();
        const activeCategories = Array.isArray(data)
          ? data.filter((cat) => cat.isActive !== false).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          : [];
        setCategories(activeCategories.slice(0, 6));
      } catch (error) {
        console.error('Erreur catégories section:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center px-0 pb-4 pt-5">
        <h2 className="text-gray-900 dark:text-gray-100 text-2xl font-bold leading-tight tracking-tight">
          Parcourir par catégorie
        </h2>
        <Link className="text-sm font-medium text-primary hover:underline" to="/categories">
          Voir tout
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {loading && Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="animate-pulse flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/50"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}

        {!loading && categories.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            Aucune catégorie disponible pour le moment.
          </div>
        )}

        {!loading && categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories?cat=${category.slug || category.name}`}
            className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700/50 text-center group"
          >
            <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">
              {getCategoryIcon(category.slug)}
            </span>
            <p className="text-sm font-semibold line-clamp-1">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;

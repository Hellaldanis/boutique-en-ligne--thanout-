import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { icon: 'phone_iphone', name: 'Électronique', link: '/categories?cat=electronique' },
  { icon: 'checkroom', name: 'Mode', link: '/categories?cat=mode' },
  { icon: 'chair', name: 'Maison', link: '/categories?cat=maison' },
  { icon: 'sports_esports', name: 'Gaming', link: '/categories?cat=gaming' },
  { icon: 'auto_stories', name: 'Livres', link: '/categories?cat=livres' },
  { icon: 'lunch_dining', name: 'Supermarché', link: '/categories?cat=supermarche' },
];

function CategoriesSection() {
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
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.link}
            className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700/50 text-center group"
          >
            <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">
              {category.icon}
            </span>
            <p className="text-sm font-semibold">{category.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;

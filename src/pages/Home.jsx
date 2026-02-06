import React from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoriesSection from '../components/CategoriesSection';
import ProductsSection from '../components/ProductsSection';
import RecentlyAdded from '../components/RecentlyAdded';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animé */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
        
        {/* Cercles flous animés */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Motif de grille */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(19, 91, 236, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(19, 91, 236, 0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <Header />
      <main className="relative flex-1 px-4 sm:px-6 lg:px-10 py-4">
        <HeroSlider />
        <CategoriesSection />
        <RecentlyAdded />
        <BestSellers />
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Categories() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
        <h1 className="text-3xl font-bold mb-8">Catégories</h1>
        <p className="text-gray-600">Page des catégories - En développement</p>
      </main>
      <Footer />
    </>
  );
}

export default Categories;

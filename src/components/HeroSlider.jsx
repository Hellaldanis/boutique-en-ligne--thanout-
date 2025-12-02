import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    title: 'Tout ce dont vous avez besoin, à portée de clic.',
    subtitle: 'Découvrez des milliers de produits et profitez d\'offres exclusives sur Thanout.'
  },
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
    title: 'Mode et Accessoires',
    subtitle: 'Les dernières tendances livrées chez vous en Algérie.'
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    title: 'Technologie et Innovation',
    subtitle: 'Les meilleurs produits électroniques aux meilleurs prix.'
  }
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="@container mb-8">
      <div className="@[480px]:p-0">
        <div 
          className="relative flex min-h-[400px] flex-col gap-4 bg-cover bg-center bg-no-repeat @[480px]:gap-6 rounded-2xl items-center justify-center p-4 text-center transition-all duration-1000 overflow-hidden shadow-2xl border border-white/20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("${slide.image}")`
          }}
        >
          {/* Overlay avec effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/20 to-blue-500/30 backdrop-blur-[2px]" />
          <div className="relative z-10 flex flex-col gap-3">
            <h1 className="text-white text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl drop-shadow-2xl">
              {slide.title}
            </h1>
            <p className="text-white text-sm font-normal leading-normal @[480px]:text-base max-w-xl mx-auto drop-shadow-lg">
              {slide.subtitle}
            </p>
          </div>
          <Link to="/categories" className="relative z-10">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-white text-primary text-sm font-bold leading-normal tracking-wide hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
              <span>Voir toutes les offres</span>
            </button>
          </Link>
          <div className="flex gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSlider;

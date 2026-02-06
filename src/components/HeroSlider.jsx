import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { getNormalizedProductArray } from '../utils/product';

const DEFAULT_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    title: 'Tout ce dont vous avez besoin, à portée de clic.',
    subtitle: 'Découvrez des milliers de produits et profitez d\'offres exclusives sur Thanout.',
    ctaLabel: 'Voir toutes les offres',
    link: '/categories'
  },
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
    title: 'Mode et Accessoires',
    subtitle: 'Les dernières tendances livrées chez vous en Algérie.',
    ctaLabel: 'Explorer la mode',
    link: '/categories?cat=mode'
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    title: 'Technologie et Innovation',
    subtitle: 'Les meilleurs produits électroniques aux meilleurs prix.',
    ctaLabel: 'Découvrir la tech',
    link: '/categories?cat=electronique'
  }
];

const truncate = (text, limit = 140) => {
  if (!text) return '';
  return text.length > limit ? `${text.slice(0, limit).trim()}…` : text;
};

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [loadingSlides, setLoadingSlides] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoadingSlides(true);
      try {
        const params = new URLSearchParams({
          isFeatured: 'true',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: '5'
        });
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Impossible de charger les produits vedettes');
        }
        const payload = await response.json();
        const products = getNormalizedProductArray(payload);
        if (products.length) {
          const heroSlides = products.slice(0, 5).map((product) => ({
            id: product.id,
            image: product.image,
            title: product.name,
            subtitle: truncate(product.shortDescription || product.description, 140),
            ctaLabel: product.discount > 0 ? `Profiter de -${product.discount}%` : 'Voir le produit',
            link: `/product/${product.slug || product.id}`,
            price: product.price,
            badge: product.isNew ? 'Nouveauté' : product.discount > 0 ? 'Promo' : null
          }));
          setSlides(heroSlides);
          setCurrentSlide(0);
        }
      } catch (error) {
        console.error('Hero slider fetch error:', error);
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoadingSlides(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const totalSlides = slides.length || 1;
        return (prev + 1) % totalSlides;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];
  const showBadge = slide?.badge || (!slide?.id && !loadingSlides);
  const ctaLabel = slide?.ctaLabel || 'Voir toutes les offres';
  const ctaLink = slide?.link || '/categories';

  const sliderBackground = useMemo(() => {
    const imageUrl = slide?.image;
    return imageUrl
      ? `linear-gradient(rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.65) 100%), url("${imageUrl}")`
      : undefined;
  }, [slide]);

  return (
    <div className="@container mb-8">
      <div className="@[480px]:p-0">
        <div 
          className="relative flex min-h-[400px] flex-col gap-4 bg-cover bg-center bg-no-repeat @[480px]:gap-6 rounded-2xl items-center justify-center p-4 text-center transition-all duration-1000 overflow-hidden shadow-2xl border border-white/20"
          style={{ backgroundImage: sliderBackground }}
        >
          {/* Overlay avec effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/20 to-blue-500/30 backdrop-blur-[2px]" />
          <div className="relative z-10 flex flex-col gap-3">
            {showBadge && (
              <span className="self-center px-4 py-1 rounded-full bg-white/80 text-primary text-xs font-semibold uppercase tracking-wide">
                {slide?.badge || 'Sélection Thanout'}
              </span>
            )}
            <h1 className="text-white text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl drop-shadow-2xl">
              {slide?.title}
            </h1>
            <p className="text-white text-sm font-normal leading-normal @[480px]:text-base max-w-xl mx-auto drop-shadow-lg">
              {slide?.subtitle}
            </p>
            {slide?.price && (
              <p className="text-white text-lg font-semibold">
                À partir de <span className="text-2xl font-black">{slide.price.toLocaleString('fr-DZ')} DA</span>
              </p>
            )}
          </div>
          <Link to={ctaLink} className="relative z-10">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-white text-primary text-sm font-bold leading-normal tracking-wide hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
              <span>{ctaLabel}</span>
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

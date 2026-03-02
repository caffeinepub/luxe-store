/**
 * HeroCarousel.tsx — Auto-advancing hero banner carousel with manual navigation
 * and dot indicators. Slides are hardcoded with generated hero banner images.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
}

const SLIDES: Slide[] = [
  {
    image:    '/assets/generated/hero-banner-1.dim_1200x500.png',
    title:    'Timeless Elegance',
    subtitle: 'Discover our curated collection of luxury clothing',
    cta:      'Shop Clothing',
    ctaLink:  '/products',
  },
  {
    image:    '/assets/generated/hero-banner-2.dim_1200x500.png',
    title:    'Precious Adornments',
    subtitle: 'Fine jewelry crafted for the discerning individual',
    cta:      'Explore Jewelry',
    ctaLink:  '/products',
  },
  {
    image:    '/assets/generated/hero-banner-3.dim_1200x500.png',
    title:    'Signature Scents',
    subtitle: 'Rare and exquisite fragrances from around the world',
    cta:      'Discover Perfumes',
    ctaLink:  '/products',
  },
];

const AUTO_ADVANCE_MS = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="relative w-full overflow-hidden bg-charcoal-900"
      style={{ aspectRatio: '1200/500' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
              <div className="max-w-lg animate-fade-in">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white/80 text-base sm:text-lg mb-6">
                  {slide.subtitle}
                </p>
                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold px-6 py-3 rounded-sm gold-shadow"
                >
                  <Link to={slide.ctaLink as never}>{slide.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? 'w-6 h-2 bg-accent'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

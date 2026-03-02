/**
 * ProductImageGallery.tsx — Swipeable product image gallery with main view,
 * navigation arrows, and thumbnail strip.
 */
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const validImages = images.filter((_, i) => !imageErrors.has(i));
  const displayImages = validImages.length > 0 ? validImages : [];

  const handlePrev = () => {
    setActiveIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = () => {
    setActiveIndex((i) => (i + 1) % displayImages.length);
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  if (displayImages.length === 0) {
    return (
      <div className="aspect-square bg-secondary rounded-lg flex items-center justify-center">
        <ImageOff className="h-16 w-16 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden group">
        <img
          src={displayImages[activeIndex]}
          alt={`${productName} — image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          onError={() => handleImageError(activeIndex)}
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-card opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-charcoal-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-card opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-charcoal-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-charcoal-900/60 text-white text-xs px-2 py-0.5 rounded-full">
            {activeIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? 'border-accent shadow-gold'
                  : 'border-border hover:border-accent/50'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(idx)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

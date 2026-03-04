import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [current, setCurrent] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : ["/assets/generated/hero-banner-1.dim_1200x500.png"];

  const prev = () =>
    setCurrent((c) => (c - 1 + displayImages.length) % displayImages.length);
  const next = () => setCurrent((c) => (c + 1) % displayImages.length);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-muted shadow-luxury"
        style={{ height: "420px" }}
      >
        <img
          src={displayImages[current]}
          alt={`${productName} - ${current + 1}`}
          className="w-full h-full object-cover"
        />
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              type="button"
              key={img}
              onClick={() => setCurrent(idx)}
              className={`shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === current
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              }`}
              style={{ width: "72px", height: "72px" }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

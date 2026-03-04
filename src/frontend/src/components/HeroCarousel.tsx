import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/assets/generated/hero-banner-1.dim_1200x500.png",
    title: "Luxury Redefined",
    subtitle: "Discover our exclusive collection of premium fashion",
    cta: "Shop Now",
    category: "",
  },
  {
    image: "/assets/generated/hero-banner-2.dim_1200x500.png",
    title: "Exquisite Jewelry",
    subtitle: "Timeless pieces crafted for the modern connoisseur",
    cta: "Explore Jewelry",
    category: "Jewelry",
  },
  {
    image: "/assets/generated/hero-banner-3.dim_1200x500.png",
    title: "Signature Fragrances",
    subtitle: "Indulge in our curated selection of luxury perfumes",
    cta: "Shop Perfumes",
    category: "Perfumes",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const handleCta = () => {
    const slide = slides[current];
    if (slide.category) {
      navigate({ to: "/products", search: { category: slide.category } });
    } else {
      navigate({ to: "/products" });
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-luxury-lg"
      style={{ height: "420px" }}
    >
      {slides.map((slide, idx) => (
        <div
          key={slide.title || idx.toString()}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-6 max-w-md drop-shadow">
              {slide.subtitle}
            </p>
            <button
              type="button"
              onClick={handleCta}
              className="self-start px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg"
            >
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, idx) => (
          <button
            type="button"
            key={`dot-${slide.title}`}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === current ? "w-6 bg-primary" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

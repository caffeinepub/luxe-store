/**
 * Home.tsx — Home page with hero carousel, category cards (using generated assets),
 * featured products grid, promotional banner, and new arrivals section.
 */
import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import CategoryCard from '@/components/CategoryCard';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import { useGetAllProducts } from '@/hooks/useQueries';

const CATEGORIES = [
  {
    name:     'Clothing',
    image:    '/assets/generated/category-clothes.dim_600x400.png',
    category: 'Clothing',
  },
  {
    name:     'Jewelry',
    image:    '/assets/generated/category-jewelry.dim_600x400.png',
    category: 'Jewelry',
  },
  {
    name:     'Perfumes',
    image:    '/assets/generated/category-perfumes.dim_600x400.png',
    category: 'Perfumes',
  },
];

export default function Home() {
  const { data: products, isLoading } = useGetAllProducts();

  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return products.slice(0, 8);
  }, [products]);

  const newArrivals = useMemo(() => {
    if (!products) return [];
    return [...products]
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 6);
  }, [products]);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel — no props, slides are hardcoded inside */}
      <HeroCarousel />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-accent uppercase tracking-widest mb-1">Browse By</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Shop Categories</h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-accent hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.category}
              name={cat.name}
              image={cat.image}
              category={cat.category}
              productCount={products?.filter((p) => p.category === cat.category).length}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-border" />
      </div>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-accent uppercase tracking-widest mb-1">Handpicked</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="text-sm text-accent hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No products available yet.</p>
            <p className="text-muted-foreground text-xs mt-1">Check back soon for new arrivals!</p>
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="bg-charcoal-800 border-y border-charcoal-700 py-12 my-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-accent uppercase tracking-widest mb-3">Exclusive Offer</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Free Shipping on Orders Over $100
          </h2>
          <p className="text-white/50 text-sm mb-6">Use code LUXE2026 at checkout</p>
          <Link
            to="/products"
            className="inline-block bg-accent text-accent-foreground px-8 py-3 font-semibold text-sm tracking-wide hover:bg-gold-600 transition-colors rounded-sm gold-shadow"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {(isLoading || newArrivals.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-accent uppercase tracking-widest mb-1">Just In</p>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">New Arrivals</h2>
            </div>
            <Link
              to="/products"
              className="text-sm text-accent hover:text-gold-600 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

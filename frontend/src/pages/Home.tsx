import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllProducts, useGetCallerUserProfile } from '../hooks/useQueries';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCard from '../components/CategoryCard';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import ProfileSetupModal from '../components/ProfileSetupModal';

export default function Home() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: products = [], isLoading } = useGetAllProducts();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const categories = [
    {
      name: 'Clothes',
      image: '/assets/generated/category-clothes.dim_600x400.png',
      count: products.filter((p) => p.category === 'Clothes').length,
    },
    {
      name: 'Jewelry',
      image: '/assets/generated/category-jewelry.dim_600x400.png',
      count: products.filter((p) => p.category === 'Jewelry').length,
    },
    {
      name: 'Perfumes',
      image: '/assets/generated/category-perfumes.dim_600x400.png',
      count: products.filter((p) => p.category === 'Perfumes').length,
    },
  ];

  const featuredProducts = products.slice(0, 8);
  const newArrivals = [...products]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      <ProfileSetupModal open={showProfileSetup} />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <HeroCarousel />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              image={cat.image}
              productCount={cat.count}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Featured Products</h2>
          <button
            onClick={() => navigate({ to: '/products' })}
            className="text-sm text-primary hover:underline font-medium"
          >
            View All →
          </button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No products yet.</p>
            <p className="text-sm mt-1">Check back soon for our luxury collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/20 p-8 md:p-12 text-center shadow-luxury">
          <div className="absolute inset-0 opacity-10">
            <img
              src="/assets/generated/hero-banner-2.dim_1200x500.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
              Exclusive Offer
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Up to 40% Off on Select Items
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Discover our handpicked selection of luxury items at unbeatable prices.
            </p>
            <button
              onClick={() => navigate({ to: '/products' })}
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-lg"
            >
              Shop the Sale
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">New Arrivals</h2>
            <button
              onClick={() => navigate({ to: '/products', search: { sort: 'newest' } })}
              className="text-sm text-primary hover:underline font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

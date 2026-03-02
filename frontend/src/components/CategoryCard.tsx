/**
 * CategoryCard.tsx — Clickable category card with image, overlay gradient,
 * and hover effects linking to filtered product listings.
 * Uses `productCount` prop (not `count`) for the item count display.
 */
import { Link } from '@tanstack/react-router';

interface CategoryCardProps {
  name: string;
  image: string;
  productCount?: number;
  category: string;
}

export default function CategoryCard({ name, image, productCount, category }: CategoryCardProps) {
  return (
    <Link
      to="/products"
      search={{ category } as never}
      className="group relative block overflow-hidden rounded-lg aspect-[3/2] bg-charcoal-800 shadow-card hover:shadow-card-hover transition-shadow duration-300 min-w-[200px]"
    >
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-serif text-xl font-semibold text-white mb-1">{name}</h3>
        {productCount !== undefined && (
          <p className="text-sm text-white/70">{productCount} products</p>
        )}
        <span className="inline-block mt-2 text-xs font-medium text-accent border border-accent/50 px-2 py-0.5 rounded-sm group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
          Shop Now →
        </span>
      </div>
    </Link>
  );
}

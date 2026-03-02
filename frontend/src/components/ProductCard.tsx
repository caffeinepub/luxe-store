/**
 * ProductCard.tsx — Product card with image, discount badge, wishlist toggle,
 * and navigation to product detail page. Exports ProductCardSkeleton as a
 * named export for use in loading states.
 */
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useAddToCart, useAddToWishlist, useGetWishlist } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/backend';
import { formatPrice } from '@/utils/urlParams';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const { data: wishlist } = useGetWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const [imageError, setImageError] = useState(false);

  const isAuthenticated = !!identity;
  const isWishlisted = wishlist?.productIds?.some((id) => id === product.id) ?? false;

  const discountedPrice =
    product.discountPercent > 0
      ? product.price * (1 - Number(product.discountPercent) / 100)
      : product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: 1n,
        variant: { quantity: 1n },
      });
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to save to wishlist');
      return;
    }
    try {
      await addToWishlist.mutateAsync(product.id);
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id.toString() }}
      className="group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
        {!imageError && product.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold">
            -{Number(product.discountPercent)}%
          </Badge>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={addToWishlist.isPending}
          className={`absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isWishlisted
              ? 'bg-accent text-accent-foreground'
              : 'bg-white/80 text-charcoal-600 hover:bg-accent hover:text-accent-foreground'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || Number(product.stock) === 0}
            className="w-full rounded-none bg-charcoal-900/90 hover:bg-accent text-white hover:text-accent-foreground text-sm py-2 h-auto"
          >
            {Number(product.stock) === 0 ? 'Out of Stock' : 'Quick Add'}
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3 w-3 ${star <= 4 ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">
            {formatPrice(discountedPrice)}
          </span>
          {product.discountPercent > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

/** Skeleton placeholder shown while products are loading. */
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-card">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart, Loader2, ArrowLeft, Star } from 'lucide-react';
import { useGetProduct } from '../hooks/useQueries';
import { useAddToCart } from '../hooks/useQueries';
import { useAddToWishlist, useGetWishlist } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProductImageGallery from '../components/ProductImageGallery';
import SizeSelector from '../components/SizeSelector';
import ColorVariantSelector from '../components/ColorVariantSelector';
import QuantityPicker from '../components/QuantityPicker';
import ReviewsList from '../components/ReviewsList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import type { ProductVariant } from '../backend';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const { data: wishlist } = useGetWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sizes = useMemo(() => {
    if (!product) return [];
    const sizeSet = new Set<string>();
    product.variants.forEach((v) => { if (v.size) sizeSet.add(v.size); });
    return Array.from(sizeSet);
  }, [product]);

  const colors = useMemo(() => {
    if (!product) return [];
    const colorSet = new Set<string>();
    product.variants.forEach((v) => { if (v.color) colorSet.add(v.color); });
    return Array.from(colorSet);
  }, [product]);

  const isInWishlist = wishlist?.productIds?.some((id) => id === product?.id) ?? false;

  const discountedPrice = product && product.discountPercent > 0
    ? product.price * (1 - Number(product.discountPercent) / 100)
    : product?.price ?? 0;

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please login to add to cart');
      return;
    }
    if (!product) return;

    const variant: ProductVariant = {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity: BigInt(quantity),
    };

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
        variant,
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!identity) {
      toast.error('Please login to add to wishlist');
      return;
    }
    if (!product) return;
    try {
      await addToWishlist.mutateAsync(product.id);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/5] rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-2xl text-foreground mb-4">Product not found</p>
        <Button onClick={() => navigate({ to: '/products' })} className="bg-gold text-charcoal hover:bg-gold-light">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/products' })}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-gold text-sm font-sans mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <ProductImageGallery images={product.imageUrls} productName={product.name} />

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <p className="text-gold text-xs font-sans uppercase tracking-wider mb-1">{product.category}{product.subCategory ? ` · ${product.subCategory}` : ''}</p>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">{product.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl text-gold">₹{discountedPrice.toFixed(0)}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-muted-foreground text-base line-through font-sans">₹{product.price.toFixed(0)}</span>
                <span className="bg-gold text-charcoal text-xs font-bold px-2 py-0.5 rounded-sm">
                  -{Number(product.discountPercent)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className={`text-xs font-sans ${Number(product.stock) > 0 ? 'text-green-500' : 'text-destructive'}`}>
            {Number(product.stock) > 0 ? `In Stock (${Number(product.stock)} available)` : 'Out of Stock'}
          </p>

          <Separator className="bg-border" />

          {/* Size Selector */}
          {product.category === 'Clothes' && sizes.length > 0 && (
            <SizeSelector sizes={sizes} selected={selectedSize} onSelect={setSelectedSize} />
          )}

          {/* Color Selector */}
          {colors.length > 0 && (
            <ColorVariantSelector colors={colors} selected={selectedColor} onSelect={setSelectedColor} />
          )}

          {/* Quantity */}
          <div>
            <h4 className="text-sm font-sans font-medium text-foreground mb-2">Quantity</h4>
            <QuantityPicker value={quantity} onChange={setQuantity} max={Number(product.stock)} />
          </div>

          {/* CTAs */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || Number(product.stock) === 0}
              className="flex-1 bg-gold text-charcoal hover:bg-gold-light font-semibold h-11"
            >
              {addToCart.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart</>
              )}
            </Button>
            <Button
              onClick={handleWishlist}
              disabled={addToWishlist.isPending}
              variant="outline"
              size="icon"
              className={`h-11 w-11 border-border ${isInWishlist ? 'text-gold border-gold/40 bg-gold/10' : 'text-muted-foreground hover:text-gold hover:border-gold/40'}`}
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-gold' : ''}`} />
            </Button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pt-2">
              <h4 className="text-sm font-sans font-semibold text-foreground mb-2">Description</h4>
              <p className="text-muted-foreground text-sm font-sans leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="font-serif text-xl text-foreground mb-6">Customer Reviews</h2>
        <ReviewsList productId={product.id} />
      </div>
    </div>
  );
}

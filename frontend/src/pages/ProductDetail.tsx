import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetProduct, useAddToCart, useAddToWishlist, useGetWishlist } from '../hooks/useQueries';
import ProductImageGallery from '../components/ProductImageGallery';
import SizeSelector from '../components/SizeSelector';
import ColorVariantSelector from '../components/ColorVariantSelector';
import QuantityPicker from '../components/QuantityPicker';
import ReviewsList from '../components/ReviewsList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const { data: wishlist } = useGetWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Button onClick={() => navigate({ to: '/products' })}>Back to Products</Button>
      </div>
    );
  }

  const sizes = [...new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))];

  const discountedPrice =
    product.discountPercent > 0
      ? product.price * (1 - Number(product.discountPercent) / 100)
      : product.price;

  const isWishlisted = wishlist?.productIds?.some((id) => id === product.id) ?? false;

  const handleAddToCart = () => {
    if (!isAuthenticated) return;
    addToCart.mutate({
      productId: product.id,
      quantity: BigInt(quantity),
      variant: {
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        quantity: BigInt(quantity),
      },
    });
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return;
    addToWishlist.mutate(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate({ to: '/products' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <ProductImageGallery images={product.imageUrls} productName={product.name} />

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wider mb-1">
              {product.category} · {product.subCategory}
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-muted-foreground line-through text-lg">${product.price.toFixed(2)}</span>
                <span className="bg-accent text-accent-foreground text-sm font-bold px-2 py-0.5 rounded-full">
                  -{Number(product.discountPercent)}%
                </span>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {sizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Size</p>
              <SizeSelector sizes={sizes} selected={selectedSize} onSelect={setSelectedSize} />
            </div>
          )}

          {colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Color</p>
              <ColorVariantSelector colors={colors} selected={selectedColor} onSelect={setSelectedColor} />
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Quantity</p>
            <QuantityPicker
              value={quantity}
              min={1}
              max={Number(product.stock)}
              onChange={setQuantity}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {Number(product.stock) > 0 ? (
              <span className="text-green-500 font-medium">In Stock ({Number(product.stock)} available)</span>
            ) : (
              <span className="text-destructive font-medium">Out of Stock</span>
            )}
          </p>

          {isAuthenticated ? (
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending || Number(product.stock) === 0}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlist}
                disabled={addToWishlist.isPending}
                className={`gap-2 ${isWishlisted ? 'border-primary text-primary' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
              Please log in to add items to your cart or wishlist.
            </p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
        <ReviewsList productId={product.id} />
      </div>
    </div>
  );
}

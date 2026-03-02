/**
 * CartItemCard.tsx — Cart item row with product image, name, variant info,
 * quantity picker, price, and remove functionality.
 */
import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAddToCart } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import type { CartItem, Product } from '@/backend';
import { formatPrice } from '@/utils/urlParams';

interface CartItemCardProps {
  item: CartItem;
  product: Product | undefined;
  onRemove: (item: CartItem) => void;
  isRemoving?: boolean;
}

export default function CartItemCard({ item, product, onRemove, isRemoving }: CartItemCardProps) {
  const addToCart = useAddToCart();
  const [imageError, setImageError] = useState(false);

  const quantity = Number(item.quantity);
  const price = product ? product.price * (1 - Number(product.discountPercent) / 100) : 0;
  const lineTotal = price * quantity;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1 || !product) return;
    if (product.stock !== undefined && newQty > Number(product.stock)) {
      toast.error('Not enough stock available');
      return;
    }
    try {
      await addToCart.mutateAsync({
        productId: item.productId,
        quantity: BigInt(newQty),
        variant: item.variant,
      });
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  return (
    <div className={`flex gap-4 py-4 border-b border-border last:border-0 ${isRemoving ? 'opacity-50' : ''}`}>
      {/* Image */}
      <div className="shrink-0 w-20 h-24 bg-secondary rounded-md overflow-hidden">
        {!imageError && product?.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product?.name ?? 'Product'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
          {product?.name ?? `Product #${item.productId.toString()}`}
        </h4>

        {/* Variant Info */}
        {(item.variant.size || item.variant.color) && (
          <p className="text-xs text-muted-foreground mb-2">
            {item.variant.size && <span>Size: {item.variant.size}</span>}
            {item.variant.size && item.variant.color && <span> · </span>}
            {item.variant.color && <span>Color: {item.variant.color}</span>}
          </p>
        )}

        {/* Price */}
        <p className="text-sm font-semibold text-accent mb-3">
          {formatPrice(lineTotal)}
        </p>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-border rounded-sm">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || addToCart.isPending}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={addToCart.isPending}
              className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              +
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item)}
            disabled={isRemoving}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

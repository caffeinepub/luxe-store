/**
 * OrderSummary.tsx — Order summary panel with subtotal, discount, shipping,
 * and total calculations. Optionally renders a checkout button.
 */
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CartItem, Product } from '@/backend';
import { formatPrice } from '@/utils/urlParams';

interface OrderSummaryProps {
  items: CartItem[];
  products: Product[];
  showCheckoutButton?: boolean;
  isCheckoutLoading?: boolean;
  onCheckout?: () => void;
}

export default function OrderSummary({
  items,
  products,
  showCheckoutButton = true,
  isCheckoutLoading = false,
  onCheckout,
}: OrderSummaryProps) {
  const getProduct = (productId: bigint) =>
    products.find((p) => p.id === productId);

  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    if (!product) return sum;
    return sum + product.price * Number(item.quantity);
  }, 0);

  const discount = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    if (!product || product.discountPercent === 0n) return sum;
    const discountAmount = product.price * (Number(product.discountPercent) / 100);
    return sum + discountAmount * Number(item.quantity);
  }, 0);

  const shipping = subtotal - discount > 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4">
      <h3 className="font-serif text-lg font-semibold">Order Summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({items.reduce((s, i) => s + Number(i.quantity), 0)} items)
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-destructive">
            <span>Discount</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        {shipping === 0 && (
          <p className="text-xs text-success">🎉 You qualify for free shipping!</p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between font-semibold text-base">
        <span>Total</span>
        <span className="text-accent">{formatPrice(total)}</span>
      </div>

      {showCheckoutButton && (
        onCheckout ? (
          <Button
            onClick={onCheckout}
            disabled={isCheckoutLoading || items.length === 0}
            className="w-full bg-accent text-accent-foreground hover:bg-gold-600 font-semibold rounded-sm gold-shadow"
          >
            {isCheckoutLoading ? 'Processing…' : 'Proceed to Checkout'}
          </Button>
        ) : (
          <Button
            asChild
            disabled={items.length === 0}
            className="w-full bg-accent text-accent-foreground hover:bg-gold-600 font-semibold rounded-sm gold-shadow"
          >
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        )
      )}

      <p className="text-xs text-muted-foreground text-center">
        Free shipping on orders over $100
      </p>
    </div>
  );
}

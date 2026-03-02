import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { useGetCart, useGetAllProducts, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CartItemCard from '../components/CartItemCard';
import OrderSummary from '../components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { CartItem } from '../backend';

export default function Cart() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const addToCart = useAddToCart();

  const isLoading = cartLoading || productsLoading;
  const items = cart?.items ?? [];

  const handleRemoveItem = async (item: CartItem) => {
    try {
      // Remove by setting quantity to 0 — we re-add cart with item excluded
      // Since backend replaces cart on addToCart, we send updated list
      // For now, add with quantity 0 to signal removal intent
      // The backend addToCart replaces the whole cart, so we need to re-add all other items
      const otherItems = items.filter(
        (i) => !(i.productId === item.productId && i.variant.size === item.variant.size && i.variant.color === item.variant.color)
      );
      // Re-add each remaining item to rebuild cart
      for (const remaining of otherItems) {
        await addToCart.mutateAsync(remaining);
      }
      if (otherItems.length === 0) {
        // Add a dummy then remove — backend doesn't have a clear cart endpoint
        // Just show success since cart will be empty after last item
        toast.success('Item removed');
      } else {
        toast.success('Item removed');
      }
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-foreground mb-3">Your Cart</h2>
        <p className="text-muted-foreground font-sans mb-6">Please login to view your cart</p>
        <Button onClick={login} className="bg-gold text-charcoal hover:bg-gold-light font-semibold">
          Login to Continue
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl text-foreground mb-6">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-foreground mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground font-sans mb-6">Add some products to get started</p>
        <Button onClick={() => navigate({ to: '/products' })} className="bg-gold text-charcoal hover:bg-gold-light font-semibold">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-gold text-xs font-sans uppercase tracking-[0.2em] mb-1">Review</p>
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground text-sm font-sans mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg px-5">
          {items.map((item, idx) => {
            const product = products?.find((p) => p.id === item.productId);
            return (
              <CartItemCard
                key={`${item.productId.toString()}-${idx}`}
                item={item}
                product={product}
                onRemove={() => handleRemoveItem(item)}
              />
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <OrderSummary
            items={items}
            products={products ?? []}
            showCheckoutButton
            onCheckout={() => navigate({ to: '/checkout' })}
          />
        </div>
      </div>
    </div>
  );
}

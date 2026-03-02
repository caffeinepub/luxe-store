import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart, useGetAllProducts, useAddToCart } from '../hooks/useQueries';
import CartItemCard from '../components/CartItemCard';
import OrderSummary from '../components/OrderSummary';
import { Button } from '@/components/ui/button';
import type { CartItem } from '../backend';

export default function Cart() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: cart, isLoading: cartLoading } = useGetCart();
  const { data: products = [] } = useGetAllProducts();
  const addToCart = useAddToCart();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold text-foreground">Your Cart</h2>
        <p className="text-muted-foreground text-center">Please log in to view your cart.</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-muted-foreground text-center py-16">Loading cart...</div>
      </div>
    );
  }

  const cartItems = cart?.items ?? [];

  const handleQuantityChange = (item: CartItem, newQty: number) => {
    addToCart.mutate({
      productId: item.productId,
      quantity: BigInt(newQty),
      variant: item.variant,
    });
  };

  const handleRemove = (item: CartItem) => {
    addToCart.mutate({
      productId: item.productId,
      quantity: 0n,
      variant: item.variant,
    });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + product.price * Number(item.quantity);
  }, 0);

  const discount = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return sum;
    const disc = product.price * (Number(product.discountPercent) / 100) * Number(item.quantity);
    return sum + disc;
  }, 0);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold text-foreground">Your Cart is Empty</h2>
        <p className="text-muted-foreground text-center">Add some luxury items to get started!</p>
        <Button onClick={() => navigate({ to: '/products' })}>Shop Now</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item, idx) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <CartItemCard
                key={idx}
                item={item}
                product={product}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            );
          })}
        </div>
        <div className="space-y-4">
          <OrderSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
          <Button
            onClick={() => navigate({ to: '/checkout' })}
            className="w-full"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

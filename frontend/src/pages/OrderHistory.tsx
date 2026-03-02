/**
 * OrderHistory.tsx — Order history page listing all user orders sorted by date
 * with status badges and navigation to individual order tracking pages.
 * Uses the correct route /orders/$orderId for tracking navigation.
 */
import { useNavigate } from '@tanstack/react-router';
import { Package, ChevronRight } from 'lucide-react';
import { useGetUserOrders } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatus } from '@/backend';

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.placed]:         'Placed',
  [OrderStatus.confirmed]:      'Confirmed',
  [OrderStatus.shipped]:        'Shipped',
  [OrderStatus.outForDelivery]: 'Out for Delivery',
  [OrderStatus.delivered]:      'Delivered',
  [OrderStatus.cancelled]:      'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.placed]:         'border-blue-400/40 text-blue-400',
  [OrderStatus.confirmed]:      'border-yellow-400/40 text-yellow-400',
  [OrderStatus.shipped]:        'border-purple-400/40 text-purple-400',
  [OrderStatus.outForDelivery]: 'border-orange-400/40 text-orange-400',
  [OrderStatus.delivered]:      'border-green-400/40 text-green-400',
  [OrderStatus.cancelled]:      'border-red-400/40 text-red-400',
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: orders, isLoading } = useGetUserOrders();

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-semibold mb-3">My Orders</h2>
        <p className="text-muted-foreground mb-6">Please login to view your orders</p>
        <Button
          onClick={login}
          className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl font-semibold mb-6">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const sortedOrders = [...(orders ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt)
  );

  if (sortedOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-semibold mb-3">No orders yet</h2>
        <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
        <Button
          onClick={() => navigate({ to: '/products' })}
          className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs text-accent uppercase tracking-widest mb-1">Account</p>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">My Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <div
            key={order.id.toString()}
            className="bg-card border border-border rounded-lg p-5 cursor-pointer hover:border-accent/30 transition-all group"
            onClick={() =>
              navigate({
                to: '/orders/$orderId',
                params: { orderId: order.id.toString() },
              })
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-sm">Order #{order.id.toString()}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${STATUS_COLORS[String(order.status)] ?? 'border-border text-muted-foreground'}`}
                  >
                    {STATUS_LABELS[String(order.status)] ?? String(order.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-serif text-lg text-accent">
                  ${order.totalAmount.toFixed(2)}
                </p>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors ml-auto mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

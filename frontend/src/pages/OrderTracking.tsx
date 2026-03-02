/**
 * OrderTracking.tsx — Order tracking page with visual status timeline,
 * order details, shipping address, and payment method.
 * Uses the correct route path /orders/$orderId for useParams.
 */
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useGetOrder } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/backend';

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.placed]:         'Placed',
  [OrderStatus.confirmed]:      'Confirmed',
  [OrderStatus.shipped]:        'Shipped',
  [OrderStatus.outForDelivery]: 'Out for Delivery',
  [OrderStatus.delivered]:      'Delivered',
  [OrderStatus.cancelled]:      'Cancelled',
};

export default function OrderTracking() {
  // Route is /orders/$orderId
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-semibold mb-3">Order Tracking</h2>
        <p className="text-muted-foreground mb-6">Please login to track your order</p>
        <Button
          onClick={() => navigate({ to: '/' })}
          className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
        >
          Go Home
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-xl mb-4">Order not found</p>
        <Button
          onClick={() => navigate({ to: '/orders' })}
          className="bg-accent text-accent-foreground hover:bg-gold-600"
        >
          My Orders
        </Button>
      </div>
    );
  }

  const statusStr = String(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate({ to: '/orders' })}
        className="flex items-center gap-1.5 text-muted-foreground hover:text-accent text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-accent uppercase tracking-widest mb-1">Tracking</p>
          <h1 className="font-serif text-2xl font-semibold">Order #{order.id.toString()}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Placed on{' '}
            {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge variant="outline" className="border-accent/40 text-accent text-xs shrink-0">
          {STATUS_LABELS[statusStr] ?? statusStr}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Order Status</h2>
          <OrderStatusTimeline currentStatus={statusStr} />
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Items */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-serif text-base font-semibold mb-3">
              Items ({order.items.length})
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-foreground/70">
                    Product #{item.productId.toString()}
                  </span>
                  <span className="text-muted-foreground">×{Number(item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span className="text-accent">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-serif text-base font-semibold mb-3">Shipping Address</h3>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-serif text-base font-semibold mb-2">Payment</h3>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod.__kind__ === 'upi' && 'UPI'}
              {order.paymentMethod.__kind__ === 'creditCard' && 'Credit / Debit Card'}
              {order.paymentMethod.__kind__ === 'wallet' && 'Digital Wallet'}
              {order.paymentMethod.__kind__ === 'cashOnDelivery' && 'Cash on Delivery'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

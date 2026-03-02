/**
 * OrderConfirmation.tsx — Order confirmation page showing success state,
 * order ID, items, shipping address, payment method, and total.
 * Navigation to order tracking uses the correct route: /orders/$orderId.
 */
import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle, Package, Loader2 } from 'lucide-react';
import { useGetOrder } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/backend';

const STATUS_LABELS: Record<string, string> = {
  [OrderStatus.placed]:         'Order Placed',
  [OrderStatus.confirmed]:      'Confirmed',
  [OrderStatus.shipped]:        'Shipped',
  [OrderStatus.outForDelivery]: 'Out for Delivery',
  [OrderStatus.delivered]:      'Delivered',
  [OrderStatus.cancelled]:      'Cancelled',
};

export default function OrderConfirmation() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
        <p className="text-muted-foreground">Loading your order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-xl mb-4">Order not found</p>
        <Button
          onClick={() => navigate({ to: '/' })}
          className="bg-accent text-accent-foreground hover:bg-gold-600"
        >
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/15 mb-5">
          <CheckCircle className="h-10 w-10 text-accent" />
        </div>
        <h1 className="font-serif text-3xl font-semibold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>

      {/* Order details card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Order ID */}
        <div className="bg-accent/10 border-b border-accent/20 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</p>
            <p className="font-serif text-lg text-accent">#{order.id.toString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
            <p className="text-sm font-medium">
              {STATUS_LABELS[String(order.status)] ?? String(order.status)}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Items */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Items Ordered</h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    Product #{item.productId.toString()}
                  </span>
                  <span className="text-muted-foreground">×{Number(item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold mb-2">Shipping Address</h3>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold mb-2">Payment</h3>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod.__kind__ === 'upi' && 'UPI'}
              {order.paymentMethod.__kind__ === 'creditCard' && 'Credit / Debit Card'}
              {order.paymentMethod.__kind__ === 'wallet' && 'Digital Wallet'}
              {order.paymentMethod.__kind__ === 'cashOnDelivery' && 'Cash on Delivery'}
            </p>
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="font-serif text-xl text-accent">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          onClick={() =>
            navigate({ to: '/orders/$orderId', params: { orderId: order.id.toString() } })
          }
          className="flex-1 bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
        >
          <Package className="h-4 w-4 mr-2" />
          Track Order
        </Button>
        <Button
          onClick={() => navigate({ to: '/products' })}
          variant="outline"
          className="flex-1"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

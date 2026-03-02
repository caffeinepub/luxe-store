interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ subtotal, discount, shipping, total }: OrderSummaryProps) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-luxury space-y-3">
      <h3 className="font-display font-bold text-foreground text-lg mb-4">Order Summary</h3>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="text-foreground">${subtotal.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span className="text-accent">-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span className="text-foreground">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="border-t border-border pt-3 flex justify-between font-bold">
        <span className="text-foreground">Total</span>
        <span className="text-primary text-lg">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

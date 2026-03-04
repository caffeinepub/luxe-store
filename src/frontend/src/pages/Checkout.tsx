import type { PaymentMethod, ShippingAddress } from "@/backend";
import OrderSummary from "@/components/OrderSummary";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetAllProducts,
  useGetCart,
  usePlaceOrder,
} from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Loader2 } from "lucide-react";
/**
 * Checkout.tsx — Multi-step checkout wizard (Shipping → Payment → Review)
 * with address form, payment method selection, order review, and place order mutation.
 * paymentMethod defaults to cashOnDelivery (never null) to satisfy PaymentMethodSelector.
 */
import { useState } from "react";
import { toast } from "sonner";

const STEPS = ["Shipping", "Payment", "Review"];

const EMPTY_ADDRESS: ShippingAddress = {
  name: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "United States",
  phone: "",
};

// Default payment method — never null so PaymentMethodSelector is always valid
const DEFAULT_PAYMENT: PaymentMethod = {
  __kind__: "cashOnDelivery",
  cashOnDelivery: null,
};

export default function Checkout() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const { data: products } = useGetAllProducts();
  const placeOrder = usePlaceOrder();

  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>(DEFAULT_PAYMENT);

  const items = cart?.items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const product = products?.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + product.price * Number(item.quantity);
  }, 0);

  const discount = items.reduce((sum, item) => {
    const product = products?.find((p) => p.id === item.productId);
    if (!product) return sum;
    return (
      sum +
      product.price *
        (Number(product.discountPercent) / 100) *
        Number(item.quantity)
    );
  }, 0);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal - discount + shipping;

  const validateAddress = () => {
    const required: (keyof ShippingAddress)[] = [
      "name",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
      "phone",
    ];
    return required.every((field) => shippingAddress[field].trim() !== "");
  };

  const handleNextStep = () => {
    if (step === 0 && !validateAddress()) {
      toast.error("Please fill in all required address fields");
      return;
    }
    setStep((s) => s + 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const orderId = await placeOrder.mutateAsync({
        items,
        shippingAddress,
        paymentMethod,
        totalAmount: total,
      });
      toast.success("Order placed successfully!");
      navigate({
        to: "/order-confirmation/$orderId",
        params: { orderId: orderId.toString() },
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl mb-3">Checkout</h2>
        <p className="text-muted-foreground mb-6">
          Please login to proceed with checkout
        </p>
        <Button
          onClick={login}
          className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
        >
          Login to Continue
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl mb-3">Your cart is empty</h2>
        <Button
          onClick={() => navigate({ to: "/products" })}
          className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs text-accent uppercase tracking-widest mb-1">
          Secure
        </p>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">
          Checkout
        </h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < step
                    ? "bg-accent border-accent text-accent-foreground"
                    : i === step
                      ? "border-accent text-accent bg-accent/10"
                      : "border-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-sm hidden sm:block ${
                  i === step
                    ? "text-accent font-medium"
                    : i < step
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-2 sm:mx-3" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step Content */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          {step === 0 && (
            <>
              <h3 className="font-serif text-lg font-semibold mb-4">
                Shipping Address
              </h3>
              <ShippingAddressForm
                value={shippingAddress}
                onChange={setShippingAddress}
              />
            </>
          )}

          {step === 1 && (
            <>
              <h3 className="font-serif text-lg font-semibold mb-4">
                Payment Method
              </h3>
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg font-semibold">
                Review Your Order
              </h3>

              {/* Address summary */}
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Shipping To</h4>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-xs text-accent hover:text-gold-600"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.phone}
                </p>
              </div>

              {/* Payment summary */}
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Payment Method</h4>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-accent hover:text-gold-600"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {paymentMethod.__kind__ === "upi" && "UPI"}
                  {paymentMethod.__kind__ === "creditCard" &&
                    "Credit / Debit Card"}
                  {paymentMethod.__kind__ === "wallet" && "Digital Wallet"}
                  {paymentMethod.__kind__ === "cashOnDelivery" &&
                    "Cash on Delivery"}
                </p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold mb-3">
                  Items ({items.length})
                </h4>
                <div className="space-y-2">
                  {items.map((item, idx) => {
                    const product = products?.find(
                      (p) => p.id === item.productId,
                    );
                    if (!product) return null;
                    return (
                      <div
                        key={`${item.productId}-${idx}`}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-secondary shrink-0">
                          <img
                            src={product.imageUrls?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="flex-1 text-foreground/80 line-clamp-1">
                          {product.name}
                        </span>
                        <span className="text-muted-foreground">
                          ×{Number(item.quantity)}
                        </span>
                        <span className="text-accent font-medium">
                          ${(product.price * Number(item.quantity)).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            {step > 0 ? (
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                className="border-border"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <Button
                onClick={handleNextStep}
                className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                disabled={placeOrder.isPending}
                className="bg-accent text-accent-foreground hover:bg-gold-600 font-semibold"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}

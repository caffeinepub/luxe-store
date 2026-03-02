/**
 * PaymentMethodSelector.tsx — Payment method selector supporting UPI,
 * credit/debit card, wallet, and cash on delivery.
 * value accepts PaymentMethod (never null) — callers must provide a default.
 */
import { CreditCard, Smartphone, Wallet, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PaymentMethod, CreditCardInfo } from '@/backend';

type PaymentKind = 'upi' | 'creditCard' | 'wallet' | 'cashOnDelivery';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const METHODS: Array<{
  kind: PaymentKind;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  { kind: 'upi',            label: 'UPI',                 icon: Smartphone, description: 'Pay via UPI ID' },
  { kind: 'creditCard',     label: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
  { kind: 'wallet',         label: 'Digital Wallet',      icon: Wallet,     description: 'PayPal, Apple Pay, etc.' },
  { kind: 'cashOnDelivery', label: 'Cash on Delivery',    icon: Package,    description: 'Pay when you receive' },
];

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const selectedKind = value.__kind__;

  const handleSelect = (kind: PaymentKind) => {
    if (kind === 'creditCard') {
      onChange({ __kind__: 'creditCard', creditCard: { cardNumber: '', expiry: '', cvv: '' } });
    } else if (kind === 'upi') {
      onChange({ __kind__: 'upi', upi: null });
    } else if (kind === 'wallet') {
      onChange({ __kind__: 'wallet', wallet: null });
    } else {
      onChange({ __kind__: 'cashOnDelivery', cashOnDelivery: null });
    }
  };

  const handleCardChange = (field: keyof CreditCardInfo, val: string) => {
    if (value.__kind__ === 'creditCard') {
      onChange({
        __kind__: 'creditCard',
        creditCard: { ...value.creditCard, [field]: val },
      });
    }
  };

  return (
    <div className="space-y-3">
      {METHODS.map(({ kind, label, icon: Icon, description }) => (
        <div key={kind}>
          <button
            type="button"
            onClick={() => handleSelect(kind)}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
              selectedKind === kind
                ? 'border-accent bg-gold-50'
                : 'border-border hover:border-accent/50 bg-card'
            }`}
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                selectedKind === kind
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div
              className={`ml-auto h-4 w-4 rounded-full border-2 shrink-0 ${
                selectedKind === kind ? 'border-accent bg-accent' : 'border-muted-foreground'
              }`}
            />
          </button>

          {/* Credit Card Fields */}
          {kind === 'creditCard' && selectedKind === 'creditCard' && (
            <div className="mt-3 p-4 bg-secondary rounded-lg space-y-3">
              <div>
                <Label htmlFor="cardNumber" className="text-xs font-medium mb-1 block">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={
                    (value as { __kind__: 'creditCard'; creditCard: CreditCardInfo }).creditCard
                      .cardNumber
                  }
                  onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry" className="text-xs font-medium mb-1 block">
                    Expiry (MM/YY)
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={
                      (value as { __kind__: 'creditCard'; creditCard: CreditCardInfo }).creditCard
                        .expiry
                    }
                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-xs font-medium mb-1 block">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    type="password"
                    value={
                      (value as { __kind__: 'creditCard'; creditCard: CreditCardInfo }).creditCard
                        .cvv
                    }
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

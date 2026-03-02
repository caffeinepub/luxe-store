import { CreditCard, Smartphone, Wallet, Package } from 'lucide-react';
import type { PaymentMethod } from '../backend';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const methods = [
  {
    id: 'upi' as const,
    label: 'UPI',
    description: 'Pay via UPI apps',
    icon: Smartphone,
    value: { __kind__: 'upi', upi: null } as PaymentMethod,
  },
  {
    id: 'creditCard' as const,
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, etc.',
    icon: CreditCard,
    value: {
      __kind__: 'creditCard',
      creditCard: { cardNumber: '', expiry: '', cvv: '' },
    } as PaymentMethod,
  },
  {
    id: 'wallet' as const,
    label: 'Wallet',
    description: 'Pay from your wallet balance',
    icon: Wallet,
    value: { __kind__: 'wallet', wallet: null } as PaymentMethod,
  },
  {
    id: 'cashOnDelivery' as const,
    label: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: Package,
    value: { __kind__: 'cashOnDelivery', cashOnDelivery: null } as PaymentMethod,
  },
];

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = value.__kind__ === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface hover:border-primary/50'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{method.label}</p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

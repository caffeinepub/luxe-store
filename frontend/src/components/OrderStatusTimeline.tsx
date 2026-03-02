import { Check, Package, Truck, MapPin, CheckCircle, XCircle } from 'lucide-react';

const steps = [
  { key: 'placed', label: 'Order Placed', icon: Check },
  { key: 'confirmed', label: 'Confirmed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'outForDelivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

interface OrderStatusTimelineProps {
  currentStatus: string;
}

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
        <XCircle className="h-6 w-6 text-destructive" />
        <span className="font-semibold text-destructive">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-start gap-0 overflow-x-auto pb-2">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isCompleted = idx <= currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center min-w-[80px]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-border text-muted-foreground'
                } ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-2' : ''}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs mt-2 text-center font-medium ${
                  isCompleted ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 mb-5 transition-colors ${
                  idx < currentIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

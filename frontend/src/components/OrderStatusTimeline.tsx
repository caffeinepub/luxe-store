/**
 * OrderStatusTimeline.tsx — Visual step-by-step order status timeline
 * with gold indicators and timestamps. OrderStatus is an enum so we
 * compare using String() conversion, not .__kind__.
 */
import { Check } from 'lucide-react';
import type { OrderStatusHistory } from '@/backend';
import { getOrderStatusLabel, formatTimestampFull } from '@/utils/urlParams';

const STATUS_ORDER = [
  'placed',
  'confirmed',
  'shipped',
  'outForDelivery',
  'delivered',
];

interface OrderStatusTimelineProps {
  statusHistory: OrderStatusHistory[];
  currentStatus: string;
}

export default function OrderStatusTimeline({
  statusHistory,
  currentStatus,
}: OrderStatusTimelineProps) {
  const isCancelled = currentStatus === 'cancelled';

  // OrderStatus is an enum — compare using String() conversion
  const getHistoryEntry = (status: string) =>
    statusHistory.find((h) => String(h.status) === status);

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {isCancelled ? (
        <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-destructive flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">✕</span>
          </div>
          <div>
            <p className="font-medium text-destructive">Order Cancelled</p>
            {getHistoryEntry('cancelled') && (
              <p className="text-xs text-muted-foreground">
                {formatTimestampFull(getHistoryEntry('cancelled')!.timestamp)}
              </p>
            )}
          </div>
        </div>
      ) : (
        STATUS_ORDER.map((status, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent   = idx === currentIndex;
          const historyEntry = getHistoryEntry(status);
          const isLast = idx === STATUS_ORDER.length - 1;

          return (
            <div key={status} className="flex gap-3">
              {/* Indicator Column */}
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCompleted
                      ? 'bg-accent border-accent text-accent-foreground'
                      : 'bg-card border-border text-muted-foreground'
                  } ${isCurrent ? 'shadow-gold' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-[2rem] my-1 ${
                      idx < currentIndex ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 pt-1">
                <p className={`font-medium text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {getOrderStatusLabel(status)}
                </p>
                {historyEntry && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimestampFull(historyEntry.timestamp)}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

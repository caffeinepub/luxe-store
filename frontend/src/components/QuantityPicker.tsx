/**
 * QuantityPicker.tsx — Quantity picker with increment/decrement controls
 * and min/max bounds validation.
 */
import { Minus, Plus } from 'lucide-react';

interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantityPickerProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center border border-border rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-x border-border">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

import { Minus, Plus } from 'lucide-react';

interface QuantityPickerProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

export default function QuantityPicker({ value, min = 1, max = 99, onChange }: QuantityPickerProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface transition-colors disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-foreground">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface transition-colors disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

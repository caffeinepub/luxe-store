/**
 * SortDropdown.tsx — Sort dropdown with four sort options.
 * value accepts a string (SortOption) for flexibility with page state.
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'newest';

interface SortDropdownProps {
  value: string;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest First' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-44 h-9 text-sm">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-sm">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

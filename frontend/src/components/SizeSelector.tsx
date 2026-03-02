/**
 * SizeSelector.tsx — Size selector with visual selection state and gold highlight.
 */
interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-2">
        Size: <span className="text-muted-foreground">{selected || 'Select'}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selected === size;
          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`min-w-[2.5rem] h-10 px-3 rounded-sm border-2 text-sm font-medium transition-all ${
                isSelected
                  ? 'border-accent bg-accent text-accent-foreground shadow-gold'
                  : 'border-border bg-card text-foreground hover:border-accent/60'
              }`}
              aria-pressed={isSelected}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

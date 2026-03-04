interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onSelect(size)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg border-2 transition-colors ${
            selected === size
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface text-foreground hover:border-primary/50"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

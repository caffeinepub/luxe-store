/**
 * ColorVariantSelector.tsx — Color variant selector with visual selection state.
 */
interface ColorVariantSelectorProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

// Map color names to approximate CSS colors
const COLOR_MAP: Record<string, string> = {
  black:  '#1a1a1a',
  white:  '#f5f5f5',
  red:    '#dc2626',
  blue:   '#2563eb',
  green:  '#16a34a',
  yellow: '#ca8a04',
  pink:   '#db2777',
  purple: '#9333ea',
  orange: '#ea580c',
  brown:  '#92400e',
  gray:   '#6b7280',
  gold:   '#b8860b',
  silver: '#9ca3af',
  navy:   '#1e3a5f',
  beige:  '#d4b896',
};

export default function ColorVariantSelector({
  colors,
  selected,
  onSelect,
}: ColorVariantSelectorProps) {
  if (colors.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-2">
        Color: <span className="text-muted-foreground capitalize">{selected || 'Select'}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const cssColor = COLOR_MAP[color.toLowerCase()] ?? color;
          const isSelected = selected === color;

          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              title={color}
              className={`h-8 w-8 rounded-full border-2 transition-all ${
                isSelected
                  ? 'border-accent scale-110 shadow-gold'
                  : 'border-border hover:border-accent/50 hover:scale-105'
              }`}
              style={{ backgroundColor: cssColor }}
              aria-label={`Select color: ${color}`}
              aria-pressed={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
}

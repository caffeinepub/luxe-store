interface ColorVariantSelectorProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

const colorMap: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Black: '#1a1a1a',
  White: '#f5f5f5',
  Gold: '#d4af37',
  Silver: '#c0c0c0',
  Pink: '#ec4899',
  Purple: '#a855f7',
  Brown: '#92400e',
  Navy: '#1e3a5f',
  Beige: '#d4b896',
};

export default function ColorVariantSelector({ colors, selected, onSelect }: ColorVariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const hex = colorMap[color] || '#888';
        const isSelected = selected === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            title={color}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              isSelected ? 'border-primary scale-110 ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
            }`}
            style={{ backgroundColor: hex }}
          />
        );
      })}
    </div>
  );
}

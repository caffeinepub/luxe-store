/**
 * FilterPanel.tsx — Filter panel with category, subcategory, and price range controls.
 * categories and subCategories are optional (default to empty arrays).
 * Accepts an optional onClose callback for mobile sheet usage.
 */
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/urlParams';

export interface FilterState {
  category: string;
  subCategory: string;
  minPrice: number;
  maxPrice: number;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories?: string[];
  subCategories?: string[];
  maxPriceLimit?: number;
  onClose?: () => void;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  categories = [],
  subCategories = [],
  maxPriceLimit = 1000,
  onClose,
}: FilterPanelProps) {
  const handleCategoryToggle = (cat: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === cat ? '' : cat,
      subCategory: '',
    });
    onClose?.();
  };

  const handleSubCategoryToggle = (sub: string) => {
    onFiltersChange({
      ...filters,
      subCategory: filters.subCategory === sub ? '' : sub,
    });
  };

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({ ...filters, minPrice: values[0], maxPrice: values[1] });
  };

  const handleReset = () => {
    onFiltersChange({ category: '', subCategory: '', minPrice: 0, maxPrice: maxPriceLimit });
  };

  const hasActiveFilters =
    filters.category !== '' ||
    filters.subCategory !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxPriceLimit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs text-accent">
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Category
          </h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat}`}
                  checked={filters.category === cat}
                  onCheckedChange={() => handleCategoryToggle(cat)}
                />
                <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-categories */}
      {subCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Sub-Category
          </h4>
          <div className="space-y-2">
            {subCategories.map((sub) => (
              <div key={sub} className="flex items-center gap-2">
                <Checkbox
                  id={`sub-${sub}`}
                  checked={filters.subCategory === sub}
                  onCheckedChange={() => handleSubCategoryToggle(sub)}
                />
                <Label htmlFor={`sub-${sub}`} className="text-sm cursor-pointer">
                  {sub}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Price Range
        </h4>
        <Slider
          min={0}
          max={maxPriceLimit}
          step={10}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={handlePriceChange}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(filters.minPrice)}</span>
          <span>{formatPrice(filters.maxPrice)}</span>
        </div>
      </div>
    </div>
  );
}

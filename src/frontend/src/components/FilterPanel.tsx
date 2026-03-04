import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface FilterPanelProps {
  selectedCategory: string;
  selectedSubCategory: string;
  priceRange: [number, number];
  onCategoryChange: (cat: string) => void;
  onSubCategoryChange: (sub: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  categories?: string[];
  subCategories?: string[];
  onClose?: () => void;
}

export default function FilterPanel({
  selectedCategory,
  selectedSubCategory,
  priceRange,
  onCategoryChange,
  onSubCategoryChange,
  onPriceRangeChange,
  categories = [],
  subCategories = [],
  onClose,
}: FilterPanelProps) {
  return (
    <div className="bg-surface rounded-xl p-5 shadow-luxury space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Category</h4>
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="" id="cat-all" />
            <Label htmlFor="cat-all" className="text-sm cursor-pointer">
              All
            </Label>
          </div>
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <RadioGroupItem value={cat} id={`cat-${cat}`} />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Sub Category */}
      {subCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Sub Category
          </h4>
          <RadioGroup
            value={selectedSubCategory}
            onValueChange={onSubCategoryChange}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="" id="sub-all" />
              <Label htmlFor="sub-all" className="text-sm cursor-pointer">
                All
              </Label>
            </div>
            {subCategories.map((sub) => (
              <div key={sub} className="flex items-center gap-2">
                <RadioGroupItem value={sub} id={`sub-${sub}`} />
                <Label
                  htmlFor={`sub-${sub}`}
                  className="text-sm cursor-pointer"
                >
                  {sub}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Price Range: ${priceRange[0]} – ${priceRange[1]}
        </h4>
        <Slider
          min={0}
          max={10000}
          step={50}
          value={priceRange}
          onValueChange={(val) => onPriceRangeChange(val as [number, number])}
          className="mt-2"
        />
      </div>
    </div>
  );
}

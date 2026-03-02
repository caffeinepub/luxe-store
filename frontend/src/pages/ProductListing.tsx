import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SortDropdown, { type SortOption } from '../components/SortDropdown';

export default function ProductListing() {
  const search = useSearch({ from: '/products' });
  const initialCategory = (search as Record<string, string>).category ?? '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: products = [], isLoading } = useGetAllProducts();

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const subCategories = useMemo(() => {
    if (!selectedCategory) return [...new Set(products.map((p) => p.subCategory).filter(Boolean))];
    return [
      ...new Set(
        products
          .filter((p) => p.category === selectedCategory)
          .map((p) => p.subCategory)
          .filter(Boolean)
      ),
    ];
  }, [products, selectedCategory]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedSubCategory) result = result.filter((p) => p.subCategory === selectedSubCategory);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => Number(b.discountPercent) - Number(a.discountPercent));
        break;
      case 'newest':
      default:
        result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    }
    return result;
  }, [products, selectedCategory, selectedSubCategory, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {selectedCategory || 'All Products'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <SortDropdown value={sortBy} onChange={setSortBy} />
          <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-surface border-border w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-foreground">Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterPanel
                  selectedCategory={selectedCategory}
                  selectedSubCategory={selectedSubCategory}
                  priceRange={priceRange}
                  onCategoryChange={setSelectedCategory}
                  onSubCategoryChange={setSelectedSubCategory}
                  onPriceRangeChange={setPriceRange}
                  categories={categories}
                  subCategories={subCategories}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <FilterPanel
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            priceRange={priceRange}
            onCategoryChange={setSelectedCategory}
            onSubCategoryChange={setSelectedSubCategory}
            onPriceRangeChange={setPriceRange}
            categories={categories}
            subCategories={subCategories}
          />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

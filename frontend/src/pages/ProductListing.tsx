/**
 * ProductListing.tsx — Product catalog page with responsive filter panel
 * (desktop sidebar, mobile sheet), sort dropdown, and product grid.
 * Derives categories/subCategories from loaded products for FilterPanel.
 */
import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { SlidersHorizontal, X } from 'lucide-react';
import { useGetAllProducts } from '@/hooks/useQueries';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import FilterPanel, { type FilterState } from '@/components/FilterPanel';
import SortDropdown from '@/components/SortDropdown';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { Product } from '@/backend';

const MAX_PRICE = 5000;

function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    default:
      return sorted;
  }
}

export default function ProductListing() {
  const search = useSearch({ from: '/products' });
  const categoryParam = (search as Record<string, string>).category ?? '';

  const [filters, setFilters] = useState<FilterState>({
    category:    categoryParam,
    subCategory: '',
    minPrice:    0,
    maxPrice:    MAX_PRICE,
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { data: products, isLoading } = useGetAllProducts();

  // Derive unique categories and sub-categories from loaded products
  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p) => p.category))).filter(Boolean).sort();
  }, [products]);

  const subCategories = useMemo(() => {
    if (!products) return [];
    const filtered = filters.category
      ? products.filter((p) => p.category === filters.category)
      : products;
    return Array.from(new Set(filtered.map((p) => p.subCategory))).filter(Boolean).sort();
  }, [products, filters.category]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products;

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.subCategory) {
      result = result.filter((p) => p.subCategory === filters.subCategory);
    }
    if (filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice < MAX_PRICE) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    return sortProducts(result, sortBy);
  }, [products, filters, sortBy]);

  const activeFilterCount = [
    filters.category,
    filters.subCategory,
    filters.minPrice > 0 ? 'min' : '',
    filters.maxPrice < MAX_PRICE ? 'max' : '',
  ].filter(Boolean).length;

  const pageTitle = filters.category || 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-accent uppercase tracking-widest mb-1">Shop</p>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              subCategories={subCategories}
              maxPriceLimit={MAX_PRICE}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden border-border text-foreground h-9 gap-1.5 text-xs"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-card border-border w-72 p-4">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={(f) => {
                      setFilters(f);
                      setFilterSheetOpen(false);
                    }}
                    categories={categories}
                    subCategories={subCategories}
                    maxPriceLimit={MAX_PRICE}
                  />
                </SheetContent>
              </Sheet>

              <p className="text-muted-foreground text-sm">
                {isLoading ? '…' : `${filteredProducts.length} products`}
              </p>
            </div>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Active filter chips */}
          {(filters.category || filters.subCategory) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <span className="flex items-center gap-1 bg-accent/15 text-accent text-xs px-2.5 py-1 rounded-full border border-accent/30">
                  {filters.category}
                  <button
                    onClick={() => setFilters({ ...filters, category: '', subCategory: '' })}
                    aria-label="Remove category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.subCategory && (
                <span className="flex items-center gap-1 bg-accent/15 text-accent text-xs px-2.5 py-1 rounded-full border border-accent/30">
                  {filters.subCategory}
                  <button
                    onClick={() => setFilters({ ...filters, subCategory: '' })}
                    aria-label="Remove sub-category filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id.toString()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-serif text-xl mb-2">No products found</p>
              <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
              <Button
                onClick={() =>
                  setFilters({ category: '', subCategory: '', minPrice: 0, maxPrice: MAX_PRICE })
                }
                variant="outline"
                size="sm"
                className="mt-4 border-accent/40 text-accent hover:bg-accent/10"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

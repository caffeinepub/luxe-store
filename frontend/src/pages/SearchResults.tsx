/**
 * SearchResults.tsx — Search results page fetching products by keyword
 * with client-side category/price filters and sorting.
 * Derives categories/subCategories from results for FilterPanel.
 */
import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchProducts } from '@/hooks/useQueries';
import ProductCard, { ProductCardSkeleton } from '@/components/ProductCard';
import FilterPanel, { type FilterState } from '@/components/FilterPanel';
import SortDropdown from '@/components/SortDropdown';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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

export default function SearchResults() {
  const search = useSearch({ from: '/search' });
  const keyword = (search as Record<string, string>).q ?? '';

  const [filters, setFilters] = useState<FilterState>({
    category:    '',
    subCategory: '',
    minPrice:    0,
    maxPrice:    MAX_PRICE,
  });
  const [sortBy, setSortBy] = useState('popularity');
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { data: results, isLoading } = useSearchProducts(keyword);

  // Derive categories and sub-categories from search results
  const categories = useMemo(() => {
    if (!results) return [];
    return Array.from(new Set(results.map((p) => p.category))).filter(Boolean).sort();
  }, [results]);

  const subCategories = useMemo(() => {
    if (!results) return [];
    const filtered = filters.category
      ? results.filter((p) => p.category === filters.category)
      : results;
    return Array.from(new Set(filtered.map((p) => p.subCategory))).filter(Boolean).sort();
  }, [results, filters.category]);

  const filteredResults = useMemo(() => {
    if (!results) return [];
    let filtered = results;

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.subCategory) {
      filtered = filtered.filter((p) => p.subCategory === filters.subCategory);
    }
    if (filters.minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice < MAX_PRICE) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }

    return sortProducts(filtered, sortBy);
  }, [results, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-accent uppercase tracking-widest mb-1">Search</p>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold">
          {keyword ? `Results for "${keyword}"` : 'Search Products'}
        </h1>
        {!isLoading && keyword && (
          <p className="text-muted-foreground text-sm mt-1">
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {!keyword ? (
        <div className="text-center py-20">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-serif text-xl mb-2">Start searching</p>
          <p className="text-muted-foreground text-sm">
            Use the search bar above to find products
          </p>
        </div>
      ) : (
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
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden border-border text-foreground h-9 gap-1.5 text-xs"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
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

              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-serif text-xl mb-2">No results found</p>
                <p className="text-muted-foreground text-sm">
                  Try different keywords or adjust your filters
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

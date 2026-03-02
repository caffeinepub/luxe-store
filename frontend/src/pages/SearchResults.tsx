import { useState, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchProducts } from '../hooks/useQueries';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import SortDropdown, { type SortOption } from '../components/SortDropdown';
import { Button } from '@/components/ui/button';

export default function SearchResults() {
  const search = useSearch({ from: '/search' });
  const keyword = (search as Record<string, string>).q ?? '';

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data: results = [], isLoading } = useSearchProducts(keyword);

  const categories = useMemo(
    () => [...new Set(results.map((p) => p.category))].filter(Boolean).sort(),
    [results]
  );

  const subCategories = useMemo(() => {
    const filtered = selectedCategory
      ? results.filter((p) => p.category === selectedCategory)
      : results;
    return [...new Set(filtered.map((p) => p.subCategory))].filter(Boolean).sort();
  }, [results, selectedCategory]);

  const filteredResults = useMemo(() => {
    let filtered = [...results];
    if (selectedCategory) filtered = filtered.filter((p) => p.category === selectedCategory);
    if (selectedSubCategory) filtered = filtered.filter((p) => p.subCategory === selectedSubCategory);
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'discount': filtered.sort((a, b) => Number(b.discountPercent) - Number(a.discountPercent)); break;
      default: filtered.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    }
    return filtered;
  }, [results, selectedCategory, selectedSubCategory, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setPriceRange([0, 10000]);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
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
          <p className="font-display text-xl mb-2">Start searching</p>
          <p className="text-muted-foreground text-sm">Use the search bar above to find products</p>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <FilterPanel
              categories={categories}
              subCategories={subCategories}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategory}
              onSubCategoryChange={setSelectedSubCategory}
              onPriceRangeChange={setPriceRange}
            />
          </aside>

          {/* Mobile Filters */}
          {showFilters && (
            <div
              className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-72 bg-background p-4 shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <FilterPanel
                  categories={categories}
                  subCategories={subCategories}
                  selectedCategory={selectedCategory}
                  selectedSubCategory={selectedSubCategory}
                  priceRange={priceRange}
                  onCategoryChange={setSelectedCategory}
                  onSubCategoryChange={setSelectedSubCategory}
                  onPriceRangeChange={setPriceRange}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={14} className="mr-1" /> Filters
              </Button>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-display text-xl mb-2">No results found</p>
                <p className="text-muted-foreground text-sm">
                  Try different keywords or adjust your filters
                </p>
                <button onClick={resetFilters} className="mt-4 text-primary hover:underline text-sm">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

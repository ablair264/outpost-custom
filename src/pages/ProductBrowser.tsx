import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Filter, Grid, List, Sparkles, Loader2, X, SlidersHorizontal } from 'lucide-react';
import { getAllProducts, getFilterOptions, ProductFilters, ProductsResponse, FilterOptions } from '../lib/productBrowserApi';
import { Product } from '../lib/supabase';
import FilterSidebar from '../components/FilterSidebar';
import SmartSearchModal from '../components/SmartSearchModal';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

interface ProductGroup {
  style_code: string;
  style_name: string;
  brand: string;
  variants: Product[];
  colors: Array<{
    code: string;
    name: string;
    rgb: string;
    image: string;
  }>;
  size_range: string;
  price_range: { min: number; max: number };
}

const ProductBrowser: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    materials: [],
    categories: [],
    priceRange: { min: 0, max: 1000 },
    productTypes: [],
    sizes: [],
    colors: [],
    colorShades: [],
    brands: [],
    genders: [],
    ageGroups: [],
    accreditations: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageSize = 100;

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    loadFilterOptions();
  }, []);

  // Group products by style
  const groupProductsByStyle = useCallback((products: Product[]): ProductGroup[] => {
    const grouped = products.reduce((groups: Record<string, Product[]>, product) => {
      const styleCode = product.style_code || 'unknown';
      if (!groups[styleCode]) {
        groups[styleCode] = [];
      }
      groups[styleCode].push(product);
      return groups;
    }, {});

    const sortedStyleCodes = Object.keys(grouped).sort();

    return sortedStyleCodes.map(styleCode => {
      const variants = grouped[styleCode];
      const firstVariant = variants[0];

      const uniqueColors = variants.reduce((colors: Array<{code: string, name: string, rgb: string, image: string}>, variant) => {
        const existingColor = colors.find(c => c.code === variant.colour_code);
        if (!existingColor && variant.colour_code) {
          const colorName = (variant.colour_name || '').toLowerCase();
          let rgbValue = '#cccccc';

          if (colorName.includes('black')) rgbValue = '#000000';
          else if (colorName.includes('white')) rgbValue = '#ffffff';
          else if (colorName.includes('red')) rgbValue = '#dc3545';
          else if (colorName.includes('blue')) rgbValue = '#007bff';
          else if (colorName.includes('green')) rgbValue = '#28a745';
          else if (colorName.includes('yellow')) rgbValue = '#ffc107';
          else if (colorName.includes('grey') || colorName.includes('gray')) rgbValue = '#6c757d';
          else if (colorName.includes('navy')) rgbValue = '#001f3f';
          else if (colorName.includes('orange')) rgbValue = '#ff6b35';
          else if (colorName.includes('purple')) rgbValue = '#6f42c1';
          else if (colorName.includes('pink')) rgbValue = '#e83e8c';
          else if (colorName.includes('brown')) rgbValue = '#8b4513';
          else if (variant.rgb && variant.rgb !== 'Not available') {
            try {
              const rgbParts = variant.rgb.split('|')[0].trim();
              const rgbNumbers = rgbParts.match(/\d+/g);
              if (rgbNumbers && rgbNumbers.length >= 3) {
                const r = parseInt(rgbNumbers[0]);
                const g = parseInt(rgbNumbers[1]);
                const b = parseInt(rgbNumbers[2]);
                if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
                  rgbValue = `rgb(${r}, ${g}, ${b})`;
                }
              }
            } catch (e) {
              console.warn('Failed to parse RGB for', variant.colour_name, ':', variant.rgb);
            }
          }

          colors.push({
            code: variant.colour_code,
            name: variant.colour_name || variant.colour_code,
            rgb: rgbValue,
            image: variant.colour_image || variant.primary_product_image_url
          });
        }
        return colors;
      }, []);

      const prices = variants
        .map(v => parseFloat(v.single_price))
        .filter(p => !isNaN(p) && p > 0);

      const priceRange = prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices)
      } : { min: 0, max: 0 };

      return {
        style_code: styleCode,
        style_name: firstVariant.style_name,
        brand: firstVariant.brand,
        variants,
        colors: uniqueColors,
        size_range: firstVariant.size_range || '',
        price_range: priceRange
      };
    });
  }, []);

  const loadProducts = useCallback(async (filters: ProductFilters, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setAllProducts([]);
        setProductGroups([]);
      } else {
        setLoadingMore(true);
      }

      const pageToLoad = reset ? 1 : currentPage;
      const response: ProductsResponse = await getAllProducts(filters, pageToLoad, pageSize);

      setTotalCount(response.totalCount);
      setHasMoreProducts(response.hasNextPage);

      if (reset) {
        setAllProducts(response.products);
      } else {
        setAllProducts(prev => [...prev, ...response.products]);
        setCurrentPage(prev => prev + 1);
      }

    } catch (error) {
      console.error('Error loading products:', error);
      if (reset) {
        setAllProducts([]);
        setProductGroups([]);
        setTotalCount(0);
        setHasMoreProducts(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentPage, pageSize]);

  const loadMoreProducts = useCallback(async () => {
    if (!hasMoreProducts || loadingMore || loading) return;
    await loadProducts(currentFilters, false);
  }, [hasMoreProducts, loadingMore, loading, currentFilters, loadProducts]);

  useEffect(() => {
    loadProducts({});
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const grouped = groupProductsByStyle(allProducts);
      setProductGroups(grouped);
    }
  }, [allProducts, groupProductsByStyle]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreProducts && !loading && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMoreProducts, loading, loadingMore, loadMoreProducts]);

  const handleFiltersChange = (filters: ProductFilters) => {
    setCurrentFilters(filters);
    loadProducts(filters, true);
    setShowMobileFilters(false);
  };

  const handleSmartSearch = async (query: string, filters: ProductFilters) => {
    const searchFilters = {
      ...filters,
      searchQuery: query
    };
    setCurrentFilters(searchFilters);
    await loadProducts(searchFilters, true);

    setTimeout(() => {
      if (totalCount === 0) {
        setCurrentFilters({ searchQuery: query });
        loadProducts({ searchQuery: query }, true);
      }
    }, 1000);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (key === 'searchQuery' && value) count++;
      else if (key.includes('price') && value !== undefined) count++;
      else if (Array.isArray(value) && value.length > 0) count += value.length;
    });
    return count;
  };

  const clearAllFilters = () => {
    setCurrentFilters({});
    loadProducts({}, true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight mb-2">
                Products
              </h1>
              <p className="text-[#888] text-sm">
                {loading ? (
                  'Loading products...'
                ) : (
                  <>
                    Showing <span className="text-[#78BE20] font-semibold">{productGroups.length.toLocaleString()}</span> of{' '}
                    <span className="text-white font-medium">{totalCount.toLocaleString()}</span> products
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#141414] border border-white/[0.08] rounded-xl text-white text-sm font-medium hover:border-white/[0.15] transition-colors"
              >
                <SlidersHorizontal size={18} />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-[#78BE20] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              {/* Smart Search */}
              <button
                onClick={() => setIsSmartSearchOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#78BE20] to-[#6aa01c] text-black rounded-xl font-semibold text-sm shadow-lg shadow-[#78BE20]/20 hover:shadow-xl hover:shadow-[#78BE20]/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Sparkles size={18} />
                <span className="hidden sm:inline">Smart Search</span>
              </button>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-[#78BE20] text-black'
                      : 'text-[#666] hover:text-white hover:bg-white/[0.03]'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-[#78BE20] text-black'
                      : 'text-[#666] hover:text-white hover:bg-white/[0.03]'
                  }`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Search Display */}
          {currentFilters.searchQuery && (
            <div className="mt-4 bg-[#141414] border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#888] text-sm">Results for:</span>
                  <span className="text-[#78BE20] font-semibold">"{currentFilters.searchQuery}"</span>
                </div>
                <button
                  onClick={() => handleFiltersChange({ ...currentFilters, searchQuery: undefined })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#888] hover:text-white border border-white/[0.08] hover:border-white/[0.15] rounded-lg transition-colors"
                >
                  <X size={14} />
                  Clear
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Layout */}
        <div className="flex gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                filterOptions={filterOptions}
                currentFilters={currentFilters}
                onFiltersChange={handleFiltersChange}
                totalResults={totalCount}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Loading State */}
            {loading && (
              <div className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Products */}
            {!loading && (
              <>
                <div className={`grid gap-5 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}>
                  {productGroups.map((group) => (
                    <ProductCard
                      key={group.style_code}
                      productGroup={group}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Loading More */}
                {loadingMore && (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-8 h-8 text-[#78BE20] animate-spin" />
                    <p className="text-[#888] text-sm font-medium">Loading more products...</p>
                  </div>
                )}

                {/* Infinite Scroll Trigger */}
                <div
                  ref={loadMoreRef}
                  className="h-5"
                  style={{ height: hasMoreProducts ? '20px' : '0px' }}
                />

                {/* Empty State */}
                {productGroups.length === 0 && (
                  <div className="flex items-center justify-center min-h-[400px] text-center">
                    <div className="max-w-md">
                      <div className="w-16 h-16 bg-[#141414] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Filter className="w-8 h-8 text-[#555]" />
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-2">No products found</h3>
                      <p className="text-[#888] mb-6">Try adjusting your filters or search terms</p>
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-3 bg-[#78BE20] text-black rounded-xl font-semibold hover:bg-[#8ed42e] transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </div>
                )}

                {/* End of Results */}
                {!hasMoreProducts && productGroups.length > 0 && (
                  <div className="text-center py-12 mt-8 border-t border-white/[0.06]">
                    <p className="text-[#888] font-medium">
                      You've seen all {productGroups.length} products
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            
            {/* Drawer */}
            <div className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/[0.08]">
                <h2 className="text-lg font-bold text-white">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] text-[#888] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  filterOptions={filterOptions}
                  currentFilters={currentFilters}
                  onFiltersChange={handleFiltersChange}
                  totalResults={totalCount}
                />
              </div>
            </div>
          </div>
        )}

        {/* Smart Search Modal */}
        <SmartSearchModal
          isOpen={isSmartSearchOpen}
          onClose={() => setIsSmartSearchOpen(false)}
          onApplySearch={handleSmartSearch}
        />
      </div>
    </div>
  );
};

export default ProductBrowser;
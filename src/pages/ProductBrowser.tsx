import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Filter, Grid, List, Sparkles, Loader2 } from 'lucide-react';
import { getAllProducts, getFilterOptions, ProductFilters, ProductsResponse, FilterOptions } from '../lib/productBrowserApi';
import { Product } from '../lib/supabase';
import FilterSidebar from '../components/FilterSidebar';
import SmartSearchModal from '../components/SmartSearchModal';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import './ProductBrowser.css';

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
  
  // Intersection Observer ref for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const pageSize = 100; // Increased to ensure viewport is filled initially

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

  // Group products by style (memoized to prevent unnecessary re-renders)
  const groupProductsByStyle = useCallback((products: Product[]): ProductGroup[] => {
    const grouped = products.reduce((groups: Record<string, Product[]>, product) => {
      const styleCode = product.style_code || 'unknown';
      if (!groups[styleCode]) {
        groups[styleCode] = [];
      }
      groups[styleCode].push(product);
      return groups;
    }, {});

    // Sort the style codes to ensure consistent ordering
    const sortedStyleCodes = Object.keys(grouped).sort();
    
    return sortedStyleCodes.map(styleCode => {
      const variants = grouped[styleCode];
      const firstVariant = variants[0];
      
      // Get unique colors with improved color mapping
      const uniqueColors = variants.reduce((colors: Array<{code: string, name: string, rgb: string, image: string}>, variant) => {
        const existingColor = colors.find(c => c.code === variant.colour_code);
        if (!existingColor && variant.colour_code) {
          // Use improved color mapping logic
          const colorName = (variant.colour_name || '').toLowerCase();
          let rgbValue = '#cccccc'; // Default fallback
          
          // First try to use color name mapping for better accuracy
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
            // Fall back to database RGB if available and not obviously wrong
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

      // Calculate price range
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

  // Load initial products or reset with new filters
  const loadProducts = useCallback(async (filters: ProductFilters, reset: boolean = true) => {
    try {
      console.log('🔄 Loading products with filters:', JSON.stringify(filters, null, 2));
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
      
      console.log('📦 Product API Response:', {
        totalCount: response.totalCount,
        productsLength: response.products.length,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        firstProduct: response.products[0] || 'No products'
      });
      
      setTotalCount(response.totalCount);
      setHasMoreProducts(response.hasNextPage);
      
      // Update products list
      if (reset) {
        setAllProducts(response.products);
      } else {
        setAllProducts(prev => [...prev, ...response.products]);
        setCurrentPage(prev => prev + 1);
      }
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
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

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(async () => {
    if (!hasMoreProducts || loadingMore || loading) return;
    await loadProducts(currentFilters, false);
  }, [hasMoreProducts, loadingMore, loading, currentFilters, loadProducts]);

  // Initial load
  useEffect(() => {
    loadProducts({});
  }, []);

  // Update product groups when allProducts changes
  useEffect(() => {
    if (allProducts.length > 0) {
      const grouped = groupProductsByStyle(allProducts);
      console.log('📊 Product groups created:', grouped.length, 'groups from', allProducts.length, 'products');
      setProductGroups(grouped);
      
      // Auto-load more if we don't have enough products to fill viewport
      setTimeout(() => {
        if (grouped.length < 12 && hasMoreProducts && !loadingMore && !loading) {
          console.log('🔄 Auto-loading more products to fill viewport...');
          loadMoreProducts();
        }
      }, 100);
    }
  }, [allProducts, groupProductsByStyle, hasMoreProducts, loadingMore, loading, loadMoreProducts]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMoreProducts && !loadingMore && !loading) {
          console.log('🔄 Loading more products...');
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before reaching the bottom
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMoreProducts, loadingMore, loading, loadMoreProducts]);

  const handleFiltersChange = (filters: ProductFilters) => {
    setCurrentFilters(filters);
    loadProducts(filters, true); // Reset to page 1 with new filters
  };

  const handleSmartSearch = async (query: string, filters: ProductFilters) => {
    const searchFilters = {
      ...filters,
      searchQuery: query
    };
    console.log('Smart Search Filters Applied:', JSON.stringify(searchFilters, null, 2));
    setCurrentFilters(searchFilters);
    await loadProducts(searchFilters, true);
    
    // If no results with AI filters, try with just the search query
    setTimeout(() => {
      if (totalCount === 0) {
        console.log('No results with AI filters, trying text search only...');
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
    loadProducts({}, true); // true = reset to first page
  };

  return (
    <div className="product-browser">
      <div className="browser-layout">
        {/* Header */}
        <div className="browser-header">
          <div className="container">
            <div className="header-content">
              <div className="title-section">
                <h1>Discover Products</h1>
                <p className="subtitle">
                  {loading ? 'Loading...' : `${productGroups.length.toLocaleString()} products${hasMoreProducts ? ' (loading more...)' : ' available'}`}
                </p>
              </div>
              
              <div className="header-controls">
                <button 
                  className="smart-search-btn"
                  onClick={() => setIsSmartSearchOpen(true)}
                >
                  <Sparkles size={20} />
                  <span>Smart Search</span>
                </button>
                
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {currentFilters.searchQuery && (
              <div className="active-search-bar">
                <div className="search-info">
                  <span className="search-label">Search results for:</span>
                  <span className="search-query">"{currentFilters.searchQuery}"</span>
                  <button 
                    className="clear-search-btn" 
                    onClick={() => handleFiltersChange({ ...currentFilters, searchQuery: undefined })}
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="browser-content">
          <div className="container">
            <div className="content-layout">
              
              {/* Filter Sidebar */}
              <FilterSidebar
                filterOptions={filterOptions}
                currentFilters={currentFilters}
                onFiltersChange={handleFiltersChange}
                totalResults={totalCount}
              />

              {/* Products Area */}
              <div className="products-area">
                {/* Loading State */}
                {loading && (
                  <div className="products-loading">
                    <div className={`products-skeleton ${viewMode}`}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className={`products-container ${viewMode}`}>
                  {productGroups.map((group) => (
                    <ProductCard
                      key={group.style_code}
                      productGroup={group}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div className="loading-more">
                    <Loader2 className="loading-spinner" size={32} />
                    <p>Loading more products...</p>
                  </div>
                )}

                {/* Infinite Scroll Trigger */}
                <div ref={loadMoreRef} className="load-more-trigger" style={{ height: hasMoreProducts ? '20px' : '0px' }}>
                  {/* This invisible element triggers loading when it comes into view */}
                </div>

                {/* Empty State */}
                {productGroups.length === 0 && !loading && (
                  <div className="empty-state">
                    <div className="empty-content">
                      <Filter size={48} className="empty-icon" />
                      <h3>No products found</h3>
                      <p>Try adjusting your filters or search terms</p>
                      <button className="reset-filters-btn" onClick={clearAllFilters}>
                        Clear all filters
                      </button>
                    </div>
                  </div>
                )}

                {/* End of Results */}
                {!hasMoreProducts && productGroups.length > 0 && (
                  <div className="end-of-results">
                    <p>You've seen all {productGroups.length} products!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Home, Search, X } from 'lucide-react';
import PrintingFontStyles from '../components/printing/PrintingFontStyles';
import ProductCard from '../components/printing/ProductCard';
import ViewToggle, { ViewMode } from '../components/printing/ViewToggle';
import FilterBar from '../components/printing/FilterBar';
import { printingColors, printingCategories } from '../lib/printing-theme';
import {
  getProductsByCategory,
  getCategoryBySlug,
  filterProductsByFinish,
  allProducts,
  PrintingProduct,
} from '../lib/printing-products';

const PrintingCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [view, setView] = useState<ViewMode>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const isAllProducts = category === 'all';
  const categoryInfo = !isAllProducts ? getCategoryBySlug(category || '') : null;

  // Get products based on category and filters
  const filteredProducts = useMemo(() => {
    let products: PrintingProduct[];

    if (isAllProducts) {
      // For "all" page, start with all products
      products = allProducts;

      // Apply category filter if any selected
      if (selectedCategories.length > 0) {
        products = products.filter(product => {
          return selectedCategories.some(catSlug => {
            const cat = printingCategories.find(c => c.slug === catSlug);
            if (!cat) return false;
            return product.categories.some(pc => (cat.jsonCategories as readonly string[]).includes(pc));
          });
        });
      }
    } else {
      // For specific category page
      products = getProductsByCategory(category || '');
    }

    // Apply finish filter
    if (selectedFinishes.length > 0) {
      products = filterProductsByFinish(products, selectedFinishes);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.short_description.toLowerCase().includes(query)
      );
    }

    return products;
  }, [category, isAllProducts, selectedCategories, selectedFinishes, searchQuery]);

  // Page title and description
  const pageTitle = isAllProducts
    ? 'All Products'
    : categoryInfo?.title || 'Products';

  const pageDescription = isAllProducts
    ? 'Browse our complete range of printing products'
    : categoryInfo?.description || '';

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen bg-[#f8f8f8]">
        {/* Compact Header Section */}
        <section
          className="relative py-8 md:py-10 px-6 md:px-12 lg:px-24"
          style={{ backgroundColor: printingColors.dark }}
        >
          {/* Texture overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/printing" className="hover:text-white transition-colors">
                Printing
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{pageTitle}</span>
            </nav>

            {/* Title row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="hearns-font text-3xl md:text-4xl lg:text-5xl text-white">
                  {pageTitle}
                </h1>
                {pageDescription && (
                  <p className="neuzeit-light-font text-base text-white/70 mt-1">
                    {pageDescription}
                  </p>
                )}
              </div>

              {/* Search box */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills Navigation */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 mr-2">Categories:</span>
              <Link
                to="/printing/all"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isAllProducts
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={isAllProducts ? { backgroundColor: printingColors.accent } : {}}
              >
                All
              </Link>
              {printingCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/printing/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat.slug
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={category === cat.slug ? { backgroundColor: printingColors.accent } : {}}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Toolbar Section */}
        <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Filters (only on all products page) */}
              {isAllProducts ? (
                <FilterBar
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                  selectedFinishes={selectedFinishes}
                  onFinishChange={setSelectedFinishes}
                  productCount={filteredProducts.length}
                />
              ) : (
                <div className="text-sm text-gray-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>
              )}

              {/* View toggle */}
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 md:py-12 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <p className="text-gray-500 text-lg mb-4">
                    {searchQuery
                      ? `No products found for "${searchQuery}"`
                      : 'No products match your current filters.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedFinishes([]);
                      setSearchQuery('');
                    }}
                    className="text-sm font-medium px-4 py-2 rounded-lg"
                    style={{
                      color: printingColors.accent,
                      backgroundColor: `${printingColors.accent}10`,
                    }}
                  >
                    Clear all filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.slug}
                      product={product}
                      categorySlug={category || 'all'}
                      view={view}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Back to printing link */}
        <section className="py-8 px-6 md:px-12 lg:px-24" style={{ backgroundColor: printingColors.neutral }}>
          <div className="max-w-7xl mx-auto text-center">
            <Link
              to="/printing"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: printingColors.dark }}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Printing
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrintingCategoryPage;

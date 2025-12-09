import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import {
  ChevronRight,
  Home,
  Search,
  X,
  Filter,
  ChevronDown,
  Check,
  ArrowRight,
} from 'lucide-react';
import PrintingFontStyles from './PrintingFontStyles';
import ProductDetailModal from './ProductDetailModal';
import { printingColors } from '../../lib/printing-theme';
import {
  allProducts,
  filterProductsByFinish,
  filterProductsByType,
  filterProductsByUseCases,
  extractUseCases,
  productTypes,
  useCaseTags,
  PrintingProduct,
  cleanDescription,
} from '../../lib/printing-products';

// Finish options
const finishOptions = [
  { id: 'matt-lamination', label: 'Matt Lamination' },
  { id: 'gloss-lamination', label: 'Gloss Lamination' },
  { id: 'uncoated', label: 'Uncoated' },
  { id: 'coated-silk', label: 'Silk' },
];

interface PrintingBrowserProps {
  initialProductSlug?: string;
}

const PrintingBrowser: React.FC<PrintingBrowserProps> = ({ initialProductSlug }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(initialProductSlug || null);
  const [modalProduct, setModalProduct] = useState<PrintingProduct | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Collapsible sections state
  const [sectionsOpen, setSectionsOpen] = useState({
    type: true,
    useCase: false,
    finish: true,
  });

  // Read initial filter from URL params on mount
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && productTypes.some(t => t.id === typeParam)) {
      setSelectedType(typeParam);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL when type changes
  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    if (typeId === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', typeId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Callback ref to scroll expanded card into view when it mounts
  const scrollToExpandedCard = useCallback((node: HTMLDivElement | null) => {
    if (node && expandedProduct) {
      // Wait for layout animation to complete, then scroll
      setTimeout(() => {
        // Use scrollIntoView for reliable scrolling
        node.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 350);
    }
  }, [expandedProduct]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by product type
    products = filterProductsByType(products, selectedType);

    // Filter by use cases
    if (selectedUseCases.length > 0) {
      products = filterProductsByUseCases(products, selectedUseCases);
    }

    // Filter by finish
    if (selectedFinishes.length > 0) {
      products = filterProductsByFinish(products, selectedFinishes);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.short_description.toLowerCase().includes(query)
      );
    }

    return products;
  }, [selectedType, selectedUseCases, selectedFinishes, searchQuery]);

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFinish = (id: string) => {
    setSelectedFinishes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedType('all');
    setSelectedUseCases([]);
    setSelectedFinishes([]);
    setSearchQuery('');
    searchParams.delete('type');
    setSearchParams(searchParams, { replace: true });
  };

  const hasActiveFilters = selectedType !== 'all' || selectedUseCases.length > 0 || selectedFinishes.length > 0 || searchQuery.trim();

  const handleProductClick = (slug: string) => {
    // If clicking the same card, collapse it
    if (expandedProduct === slug) {
      setExpandedProduct(null);
    } else {
      // If clicking a different card (or no card is expanded), expand it
      setExpandedProduct(slug);
    }
  };

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen" style={{ backgroundColor: `${printingColors.dark}05` }}>
        {/* Header */}
        <header
          className="relative py-6 md:py-8 px-6 md:px-8 lg:px-12"
          style={{ backgroundColor: printingColors.dark }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'url(/ConcreteTexture.webp)',
              backgroundSize: 'cover',
              mixBlendMode: 'overlay',
            }}
          />

          <div className="max-w-[1600px] mx-auto relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/printing" className="hover:text-white transition-colors">
                Printing
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">All Products</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="hearns-font text-3xl md:text-4xl text-white mb-1">
                  PRINT PRODUCTS
                </h1>
                <p className="neuzeit-light-font text-white/70">
                  Browse our complete range
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-[10px] bg-white/10 border border-white/20 text-white placeholder-white/40 neuzeit-font focus:outline-none focus:border-white/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div
                className="sticky top-8 rounded-[15px] overflow-hidden"
                style={{ backgroundColor: printingColors.dark }}
              >
                <div className="p-5 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="neuzeit-font font-semibold text-white">Filters</h2>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs font-medium px-2 py-1 rounded-md"
                        style={{ color: printingColors.accent, backgroundColor: `${printingColors.accent}20` }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Type */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection('type')}
                    className="w-full p-5 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="neuzeit-font font-medium text-sm uppercase tracking-wide">Product Type</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.type ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sectionsOpen.type && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-1">
                          {productTypes.map(type => (
                            <button
                              key={type.id}
                              onClick={() => handleTypeChange(type.id)}
                              className={`w-full text-left px-3 py-2.5 rounded-[8px] neuzeit-font text-sm transition-all ${
                                selectedType === type.id
                                  ? 'text-white'
                                  : 'text-white/70 hover:text-white hover:bg-white/5'
                              }`}
                              style={selectedType === type.id ? { backgroundColor: printingColors.accent } : {}}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Use Cases */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection('useCase')}
                    className="w-full p-5 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="neuzeit-font font-medium text-sm uppercase tracking-wide">Use Case</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.useCase ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sectionsOpen.useCase && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-1">
                          {useCaseTags.map(tag => (
                            <button
                              key={tag.id}
                              onClick={() =>
                                setSelectedUseCases(prev =>
                                  prev.includes(tag.id)
                                    ? prev.filter(x => x !== tag.id)
                                    : [...prev, tag.id]
                                )
                              }
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  selectedUseCases.includes(tag.id)
                                    ? 'border-transparent'
                                    : 'border-white/30'
                                }`}
                                style={selectedUseCases.includes(tag.id) ? { backgroundColor: printingColors.accent } : {}}
                              >
                                {selectedUseCases.includes(tag.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              {tag.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Finish */}
                <div>
                  <button
                    onClick={() => toggleSection('finish')}
                    className="w-full p-5 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="neuzeit-font font-medium text-sm uppercase tracking-wide">Finish</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.finish ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {sectionsOpen.finish && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-1">
                          {finishOptions.map(finish => (
                            <button
                              key={finish.id}
                              onClick={() => toggleFinish(finish.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                  selectedFinishes.includes(finish.id)
                                    ? 'border-transparent'
                                    : 'border-white/30'
                                }`}
                                style={selectedFinishes.includes(finish.id) ? { backgroundColor: printingColors.accent } : {}}
                              >
                                {selectedFinishes.includes(finish.id) && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              {finish.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg neuzeit-font font-medium text-white"
              style={{ backgroundColor: printingColors.accent }}
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/60 z-50"
                  />
                  {/* Drawer */}
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 overflow-y-auto"
                    style={{ backgroundColor: printingColors.dark }}
                  >
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                      <h2 className="neuzeit-font font-semibold text-white text-lg">Filters</h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {hasActiveFilters && (
                      <div className="p-5 border-b border-white/10">
                        <button
                          onClick={() => {
                            clearAllFilters();
                            setSidebarOpen(false);
                          }}
                          className="w-full text-center text-sm font-medium py-2.5 rounded-[10px] transition-all"
                          style={{ color: printingColors.accent, backgroundColor: `${printingColors.accent}20` }}
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}

                    {/* Product Type */}
                    <div className="border-b border-white/10">
                      <button
                        onClick={() => toggleSection('type')}
                        className="w-full p-5 flex items-center justify-between text-white"
                      >
                        <span className="neuzeit-font font-medium text-sm uppercase tracking-wide">Product Type</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.type ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {sectionsOpen.type && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-1">
                              {productTypes.map(type => (
                                <button
                                  key={type.id}
                                  onClick={() => handleTypeChange(type.id)}
                                  className={`w-full text-left px-3 py-2.5 rounded-[8px] neuzeit-font text-sm transition-all ${
                                    selectedType === type.id
                                      ? 'text-white'
                                      : 'text-white/70 hover:text-white hover:bg-white/5'
                                  }`}
                                  style={selectedType === type.id ? { backgroundColor: printingColors.accent } : {}}
                                >
                                  {type.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Use Cases */}
                    <div className="border-b border-white/10">
                      <button
                        onClick={() => toggleSection('useCase')}
                        className="w-full p-5 flex items-center justify-between text-white"
                      >
                        <span className="neuzeit-font font-medium text-sm uppercase tracking-wide">Use Case</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.useCase ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {sectionsOpen.useCase && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-1">
                              {useCaseTags.map(tag => (
                                <button
                                  key={tag.id}
                                  onClick={() => {
                                    setSelectedUseCases(prev =>
                                      prev.includes(tag.id)
                                        ? prev.filter(x => x !== tag.id)
                                        : [...prev, tag.id]
                                    );
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                      selectedUseCases.includes(tag.id)
                                        ? 'border-transparent'
                                        : 'border-white/30'
                                    }`}
                                    style={selectedUseCases.includes(tag.id) ? { backgroundColor: printingColors.accent } : {}}
                                  >
                                    {selectedUseCases.includes(tag.id) && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  {tag.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Finish */}
                    <div>
                      <button
                        onClick={() => toggleSection('finish')}
                        className="w-full p-5 flex items-center justify-between text-white"
                      >
                        <span className="neuzeit-font font-medium text-sm uppercase tracking-wide">Finish</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.finish ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {sectionsOpen.finish && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-1">
                              {finishOptions.map(finish => (
                                <button
                                  key={finish.id}
                                  onClick={() => toggleFinish(finish.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                                >
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                      selectedFinishes.includes(finish.id)
                                        ? 'border-transparent'
                                        : 'border-white/30'
                                    }`}
                                    style={selectedFinishes.includes(finish.id) ? { backgroundColor: printingColors.accent } : {}}
                                  >
                                    {selectedFinishes.includes(finish.id) && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  {finish.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Apply button */}
                    <div className="p-5 mt-auto">
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="w-full py-3 rounded-[10px] neuzeit-font font-semibold text-white transition-all"
                        style={{ backgroundColor: printingColors.accent }}
                      >
                        Show {filteredProducts.length} Products
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="neuzeit-font text-sm" style={{ color: printingColors.dark }}>
                  <span className="font-semibold">{filteredProducts.length}</span> products
                </p>
              </div>

              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20 rounded-[15px]"
                    style={{ backgroundColor: printingColors.dark }}
                  >
                    <p className="text-white/70 text-lg mb-4 neuzeit-light-font">
                      No products match your filters
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="neuzeit-font text-sm font-medium px-5 py-2.5 rounded-[10px]"
                      style={{ color: printingColors.accent, backgroundColor: `${printingColors.accent}20` }}
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                ) : (
                  <LayoutGroup>
                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((product, index) => (
                        <ProductGridCard
                          key={product.slug}
                          product={product}
                          index={index}
                          isExpanded={expandedProduct === product.slug}
                          hasExpandedCard={expandedProduct !== null}
                          onExpand={() => handleProductClick(product.slug)}
                          onGetStarted={() => setModalProduct(product)}
                          onClose={() => setExpandedProduct(null)}
                          expandedRef={expandedProduct === product.slug ? scrollToExpandedCard : undefined}
                        />
                      ))}
                    </motion.div>
                  </LayoutGroup>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>

        {/* Product Detail Modal */}
        {modalProduct && (
          <ProductDetailModal
            product={modalProduct}
            isOpen={!!modalProduct}
            onClose={() => setModalProduct(null)}
          />
        )}
      </div>
    </>
  );
};

// Product Card Component with Inline Expansion
interface ProductGridCardProps {
  product: PrintingProduct;
  index: number;
  isExpanded: boolean;
  hasExpandedCard: boolean;
  onExpand: () => void;
  onGetStarted: () => void;
  onClose: () => void;
  expandedRef?: (node: HTMLDivElement | null) => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({
  product,
  index,
  isExpanded,
  hasExpandedCard,
  onExpand,
  onGetStarted,
  onClose,
  expandedRef,
}) => {
  const imageUrl = product.images[0] || '/printing/placeholder.jpg';
  const useCases = extractUseCases(product);

  // Parse specs from description
  const parseSpecs = () => {
    const desc = product.full_description;
    const specs: { label: string; items: string[] }[] = [];

    const sizes: string[] = [];
    if (desc.includes('85mm x 55mm') || desc.includes('85 x 55')) sizes.push('85 x 55mm');
    if (desc.includes('A4')) sizes.push('A4');
    if (desc.includes('A5')) sizes.push('A5');
    if (desc.includes('A6')) sizes.push('A6');
    if (desc.includes('DL')) sizes.push('DL');
    if (desc.includes('A3')) sizes.push('A3');
    if (sizes.length > 0) specs.push({ label: 'Sizes', items: sizes.slice(0, 3) });

    const paper: string[] = [];
    if (desc.includes('350gsm')) paper.push('350gsm');
    if (desc.includes('400gsm')) paper.push('400gsm');
    if (desc.toLowerCase().includes('uncoated')) paper.push('Uncoated');
    if (paper.length > 0) specs.push({ label: 'Paper', items: paper });

    const finish: string[] = [];
    if (desc.toLowerCase().includes('matt')) finish.push('Matt');
    if (desc.toLowerCase().includes('gloss')) finish.push('Gloss');
    if (desc.toLowerCase().includes('silk')) finish.push('Silk');
    if (finish.length > 0) specs.push({ label: 'Finish', items: finish });

    return specs;
  };

  const specs = parseSpecs();

  // Determine if this card should be dimmed (another card is expanded)
  const shouldDim = hasExpandedCard && !isExpanded;

  return (
    <motion.div
      ref={isExpanded ? expandedRef : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.02, 0.2),
        layout: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }
      }}
      layout
      className={`
        ${isExpanded ? 'col-span-2 md:col-span-2 lg:col-span-2 row-span-2 z-10' : ''}
        transition-[opacity,transform] duration-150 ease-out
        ${shouldDim ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}
      `}
      style={{ willChange: isExpanded || shouldDim ? 'transform, opacity' : 'auto' }}
    >
      <motion.div
        layout
        transition={{ layout: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
        className={`group w-full h-full rounded-[10px] overflow-hidden transition-shadow duration-150 ${
          isExpanded ? 'shadow-2xl' : 'hover:shadow-lg'
        }`}
        style={{ backgroundColor: printingColors.dark }}
      >
        {!isExpanded ? (
          /* Collapsed Card */
          <button
            onClick={onExpand}
            className="w-full h-full text-left"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h3 className="hearns-font text-sm md:text-base text-white mb-0.5 group-hover:text-[#64a70b] transition-colors line-clamp-1">
                {product.title}
              </h3>
              <p className="neuzeit-light-font text-xs text-white/50 line-clamp-1">
                {cleanDescription(product.short_description).split(' ').slice(0, 8).join(' ')}...
              </p>
            </div>
          </button>
        ) : (
          /* Expanded Card - click anywhere to close except buttons */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-full flex flex-col cursor-pointer"
            onClick={onClose}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Image */}
            <div className="aspect-[16/9] overflow-hidden flex-shrink-0">
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="hearns-font text-lg md:text-xl text-white mb-2">
                {product.title}
              </h3>

              {/* Perfect for */}
              <div className="mb-3">
                <p className="smilecake-font text-sm mb-2" style={{ color: printingColors.accent }}>
                  Perfect for...
                </p>
                <div className="flex flex-wrap gap-2">
                  {useCases.slice(0, 3).map((useCase, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <Check className="w-3 h-3" style={{ color: printingColors.accent }} />
                      <span className="neuzeit-font text-xs text-white/70">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {specs.map((spec, i) => (
                    <div key={i}>
                      <p className="neuzeit-font text-[10px] uppercase tracking-wide text-white/40 mb-0.5">
                        {spec.label}
                      </p>
                      <p className="neuzeit-font text-xs text-white">{spec.items[0]}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
                className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] neuzeit-font font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ backgroundColor: printingColors.accent }}
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PrintingBrowser;

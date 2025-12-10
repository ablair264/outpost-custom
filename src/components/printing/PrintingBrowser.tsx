import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  Home,
  Search,
  X,
  Filter,
  ChevronDown,
  Check,
} from 'lucide-react';
import PrintingFontStyles from './PrintingFontStyles';
import ProductDetailModal from './ProductDetailModal';
import { printingColors } from '../../lib/printing-theme';
import {
  allProducts,
  filterProductsByFinish,
  filterProductsByType,
  filterProductsByUseCases,
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
  const [modalProduct, setModalProduct] = useState<PrintingProduct | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Collapsible sections state
  const [sectionsOpen, setSectionsOpen] = useState({
    type: true,
    useCase: false,
    finish: true,
  });

  // Open modal for initial product slug if provided
  useEffect(() => {
    if (initialProductSlug) {
      const product = allProducts.find(p => p.slug === initialProductSlug);
      if (product) {
        setModalProduct(product);
      }
    }
  }, [initialProductSlug]);

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

  return (
    <>
      <PrintingFontStyles />

      <div className="min-h-screen relative" style={{ backgroundColor: printingColors.dark }}>
        {/* Background textures - matching ClothingBrowser */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'url(/BlackTextureBackground.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/ConcreteTexture.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Header */}
        <header
          className="relative z-10 py-6 md:py-8 px-6 md:px-8 lg:px-12 border-b border-white/10"
        >

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
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div
                className="sticky top-8 rounded-[15px] overflow-hidden flex flex-col"
                style={{ backgroundColor: printingColors.darkLight, maxHeight: 'calc(100vh - 120px)' }}
              >
                <div className="p-4 border-b border-white/10 flex-shrink-0">
                  <h2 className="font-semibold text-white neuzeit-font">Filters</h2>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-white/50 uppercase tracking-wide neuzeit-font">Active Filters</p>
                      <button
                        onClick={clearAllFilters}
                        className="text-xs font-medium px-2 py-1 rounded-md transition-all hover:opacity-80"
                        style={{ color: printingColors.accent, backgroundColor: `${printingColors.accent}20` }}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedType !== 'all' && (
                        <button
                          onClick={() => handleTypeChange('all')}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 neuzeit-font"
                          style={{ backgroundColor: printingColors.accent, color: 'white' }}
                        >
                          {productTypes.find(t => t.id === selectedType)?.label}
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {selectedUseCases.map(useCase => (
                        <button
                          key={`filter-usecase-${useCase}`}
                          onClick={() => setSelectedUseCases(prev => prev.filter(x => x !== useCase))}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white transition-all hover:opacity-80 neuzeit-font"
                        >
                          {useCaseTags.find(t => t.id === useCase)?.label}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {selectedFinishes.map(finish => (
                        <button
                          key={`filter-finish-${finish}`}
                          onClick={() => toggleFinish(finish)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white transition-all hover:opacity-80 neuzeit-font"
                        >
                          {finishOptions.find(f => f.id === finish)?.label}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scrollable filter content */}
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">

                {/* Product Type */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection('type')}
                    className="w-full p-5 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm uppercase tracking-wide embossing-font">Product Type</span>
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
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg neuzeit-font text-sm transition-all ${
                                selectedType === type.id
                                  ? 'text-white'
                                  : 'text-white/70 hover:text-white hover:bg-white/5'
                              }`}
                              style={selectedType === type.id ? { backgroundColor: printingColors.accent } : {}}
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                                  selectedType === type.id
                                    ? 'border-transparent bg-white/20'
                                    : 'border-white/30'
                                }`}
                              >
                                {selectedType === type.id && <Check className="w-3 h-3" />}
                              </div>
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
                    <span className="text-sm uppercase tracking-wide embossing-font">Use Case</span>
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
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
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
                    <span className="text-sm uppercase tracking-wide embossing-font">Finish</span>
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
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
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
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] z-50 flex flex-col"
                    style={{ backgroundColor: printingColors.darkLight }}
                  >
                    <div className="p-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                      <h2 className="neuzeit-font font-semibold text-white text-lg">Filters</h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                      <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex-shrink-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-white/50 uppercase tracking-wide neuzeit-font">Active Filters</p>
                          <button
                            onClick={() => {
                              clearAllFilters();
                              setSidebarOpen(false);
                            }}
                            className="text-xs font-medium px-2 py-1 rounded-md transition-all hover:opacity-80"
                            style={{ color: printingColors.accent, backgroundColor: `${printingColors.accent}20` }}
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedType !== 'all' && (
                            <button
                              onClick={() => handleTypeChange('all')}
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 neuzeit-font"
                              style={{ backgroundColor: printingColors.accent, color: 'white' }}
                            >
                              {productTypes.find(t => t.id === selectedType)?.label}
                              <X className="w-3 h-3" />
                            </button>
                          )}
                          {selectedUseCases.map(useCase => (
                            <button
                              key={`mobile-filter-usecase-${useCase}`}
                              onClick={() => setSelectedUseCases(prev => prev.filter(x => x !== useCase))}
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white transition-all hover:opacity-80 neuzeit-font"
                            >
                              {useCaseTags.find(t => t.id === useCase)?.label}
                              <X className="w-3 h-3" />
                            </button>
                          ))}
                          {selectedFinishes.map(finish => (
                            <button
                              key={`mobile-filter-finish-${finish}`}
                              onClick={() => toggleFinish(finish)}
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white transition-all hover:opacity-80 neuzeit-font"
                            >
                              {finishOptions.find(f => f.id === finish)?.label}
                              <X className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scrollable filter content */}
                    <div className="overflow-y-auto flex-1">
                      {/* Product Type */}
                      <div className="border-b border-white/10">
                        <button
                          onClick={() => toggleSection('type')}
                          className="w-full p-5 flex items-center justify-between text-white"
                        >
                          <span className="text-sm uppercase tracking-wide embossing-font">Product Type</span>
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
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg neuzeit-font text-sm transition-all ${
                                      selectedType === type.id
                                        ? 'text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                                    style={selectedType === type.id ? { backgroundColor: printingColors.accent } : {}}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                                        selectedType === type.id
                                          ? 'border-transparent bg-white/20'
                                          : 'border-white/30'
                                      }`}
                                    >
                                      {selectedType === type.id && <Check className="w-3 h-3" />}
                                    </div>
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
                          <span className="text-sm uppercase tracking-wide embossing-font">Use Case</span>
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
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
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
                          <span className="text-sm uppercase tracking-wide embossing-font">Finish</span>
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
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg neuzeit-font text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
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

                    {/* Apply button */}
                    <div className="p-5 border-t border-white/10 flex-shrink-0">
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
                  <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product, index) => (
                      <ProductGridCard
                        key={product.slug}
                        product={product}
                        index={index}
                        onClick={() => setModalProduct(product)}
                      />
                    ))}
                  </motion.div>
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

// Simple Product Card Component
interface ProductGridCardProps {
  product: PrintingProduct;
  index: number;
  onClick: () => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({
  product,
  index,
  onClick,
}) => {
  const imageUrl = product.images[0] || '/printing/placeholder.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2) }}
    >
      <button
        onClick={onClick}
        className="group w-full text-left rounded-[10px] overflow-hidden transition-shadow duration-150 hover:shadow-lg"
        style={{ backgroundColor: printingColors.darkLight }}
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
    </motion.div>
  );
};

export default PrintingBrowser;

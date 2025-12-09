import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, X, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { printingColors, printingCategories, finishTypes } from '../../lib/printing-theme';

interface FilterBarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedFinishes: string[];
  onFinishChange: (finishes: string[]) => void;
  productCount: number;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategories,
  onCategoryChange,
  selectedFinishes,
  onFinishChange,
  productCount,
  className,
}) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [finishDropdownOpen, setFinishDropdownOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters = selectedCategories.length > 0 || selectedFinishes.length > 0;

  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      onCategoryChange(selectedCategories.filter(c => c !== slug));
    } else {
      onCategoryChange([...selectedCategories, slug]);
    }
  };

  const toggleFinish = (value: string) => {
    if (selectedFinishes.includes(value)) {
      onFinishChange(selectedFinishes.filter(f => f !== value));
    } else {
      onFinishChange([...selectedFinishes, value]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
    onFinishChange([]);
  };

  // Filter dropdown component
  const FilterDropdown = ({
    label,
    isOpen,
    onToggle,
    children,
    selectedCount,
  }: {
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    selectedCount: number;
  }) => (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium',
          isOpen || selectedCount > 0
            ? 'border-current bg-opacity-10'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        )}
        style={{
          borderColor: selectedCount > 0 ? printingColors.accent : undefined,
          color: selectedCount > 0 ? printingColors.accent : printingColors.textDark,
          backgroundColor: selectedCount > 0 ? `${printingColors.accent}10` : undefined,
        }}
      >
        {label}
        {selectedCount > 0 && (
          <span
            className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
            style={{ backgroundColor: printingColors.accent }}
          >
            {selectedCount}
          </span>
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-3 max-h-72 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop filters
  const DesktopFilters = () => (
    <div className="hidden md:flex items-center gap-3">
      {/* Category filter */}
      <FilterDropdown
        label="Category"
        isOpen={categoryDropdownOpen}
        onToggle={() => {
          setCategoryDropdownOpen(!categoryDropdownOpen);
          setFinishDropdownOpen(false);
        }}
        selectedCount={selectedCategories.length}
      >
        <div className="space-y-1">
          {printingCategories.map((category) => (
            <label
              key={category.slug}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2"
                style={{
                  accentColor: printingColors.accent,
                }}
              />
              <span className="text-sm text-gray-700">{category.title}</span>
            </label>
          ))}
        </div>
      </FilterDropdown>

      {/* Finish filter */}
      <FilterDropdown
        label="Finish"
        isOpen={finishDropdownOpen}
        onToggle={() => {
          setFinishDropdownOpen(!finishDropdownOpen);
          setCategoryDropdownOpen(false);
        }}
        selectedCount={selectedFinishes.length}
      >
        <div className="space-y-1">
          {finishTypes.map((finish) => (
            <label
              key={finish.value}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedFinishes.includes(finish.value)}
                onChange={() => toggleFinish(finish.value)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2"
                style={{
                  accentColor: printingColors.accent,
                }}
              />
              <span className="text-sm text-gray-700">{finish.label}</span>
            </label>
          ))}
        </div>
      </FilterDropdown>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all
        </button>
      )}
    </div>
  );

  // Mobile filters button
  const MobileFilterButton = () => (
    <button
      onClick={() => setMobileFiltersOpen(true)}
      className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium"
      style={{ color: printingColors.textDark }}
    >
      <Filter className="w-4 h-4" />
      Filters
      {hasActiveFilters && (
        <span
          className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
          style={{ backgroundColor: printingColors.accent }}
        >
          {selectedCategories.length + selectedFinishes.length}
        </span>
      )}
    </button>
  );

  // Mobile filters modal
  const MobileFiltersModal = () => (
    <AnimatePresence>
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white z-50 md:hidden overflow-y-auto"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg" style={{ color: printingColors.dark }}>
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {printingCategories.map((category) => (
                    <label
                      key={category.slug}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: printingColors.accent }}
                      />
                      <span className="text-sm">{category.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Finishes */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Finish Type</h4>
                <div className="space-y-2">
                  {finishTypes.map((finish) => (
                    <label
                      key={finish.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFinishes.includes(finish.value)}
                        onChange={() => toggleFinish(finish.value)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: printingColors.accent }}
                      />
                      <span className="text-sm">{finish.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 rounded-lg border border-gray-200 text-sm font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: printingColors.accent }}
                >
                  Show Results
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="flex items-center gap-3">
        <DesktopFilters />
        <MobileFilterButton />

        {/* Result count */}
        <span className="text-sm text-gray-500">
          {productCount} {productCount === 1 ? 'product' : 'products'}
        </span>
      </div>

      <MobileFiltersModal />
    </div>
  );
};

export default FilterBar;

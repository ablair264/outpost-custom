import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Search, Filter, ChevronDown, ChevronUp, Tag, 
  Package, Palette, Users, Sparkles, RotateCcw, Check
} from 'lucide-react';
import { ProductFilters, FilterOptions } from '../lib/productBrowserApi';
import { useDebounce } from '../hooks/useDebounce';
import './AdvancedFilterModal.css';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ProductFilters) => void;
  onSearchChange?: (searchQuery: string) => void;
  filterOptions: FilterOptions;
  currentFilters: ProductFilters;
  isLoading?: boolean;
  totalResults?: number;
}

interface FilterCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  filters: FilterSection[];
}

interface FilterSection {
  key: keyof ProductFilters | 'price';
  title: string;
  type: 'multiselect' | 'range' | 'search';
  options?: string[];
  icon?: React.ReactNode;
  searchable?: boolean;
}

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onSearchChange,
  filterOptions,
  currentFilters,
  isLoading = false,
  totalResults = 0
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(currentFilters);
  const [searchQuery, setSearchQuery] = useState(currentFilters.searchQuery || '');
  const [activeCategoryId, setActiveCategoryId] = useState('essentials');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['productTypes', 'price']));
  const [sectionSearches, setSectionSearches] = useState<Record<string, string>>({});

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter categories with organized sections
  const filterCategories: FilterCategory[] = [
    {
      id: 'essentials',
      title: 'Essentials',
      icon: <Filter size={18} />,
      description: 'Core filters to find what you need',
      filters: [
        {
          key: 'productTypes',
          title: 'Product Type',
          type: 'multiselect',
          options: filterOptions.productTypes,
          icon: <Package size={16} />,
          searchable: true
        },
        {
          key: 'brands',
          title: 'Brands',
          type: 'multiselect',
          options: filterOptions.brands,
          icon: <Tag size={16} />,
          searchable: true
        },
        {
          key: 'price',
          title: 'Price Range',
          type: 'range',
          icon: <Sparkles size={16} />
        }
      ]
    },
    {
      id: 'style',
      title: 'Style & Design',
      icon: <Palette size={18} />,
      description: 'Customize appearance and aesthetics',
      filters: [
        {
          key: 'colors',
          title: 'Colors',
          type: 'multiselect',
          options: filterOptions.colors,
          icon: <Palette size={16} />
        },
        {
          key: 'materials',
          title: 'Materials',
          type: 'multiselect',
          options: filterOptions.materials,
          icon: <Package size={16} />,
          searchable: true
        },
        {
          key: 'sizes',
          title: 'Sizes',
          type: 'multiselect',
          options: filterOptions.sizes,
          icon: <Tag size={16} />
        }
      ]
    },
    {
      id: 'audience',
      title: 'Target Audience',
      icon: <Users size={18} />,
      description: 'Filter by demographics and audience',
      filters: [
        {
          key: 'genders',
          title: 'Gender',
          type: 'multiselect',
          options: filterOptions.genders,
          icon: <Users size={16} />
        },
        {
          key: 'ageGroups',
          title: 'Age Groups',
          type: 'multiselect',
          options: filterOptions.ageGroups,
          icon: <Users size={16} />
        },
        {
          key: 'categories',
          title: 'Categories',
          type: 'multiselect',
          options: filterOptions.categories,
          icon: <Tag size={16} />,
          searchable: true
        }
      ]
    }
  ];

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(currentFilters);
      setSearchQuery(currentFilters.searchQuery || '');
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, currentFilters]);

  // Handle debounced search
  useEffect(() => {
    if (onSearchChange && debouncedSearchQuery !== currentFilters.searchQuery) {
      onSearchChange(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearchChange, currentFilters.searchQuery]);

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const handleMultiSelectToggle = (key: keyof ProductFilters, value: string) => {
    setLocalFilters(prev => {
      const currentValues = (prev[key] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [key]: newValues.length > 0 ? newValues : undefined
      };
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || undefined;
    setLocalFilters(prev => ({
      ...prev,
      [type === 'min' ? 'priceMin' : 'priceMax']: numValue
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    setSearchQuery('');
    setSectionSearches({});
  };

  const applyFilters = () => {
    const filtersToApply = {
      ...localFilters,
      searchQuery: searchQuery.trim() || undefined
    };
    onApplyFilters(filtersToApply);
    onClose();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (localFilters.priceMin !== undefined) count++;
    if (localFilters.priceMax !== undefined) count++;
    
    Object.entries(localFilters).forEach(([key, value]) => {
      if (key !== 'searchQuery' && key !== 'priceMin' && key !== 'priceMax' && value) {
        if (Array.isArray(value)) {
          count += value.length;
        }
      }
    });
    
    return count;
  };

  const getActiveFiltersForCategory = (category: FilterCategory) => {
    return category.filters.reduce((count, filter) => {
      if (filter.key === 'price') {
        if (localFilters.priceMin !== undefined) count++;
        if (localFilters.priceMax !== undefined) count++;
      } else {
        const values = localFilters[filter.key as keyof ProductFilters];
        if (Array.isArray(values)) count += values.length;
      }
      return count;
    }, 0);
  };

  const renderFilterSection = (section: FilterSection) => {
    const isExpanded = expandedSections.has(section.key);
    const sectionSearch = sectionSearches[section.key] || '';
    
    // Handle price range
    if (section.type === 'range' && section.key === 'price') {
      return (
        <div key={section.key} className="filter-section">
          <button
            className="section-header"
            onClick={() => toggleSection(section.key)}
          >
            <div className="section-info">
              {section.icon}
              <div className="section-details">
                <span className="section-title">{section.title}</span>
                <span className="section-count">
                  {localFilters.priceMin || localFilters.priceMax ? 'Active' : 'Set range'}
                </span>
              </div>
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {isExpanded && (
            <div className="section-content">
              <div className="price-range-container">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>Minimum</label>
                    <div className="price-input-wrapper">
                      <span className="currency">£</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={localFilters.priceMin || ''}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="price-separator">to</div>
                  <div className="price-input-group">
                    <label>Maximum</label>
                    <div className="price-input-wrapper">
                      <span className="currency">£</span>
                      <input
                        type="number"
                        placeholder="1000"
                        value={localFilters.priceMax || ''}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="price-presets">
                  <button onClick={() => { handlePriceChange('min', '0'); handlePriceChange('max', '25'); }}>
                    Under £25
                  </button>
                  <button onClick={() => { handlePriceChange('min', '25'); handlePriceChange('max', '50'); }}>
                    £25 - £50
                  </button>
                  <button onClick={() => { handlePriceChange('min', '50'); handlePriceChange('max', '100'); }}>
                    £50 - £100
                  </button>
                  <button onClick={() => { handlePriceChange('min', '100'); handlePriceChange('max', ''); }}>
                    £100+
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Handle multiselect sections
    if (section.type === 'multiselect' && section.options && section.key !== 'price') {
      const selectedValues = (localFilters[section.key as keyof ProductFilters] as string[]) || [];
      const filteredOptions = section.searchable && sectionSearch
        ? section.options.filter(option => 
            option.toLowerCase().includes(sectionSearch.toLowerCase())
          )
        : section.options;
      
      return (
        <div key={section.key} className="filter-section">
          <button
            className="section-header"
            onClick={() => toggleSection(section.key)}
          >
            <div className="section-info">
              {section.icon}
              <div className="section-details">
                <span className="section-title">{section.title}</span>
                <span className="section-count">
                  {selectedValues.length > 0 ? `${selectedValues.length} selected` : `${section.options.length} available`}
                </span>
              </div>
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {isExpanded && (
            <div className="section-content">
              {section.searchable && section.options.length > 6 && (
                <div className="section-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={`Search ${section.title.toLowerCase()}...`}
                    value={sectionSearch}
                    onChange={(e) => setSectionSearches(prev => ({
                      ...prev,
                      [section.key]: e.target.value
                    }))}
                  />
                </div>
              )}
              <div className="options-grid">
                {filteredOptions.map((option) => (
                  <label key={option} className="option-item">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={() => handleMultiSelectToggle(section.key as keyof ProductFilters, option)}
                    />
                    <span className="checkbox-custom">
                      {selectedValues.includes(option) && <Check size={12} />}
                    </span>
                    <span className="option-label">{option}</span>
                  </label>
                ))}
              </div>
              {filteredOptions.length === 0 && sectionSearch && (
                <div className="no-results">
                  No {section.title.toLowerCase()} found matching "{sectionSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const currentCategory = useMemo(() => 
    filterCategories.find(cat => cat.id === activeCategoryId) || filterCategories[0],
    [activeCategoryId, filterCategories]
  );

  if (!isOpen) return null;

  return (
    <div className="advanced-filter-overlay" onClick={onClose}>
      <div className="advanced-filter-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="filter-header">
          <div className="header-main">
            <div className="header-title">
              <Filter size={24} />
              <div>
                <h2>Advanced Filters</h2>
                <p>Refine your product search</p>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <div className="header-stats">
            <div className="results-info">
              <span className="results-count">{totalResults.toLocaleString()}</span>
              <span className="results-label">products found</span>
            </div>
            {getActiveFilterCount() > 0 && (
              <div className="active-filters-info">
                <span className="active-count">{getActiveFilterCount()}</span>
                <span className="active-label">filters active</span>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products, brands, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="clear-search">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="filter-body">
          {/* Category Navigation */}
          <div className="category-nav">
            {filterCategories.map(category => {
              const activeCount = getActiveFiltersForCategory(category);
              return (
                <button
                  key={category.id}
                  className={`category-button ${activeCategoryId === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <div className="category-info">
                    <span className="category-title">{category.title}</span>
                    <span className="category-desc">{category.description}</span>
                  </div>
                  {activeCount > 0 && (
                    <span className="category-badge">{activeCount}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Filter Content */}
          <div className="filter-content">
            <div className="category-header">
              <div className="category-title-section">
                {currentCategory.icon}
                <div>
                  <h3>{currentCategory.title}</h3>
                  <p>{currentCategory.description}</p>
                </div>
              </div>
            </div>
            
            <div className="filter-sections">
              {currentCategory.filters.map(section => renderFilterSection(section))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="filter-footer">
          <div className="footer-actions">
            <button 
              className="reset-button"
              onClick={clearAllFilters}
              disabled={getActiveFilterCount() === 0}
            >
              <RotateCcw size={18} />
              Reset All
            </button>
            <button 
              className="apply-button"
              onClick={applyFilters}
              disabled={isLoading}
            >
              {isLoading ? 'Applying...' : `Apply Filters${getActiveFilterCount() > 0 ? ` (${getActiveFilterCount()})` : ''}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdvancedFilterModal;
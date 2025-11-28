import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { ProductFilters, FilterOptions } from '../lib/productBrowserApi';
import './FilterSidebar.css';

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  currentFilters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  totalResults: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions,
  currentFilters,
  onFiltersChange,
  totalResults
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['productTypes', 'brands', 'materials', 'colors'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleMultiSelectToggle = (key: keyof ProductFilters, value: string) => {
    const currentValues = (currentFilters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...currentFilters,
      [key]: newValues.length > 0 ? newValues : undefined
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || undefined;
    onFiltersChange({
      ...currentFilters,
      [type === 'min' ? 'priceMin' : 'priceMax']: numValue
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.priceMin !== undefined) count++;
    if (currentFilters.priceMax !== undefined) count++;
    
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (key !== 'searchQuery' && key !== 'priceMin' && key !== 'priceMax' && value) {
        if (Array.isArray(value)) count += value.length;
      }
    });
    
    return count;
  };

  const renderFilterSection = (
    title: string,
    key: keyof ProductFilters,
    options: string[],
    maxVisible: number = 6
  ) => {
    const isExpanded = expandedSections.has(key);
    const selectedValues = (currentFilters[key] as string[]) || [];

    return (
      <div className="filter-section">
        <button
          className="section-header"
          onClick={() => toggleSection(key)}
        >
          <span className="section-title">{title}</span>
          <div className="section-controls">
            {selectedValues.length > 0 && (
              <span className="selected-count">{selectedValues.length}</span>
            )}
            <span className="chevron">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="section-content">
            {options.map((option) => (
              <label key={option} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleMultiSelectToggle(key, option)}
                />
                <span className="checkmark"></span>
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filter-sidebar">
      <div className="sidebar-header">
        <h3>Filters</h3>
        {getActiveFilterCount() > 0 && (
          <button className="clear-all-btn" onClick={clearAllFilters}>
            <RotateCcw size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="results-count">
        {totalResults.toLocaleString()} products
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div className="section-header">
          <span className="section-title">Price Range</span>
        </div>
        <div className="section-content">
          <div className="price-inputs">
            <div className="price-field">
              <label>Min</label>
              <input
                type="number"
                placeholder="£0"
                value={currentFilters.priceMin || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
            </div>
            <div className="price-field">
              <label>Max</label>
              <input
                type="number"
                placeholder="£1000"
                value={currentFilters.priceMax || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </div>
          </div>
          <div className="price-quick-filters">
            <button onClick={() => { handlePriceChange('min', '0'); handlePriceChange('max', '25'); }}>
              Under £25
            </button>
            <button onClick={() => { handlePriceChange('min', '25'); handlePriceChange('max', '50'); }}>
              £25-£50
            </button>
            <button onClick={() => { handlePriceChange('min', '50'); handlePriceChange('max', ''); }}>
              £50+
            </button>
          </div>
        </div>
      </div>

      {/* Product Types */}
      {filterOptions.productTypes && filterOptions.productTypes.length > 0 &&
        renderFilterSection('Product Type', 'productTypes', filterOptions.productTypes, 10)
      }

      {/* Categories */}
      {filterOptions.categories && filterOptions.categories.length > 0 &&
        renderFilterSection('Categories', 'categories', filterOptions.categories, 10)
      }

      {/* Brands */}
      {filterOptions.brands && filterOptions.brands.length > 0 &&
        renderFilterSection('Brands', 'brands', filterOptions.brands, 10)
      }

      {/* Materials */}
      {filterOptions.materials && filterOptions.materials.length > 0 &&
        renderFilterSection('Materials', 'materials', filterOptions.materials, 10)
      }

      {/* Colors */}
      {filterOptions.colors && filterOptions.colors.length > 0 &&
        renderFilterSection('Colors', 'colors', filterOptions.colors, 10)
      }

      {/* Color Shades */}
      {filterOptions.colorShades && filterOptions.colorShades.length > 0 &&
        renderFilterSection('Color Shades', 'colorShades', filterOptions.colorShades, 10)
      }

      {/* Sizes */}
      {filterOptions.sizes && filterOptions.sizes.length > 0 &&
        renderFilterSection('Sizes', 'sizes', filterOptions.sizes, 10)
      }

      {/* Genders */}
      {filterOptions.genders && filterOptions.genders.length > 0 &&
        renderFilterSection('Gender', 'genders', filterOptions.genders, 10)
      }

      {/* Age Groups */}
      {filterOptions.ageGroups && filterOptions.ageGroups.length > 0 &&
        renderFilterSection('Age Group', 'ageGroups', filterOptions.ageGroups, 10)
      }

      {/* Accreditations */}
      {filterOptions.accreditations && filterOptions.accreditations.length > 0 &&
        renderFilterSection('Accreditations', 'accreditations', filterOptions.accreditations, 10)
      }

    </div>
  );
};

export default FilterSidebar;
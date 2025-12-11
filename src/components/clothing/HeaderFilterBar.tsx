import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, X, Check } from 'lucide-react';
import { useHeaderFilter, ClothingFilterData } from '../../contexts/HeaderFilterContext';

// Color mapping for filter display
const getColorHexValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Navy': '#001F3F',
    'Royal Blue': '#4169E1',
    'Sky Blue': '#87CEEB',
    'Red': '#FF0000',
    'Burgundy': '#800020',
    'Green': '#228B22',
    'Lime': '#32CD32',
    'Yellow': '#FFD700',
    'Orange': '#FFA500',
    'Purple': '#800080',
    'Pink': '#FFC0CB',
    'Grey': '#808080',
    'Charcoal': '#36454F',
    'Brown': '#8B4513',
    'Beige': '#F5F5DC',
    'Cream': '#FFFDD0',
    'Khaki': '#C3B091',
    'Teal': '#008080',
    'Coral': '#FF7F50',
    'Turquoise': '#40E0D0',
    'Maroon': '#800000',
    'Olive': '#808000',
    'Tan': '#D2B48C',
    'Heather Grey': '#9AA297',
    'French Navy': '#001F4D',
    'Bottle Green': '#006B3C',
    'Classic Red': '#CF1020',
  };
  return colorMap[colorName] || '#808080';
};

const clothingColors = {
  dark: '#1A1A1A',
  secondary: '#242424',
  accent: '#78BE20',
};

export const HeaderFilterBar: React.FC = () => {
  const { filterData } = useHeaderFilter();

  if (!filterData || !filterData.isActive) {
    return null;
  }

  const {
    filterCount,
    headerFilterOpen,
    setHeaderFilterOpen,
    hasActiveFilters,
    selectedTypes,
    selectedBrands,
    selectedColors,
    selectedGenders,
    toggleType,
    toggleBrand,
    toggleColor,
    toggleGender,
    clearAllFilters,
    sectionsOpen,
    toggleSection,
    availableTypeGroups,
    brandsList,
    colors,
    genders,
  } = filterData;

  return (
    <div className="lg:hidden px-4 py-2" style={{ backgroundColor: clothingColors.dark }}>
      <div className="max-w-[1600px] mx-auto">
        {/* Collapsible trigger */}
        <button
          onClick={() => setHeaderFilterOpen(!headerFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-white/20 transition-all"
          style={{ backgroundColor: clothingColors.secondary }}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/70" />
            <span className="font-medium text-white text-sm">Filters</span>
            {filterCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: clothingColors.accent, color: 'black' }}>
                {filterCount}
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-white/70 transition-transform duration-200 ${headerFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Filter panel - matches sidebar structure */}
        <AnimatePresence>
          {headerFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: clothingColors.secondary }}>
                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-white/50 uppercase tracking-wide">Active Filters</p>
                      <button
                        onClick={clearAllFilters}
                        className="text-xs font-medium px-2 py-1 rounded-md transition-all hover:opacity-80"
                        style={{ color: clothingColors.accent, backgroundColor: `${clothingColors.accent}20` }}
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTypes.map(type => (
                        <button
                          key={`mobile-filter-type-${type}`}
                          onClick={() => toggleType(type)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: clothingColors.accent, color: 'black' }}
                        >
                          {type}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {selectedBrands.map(brand => (
                        <button
                          key={`mobile-filter-brand-${brand}`}
                          onClick={() => toggleBrand(brand)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: clothingColors.accent, color: 'black' }}
                        >
                          {brand}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {selectedColors.map(color => (
                        <button
                          key={`mobile-filter-color-${color}`}
                          onClick={() => toggleColor(color)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: clothingColors.accent, color: 'black' }}
                        >
                          {color}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                      {selectedGenders.map(gender => (
                        <button
                          key={`mobile-filter-gender-${gender}`}
                          onClick={() => toggleGender(gender)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: clothingColors.accent, color: 'black' }}
                        >
                          {gender}
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Type */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection('type')}
                    className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Type</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.type ? 'rotate-180' : ''}`} />
                  </button>
                  {sectionsOpen.type && (
                    <div className="px-4 pb-4 space-y-2">
                      {availableTypeGroups.map(group => (
                        <div key={`mobile-type-group-${group.name}`}>
                          <p className="text-xs text-white/40 uppercase tracking-wide mb-1.5">{group.name}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {group.availableItems.map(type => (
                              <button
                                key={`mobile-type-${type}`}
                                onClick={() => toggleType(type)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  selectedTypes.includes(type)
                                    ? 'text-black'
                                    : 'text-white/80 bg-white/10 hover:bg-white/15'
                                }`}
                                style={selectedTypes.includes(type) ? { backgroundColor: clothingColors.accent } : {}}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection('brand')}
                    className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Brand</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.brand ? 'rotate-180' : ''}`} />
                  </button>
                  {sectionsOpen.brand && (
                    <div className="px-4 pb-4 max-h-48 overflow-y-auto space-y-1">
                      {brandsList.map(brand => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm transition-all ${
                            selectedBrands.includes(brand)
                              ? 'text-black'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                          style={selectedBrands.includes(brand) ? { backgroundColor: clothingColors.accent } : {}}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              selectedBrands.includes(brand)
                                ? 'border-transparent bg-white/20'
                                : 'border-white/30'
                            }`}
                          >
                            {selectedBrands.includes(brand) && <Check className="w-3 h-3" />}
                          </div>
                          {brand}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Colour */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection('colour')}
                    className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Colour</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.colour ? 'rotate-180' : ''}`} />
                  </button>
                  {sectionsOpen.colour && (
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {colors.map(color => {
                          const isSelected = selectedColors.includes(color);
                          const colorHex = getColorHexValue(color);
                          const isLight = colorHex === '#FFFFFF' || colorHex === '#FFFDD0';
                          return (
                            <button
                              key={color}
                              onClick={() => toggleColor(color)}
                              className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                                isSelected
                                  ? 'border-[#78BE20] scale-110'
                                  : isLight
                                  ? 'border-gray-400 hover:scale-110'
                                  : 'border-transparent hover:scale-110'
                              }`}
                              style={{ backgroundColor: colorHex }}
                              title={color}
                            >
                              {isSelected && (
                                <Check className={`absolute inset-0 m-auto w-4 h-4 ${isLight ? 'text-black' : 'text-white'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <button
                    onClick={() => toggleSection('gender')}
                    className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-medium uppercase tracking-wide">Gender</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sectionsOpen.gender ? 'rotate-180' : ''}`} />
                  </button>
                  {sectionsOpen.gender && (
                    <div className="px-4 pb-4 space-y-1">
                      {genders.filter(gender => gender !== 'None').map(gender => (
                        <button
                          key={gender}
                          onClick={() => toggleGender(gender)}
                          className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm transition-all ${
                            selectedGenders.includes(gender)
                              ? 'text-black'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                          style={selectedGenders.includes(gender) ? { backgroundColor: clothingColors.accent } : {}}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              selectedGenders.includes(gender)
                                ? 'border-transparent bg-white/20'
                                : 'border-white/30'
                            }`}
                          >
                            {selectedGenders.includes(gender) && <Check className="w-3 h-3" />}
                          </div>
                          {gender}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeaderFilterBar;

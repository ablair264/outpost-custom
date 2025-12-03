import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, X, ChevronDown, Lightbulb, Search } from 'lucide-react';
import { getAllProducts, getFilterOptions, getSizesForProductTypes, ProductFilters, FilterOptions, BrandOption } from '../lib/productBrowserApi';
import { Product } from '../lib/supabase';
import SmartSearchModal from '../components/SmartSearchModal';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

// Custom SVG Icons for Product Types
const TopsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.5 3L2 7v5l4-1v10h12V11l4 1V7l-4.5-4H14l-2 3-2-3H6.5z" />
  </svg>
);

const OuterwearIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6.5 3L2 7v5l4-1v10h12V11l4 1V7l-4.5-4H14l-2 3-2-3H6.5z" />
    <path d="M9 13v4M12 13v4M15 13v4" opacity="0.5" />
  </svg>
);

const BottomsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 3h12v5l-1 13h-4l-1-10-1 10H7L6 8V3z" />
  </svg>
);

const WorkwearIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 3h14l1 5v13H4V8l1-5z" />
    <path d="M4 8h16" />
    <path d="M9 3v5M15 3v5" />
    <rect x="8" y="12" width="8" height="5" rx="0.5" />
  </svg>
);

const HeadwearIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 15c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    <path d="M2 15h20v2c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-2z" />
  </svg>
);

const FootwearIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 17h18c1.1 0 2-.9 2-2v-1c0-2.2-2-4-6-4l-2-5H6v7c-2 0-4 2-4 4v1h1z" />
    <path d="M8 17v-3" />
  </svg>
);

const BagsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
    <path d="M3 11h18" />
  </svg>
);

const AccessoriesIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
  </svg>
);

const UnderwearIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 5h14v5c0 2-1 4-3 5l-1 6h-6l-1-6c-2-1-3-3-3-5V5z" />
    <path d="M12 10v6" />
  </svg>
);

const HomeGiftsIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="8" width="18" height="13" rx="1" />
    <path d="M12 8v13" />
    <path d="M3 12h18" />
    <path d="M7.5 8C6 6 6.5 4 8 3.5S11 4 12 8c1-4 2.5-5 4-4.5S18 6 16.5 8" />
  </svg>
);

const FilterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

// Product Type Groups - comprehensive mapping
const PRODUCT_TYPE_GROUPS = [
  {
    name: 'TOPS',
    Icon: TopsIcon,
    items: ['T-Shirts', 'Polos', 'Shirts', 'Blouses', 'Sweatshirts', 'Hoodies', 'Fleece', 'Cardigans', 'Knitted Jumpers', 'Sports Overtops', 'Baselayers', 'Rugby Shirts', 'Tunics', 'Vests (t-shirt)']
  },
  {
    name: 'OUTERWEAR',
    Icon: OuterwearIcon,
    items: ['Jackets', 'Gilets & Body Warmers', 'Softshells', 'Ponchos', 'Coveralls', 'Rain Suits', 'Waistcoats']
  },
  {
    name: 'BOTTOMS',
    Icon: BottomsIcon,
    items: ['Shorts', 'Trousers', 'Chinos', 'Jeans', 'Skirts', 'Skorts', 'Sweatpants', 'Leggings', 'Trackwear', 'Dungarees', 'Dresses', 'Unitards']
  },
  {
    name: 'WORKWEAR',
    Icon: WorkwearIcon,
    items: ['Aprons', 'Tabards', 'Bibs', 'Chef Jackets', 'Chef Jacket Studs', 'Safety Vests', 'Coveralls', 'Arm Guards', 'Quad Guards', 'Kneepads', 'Dog Vests', 'Helmets', 'Reflective Tape']
  },
  {
    name: 'HEADWEAR',
    Icon: HeadwearIcon,
    items: ['Caps', 'Beanies', 'Hats', 'Headbands', 'Snoods', 'Ear Muffs', 'Winter Accessory Sets']
  },
  {
    name: 'FOOTWEAR',
    Icon: FootwearIcon,
    items: ['Boots', 'Shoes', 'Trainers', 'Slippers', 'Socks', 'Laces']
  },
  {
    name: 'BAGS & CASES',
    Icon: BagsIcon,
    items: ['Bags', 'Laptop Cases', 'Pencil Cases', 'Document Wallets', 'Wallets', 'Mail Order Bags', 'Shirt Bags']
  },
  {
    name: 'ACCESSORIES',
    Icon: AccessoriesIcon,
    items: ['Accessories', 'Belts', 'Braces', 'Ties', 'Scarves', 'Gloves', 'Armbands', 'Glasses', 'Goggles', 'Keyrings', 'Straps', 'Umbrellas', 'Zips Pulls', 'Embroidery Accessories', 'Embroidery Backing']
  },
  {
    name: 'UNDERWEAR & SLEEPWEAR',
    Icon: UnderwearIcon,
    items: ['Boxers', 'Bras', 'Bodysuits', 'Pyjamas', 'Loungewear Bottoms', 'Onesies', 'Sleepsuits', 'Robes', 'Gowns']
  },
  {
    name: 'HOME & GIFTS',
    Icon: HomeGiftsIcon,
    items: ['Towels', 'Blankets', 'Bedding', 'Cushions', 'Cushion Covers', 'Hot Water Bottles & Covers', 'Tablecloths', 'Soft Toys', 'Gifts', 'Christmas Animated Characters', 'Travel Sets', 'Yoga Mats', 'Bottles', 'Freezer Blocks', 'Storage', 'First Aid Boxes', 'Batteries', 'Paper', 'Bin Bags', 'Packing Tape', 'Disinfectent Wipes']
  }
];

// Color mapping for swatches
const COLOR_MAP: Record<string, string> = {
  'Red': '#DC2626',
  'Blue': '#2563EB',
  'Green': '#16A34A',
  'Yellow': '#EAB308',
  'Orange': '#EA580C',
  'Purple': '#9333EA',
  'Pink': '#EC4899',
  'Black': '#000000',
  'White': '#FFFFFF',
  'Grey': '#6B7280',
  'Gray': '#6B7280',
  'Navy': '#1E3A5F',
  'Brown': '#92400E',
  'Beige': '#D4A574',
  'Cream': '#FFFDD0',
  'Burgundy': '#800020',
  'Maroon': '#800000',
  'Teal': '#0D9488',
  'Cyan': '#06B6D4',
  'Lime': '#84CC16',
  'Olive': '#84843C',
  'Coral': '#F97316',
  'Turquoise': '#40E0D0',
  'Gold': '#EAB308',
  'Silver': '#A8A29E',
  'Charcoal': '#374151',
  'Khaki': '#BDB76B',
};

// Product Type Mega Menu Dropdown
interface ProductTypeMegaMenuProps {
  options: string[];
  selectedValues: string[];
  onToggleGroup: (items: string[]) => void;
}

const ProductTypeMegaMenu: React.FC<ProductTypeMegaMenuProps> = ({
  options,
  selectedValues,
  onToggleGroup
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = selectedValues.length > 0;

  // Filter groups to only show those with available items
  const availableGroups = PRODUCT_TYPE_GROUPS.map(group => ({
    ...group,
    availableItems: group.items.filter(item => options.includes(item))
  })).filter(group => group.availableItems.length > 0);

  const active = activeGroup ? availableGroups.find(g => g.name === activeGroup) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) setActiveGroup(null);
        }}
        className={`h-full px-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
          isOpen || hasSelection
            ? 'bg-[#78BE20] text-black'
            : 'bg-transparent text-white hover:bg-[#78BE20] hover:text-black'
        }`}
      >
        PRODUCT TYPE
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-0 bg-[#212121] shadow-2xl z-50 rounded-b-lg overflow-hidden border border-[#383838] ${active ? 'min-w-[860px]' : 'min-w-[260px]'}`}>
          <div className="flex">
            {/* Left rail */}
            <div className="w-64 bg-[#212121] border-r border-[#383838]">
              {availableGroups.map((group) => {
                const isActive = group.name === activeGroup;
                const { Icon } = group;
                return (
                  <button
                    key={group.name}
                    onClick={() => setActiveGroup(group.name)}
                    className={`group relative w-full text-left px-4 py-3 uppercase text-[13px] font-bold tracking-wide flex items-center justify-between gap-3 transition-all overflow-hidden ${
                      isActive ? 'bg-[#383838] text-white' : 'text-white/85 hover:bg-[#2b2b2b]'
                    }`}
                  >
                    <span className="flex-1 transform transition-all duration-200 group-hover:translate-x-1">
                      {group.name}
                    </span>
                    <span
                      className={`transition-all duration-200 translate-x-2 group-hover:translate-x-0 ${
                        isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-white/70'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </button>
                );
              })}
            </div>

            {active && (
              <div className="flex-1 bg-[#1a1a1a] p-4 min-h-[320px]">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-white">
                      <active.Icon className="w-6 h-6 text-white/80" />
                      <h3 className="text-sm font-semibold uppercase tracking-wide">
                        {active.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        onToggleGroup(active.availableItems);
                        setIsOpen(false);
                      }}
                      className="text-xs font-semibold text-[#78BE20] hover:text-[#9ae03a] uppercase tracking-wide"
                    >
                      Select all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pr-2 overflow-y-auto scrollbar-thin max-h-[360px]">
                    {active.availableItems.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          onToggleGroup([item]);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded bg-[#212121] hover:bg-[#383838] text-white text-sm font-medium transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Colour Swatches Mega Menu
interface ColourMegaMenuProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

const ColourMegaMenu: React.FC<ColourMegaMenuProps> = ({
  options,
  selectedValues,
  onToggle,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = selectedValues.length > 0;

  // Get color hex from name
  const getColorHex = (colorName: string): string => {
    const normalizedName = colorName.charAt(0).toUpperCase() + colorName.slice(1).toLowerCase();
    return COLOR_MAP[normalizedName] || COLOR_MAP[colorName] || '#CCCCCC';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-full px-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
          isOpen || hasSelection
            ? 'bg-[#78BE20] text-black'
            : 'bg-transparent text-white hover:bg-[#78BE20] hover:text-black'
        }`}
      >
        COLOUR
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-0 bg-[#212121] shadow-2xl z-50 rounded-b-lg p-4 border border-[#383838]">
          <div className="flex flex-wrap gap-2" style={{ maxWidth: '600px' }}>
            {options.map((color) => {
              const isSelected = selectedValues.includes(color);
              const colorHex = getColorHex(color);
              const isLight = colorHex === '#FFFFFF' || colorHex === '#FFFDD0';

              return (
                <button
                  key={color}
                  onClick={() => onToggle(color)}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                    isSelected
                      ? 'bg-white/10 ring-2 ring-[#78BE20]'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  title={color}
                >
                  {/* Color swatch */}
                  <div
                    className={`w-6 h-6 rounded border ${
                      isLight ? 'border-gray-400' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: colorHex }}
                  />
                  {/* Color name */}
                  <span className="text-sm text-white font-medium">
                    {color}
                  </span>
                  {/* Checkmark for selected */}
                  {isSelected && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#78BE20"
                      strokeWidth="3"
                      className="w-4 h-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {hasSelection && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Brand Mega Menu with Logos
interface BrandMegaMenuProps {
  brands: BrandOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

const BrandMegaMenu: React.FC<BrandMegaMenuProps> = ({
  brands,
  selectedValues,
  onToggle,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = selectedValues.length > 0;

  // Get brands with logos for the right panel
  const brandsWithLogos = brands.filter(b => b.logo_url);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-full px-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
          isOpen || hasSelection
            ? 'bg-[#78BE20] text-black'
            : 'bg-transparent text-white hover:bg-[#78BE20] hover:text-black'
        }`}
      >
        BRAND
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-0 bg-[#212121] shadow-2xl z-50 rounded-b-lg min-w-[760px] border border-[#383838]">
          <div className="flex">
            {/* Left side - Brand names list */}
            <div className="flex-1 p-4 max-h-[400px] overflow-y-auto scrollbar-thin grid grid-cols-2 gap-2 pr-3">
              {brands.map((brand) => {
                const isSelected = selectedValues.includes(brand.name);
                return (
                  <button
                    key={brand.id}
                    onClick={() => onToggle(brand.name)}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors rounded ${
                      isSelected
                        ? 'bg-white/10 text-white font-semibold ring-2 ring-[#78BE20]'
                        : 'text-white/90 hover:bg-white/5'
                    }`}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>

            {/* Right side - Brand logos */}
            {brandsWithLogos.length > 0 && (
              <div className="w-48 p-4 flex flex-col gap-3 border-l border-white/10">
                {brandsWithLogos.slice(0, 4).map((brand) => {
                  const isSelected = selectedValues.includes(brand.name);
                  return (
                    <button
                      key={brand.id}
                      onClick={() => onToggle(brand.name)}
                      className={`p-3 rounded transition-all bg-white/5 hover:bg-white/10 ${
                        isSelected
                          ? 'ring-2 ring-[#78BE20]'
                          : ''
                      }`}
                    >
                      <img
                        src={brand.logo_url!}
                        alt={brand.name}
                        className="w-full h-10 object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {hasSelection && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper to extract base size from variants
const extractBaseSize = (size: string): string => {
  const lower = size.toLowerCase();

  // For adult sizes like "L Long", "2XL Reg" → extract "L", "2XL"
  if (/^(xxs|xs|s|m|l|xl|\dxl)/i.test(size)) {
    const match = size.match(/^(xxs|xs|s|m|l|xl|\dxl)/i);
    return match ? match[1].toUpperCase() : size;
  }

  // For age ranges like "6/7 Years" → extract first number "6"
  if (/^(\d+)\/\d+\s*years?$/i.test(size)) {
    const match = size.match(/^(\d+)/);
    return match ? `${match[1]} Years` : size;
  }

  // For women's sizes like "Wom 12/14" → extract base "Wom 12"
  if (lower.startsWith('wom ')) {
    const match = size.match(/^(Wom \d+)/i);
    return match ? match[1] : size;
  }

  // For numeric sizes like "32 Long" → extract "32"
  if (/^\d+\s+(long|reg|short|tall|mod)/i.test(size)) {
    const match = size.match(/^(\d+)/);
    return match ? match[1] : size;
  }

  return size;
};

// Size categorization helper - GROUPED BASE SIZES
const categorizeSizes = (allSizes: string[]) => {
  const categoryMap: Record<string, Map<string, string[]>> = {
    'Baby & Toddler (0-24 months)': new Map(),
    'Kids (2-5 years)': new Map(),
    'Youth (6-15 years)': new Map(),
    'Adult Sizes (XXS-8XL)': new Map(),
    'Women\'s Numeric': new Map(),
    'Numeric Sizes': new Map(),
    'Measurements (Chest/Waist/Collar)': new Map(),
    'Footwear': new Map(),
    'One Size / Special': new Map(),
    'Other': new Map()
  };

  allSizes.forEach(size => {
    const lower = size.toLowerCase();

    // Baby & Toddler (months)
    if (lower.includes('months') || lower === 'new born') {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Baby & Toddler (0-24 months)'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Kids Age (2-5 years) - only actual year ranges
    else if (/^[1-5]\/?\d?\s*years?$/i.test(size) || /^[2-5]\+\s*years?$/i.test(size)) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Kids (2-5 years)'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Youth Age (6-15 years)
    else if (/^([6-9]|1[0-5])\/?\d*\s*years?$/i.test(size)) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Youth (6-15 years)'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Women's numeric sizes
    else if (lower.startsWith('wom ')) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Women\'s Numeric'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Footwear (UK) and Socks
    else if (lower.startsWith('socks ') || (lower.startsWith('uk ') && !lower.includes('chest') && !lower.includes('waist'))) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Footwear'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // All measurements: Waist, Chest, Collar
    else if (lower.includes('waist') || lower.includes('chest') ||
             (/^\d+\.?\d*$/.test(size) && parseFloat(size) >= 13 && parseFloat(size) <= 23)) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Measurements (Chest/Waist/Collar)'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Adult standard sizes (XXS-8XL) with ALL fit variants
    else if (/^(xxs|xs|s|m|l|xl|\dxl)/i.test(size) ||
             (/(youth|boys|ly\/xly)$/i.test(size))) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Adult Sizes (XXS-8XL)'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Numeric sizes (6, 8, 10, 12, etc. with fit variants) - exclude collar sizes
    else if (/^\d+/.test(size) && !lower.includes('litre') && !lower.includes('mm') && !lower.includes('cm') &&
             !(parseFloat(size) >= 13 && parseFloat(size) <= 23 && /^\d+\.?\d*$/.test(size))) {
      const baseSize = extractBaseSize(size);
      const map = categoryMap['Numeric Sizes'];
      if (!map.has(baseSize)) map.set(baseSize, []);
      map.get(baseSize)!.push(size);
    }
    // Special sizes
    else if (['one size', 'child', 'infant', 'junior', 'youth'].includes(lower)) {
      const map = categoryMap['One Size / Special'];
      if (!map.has(size)) map.set(size, []);
      map.get(size)!.push(size);
    }
    // Other (paper sizes, dimensions, etc.)
    else {
      const map = categoryMap['Other'];
      if (!map.has(size)) map.set(size, []);
      map.get(size)!.push(size);
    }
  });

  // Convert maps to arrays and sort
  return Object.entries(categoryMap)
    .filter(([_, map]) => map.size > 0)
    .map(([name, map]) => ({
      name,
      items: Array.from(map.entries())
        .map(([baseSize, variants]) => ({
          baseSize,
          variants
        }))
        .sort((a, b) => a.baseSize.localeCompare(b.baseSize, undefined, { numeric: true, sensitivity: 'base' }))
    }));
};

// Grouped Size Mega Menu
interface SizeMegaMenuProps {
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

const SizeMegaMenu: React.FC<SizeMegaMenuProps> = ({
  options,
  selectedValues,
  onToggle,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = selectedValues.length > 0;
  const sizeGroups = categorizeSizes(options);
  const activeGroupData = sizeGroups.find(g => g.name === activeGroup);

  // Filter items in active group by search term
  const filteredItems = searchTerm && activeGroupData
    ? activeGroupData.items.filter(item => item.baseSize.toLowerCase().includes(searchTerm.toLowerCase()))
    : activeGroupData?.items || [];

  // Handle clicking a base size - select all its variants
  const handleBaseSizeClick = (item: { baseSize: string; variants: string[] }) => {
    // Toggle all variants of this base size
    const allVariantsSelected = item.variants.every(v => selectedValues.includes(v));

    item.variants.forEach(variant => {
      if (allVariantsSelected) {
        // If all selected, deselect all
        if (selectedValues.includes(variant)) {
          onToggle(variant);
        }
      } else {
        // If not all selected, select all
        if (!selectedValues.includes(variant)) {
          onToggle(variant);
        }
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          if (next) {
            setActiveGroup(null);
            setSearchTerm('');
          }
        }}
        className={`h-full px-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
          isOpen || hasSelection
            ? 'bg-[#78BE20] text-black'
            : 'bg-transparent text-white hover:bg-[#78BE20] hover:text-black'
        }`}
      >
        SIZE
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-0 bg-[#212121] shadow-2xl z-50 rounded-b-lg overflow-hidden border border-[#383838] ${activeGroupData ? 'min-w-[760px]' : 'min-w-[280px]'}`}>
          <div className="flex">
            {/* Left rail - Size categories */}
            <div className="w-64 bg-[#212121] border-r border-[#383838] max-h-[450px] overflow-y-auto scrollbar-thin">
              {sizeGroups.map((group) => {
                const isActive = group.name === activeGroup;
                const totalVariants = group.items.reduce((sum, item) => sum + item.variants.length, 0);
                return (
                  <button
                    key={group.name}
                    onClick={() => setActiveGroup(group.name)}
                    className={`group relative w-full text-left px-4 py-3 text-[13px] font-bold tracking-wide flex items-center justify-between transition-all ${
                      isActive ? 'bg-[#383838] text-white' : 'text-white/85 hover:bg-[#2b2b2b]'
                    }`}
                    title={`${group.items.length} base sizes (${totalVariants} total variants)`}
                  >
                    <span className="flex-1">{group.name}</span>
                    <span className="text-xs text-white/50">({group.items.length})</span>
                  </button>
                );
              })}
            </div>

            {/* Right panel - Size options */}
            {activeGroupData && (
              <div className="flex-1 bg-[#1a1a1a] p-4 min-h-[320px] max-h-[450px] flex flex-col">
                {/* Search */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search sizes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/10 focus:border-[#78BE20]/50"
                  />
                </div>

                {/* Sizes grid */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredItems.map((item) => {
                      // Check if any variant of this base size is selected
                      const hasSelection = item.variants.some(v => selectedValues.includes(v));
                      const allSelected = item.variants.every(v => selectedValues.includes(v));

                      return (
                        <button
                          key={item.baseSize}
                          onClick={() => handleBaseSizeClick(item)}
                          className={`px-3 py-2 text-sm text-left rounded transition-colors relative ${
                            allSelected
                              ? 'bg-[#78BE20] text-black font-semibold'
                              : hasSelection
                              ? 'bg-[#78BE20]/50 text-black font-semibold'
                              : 'bg-[#212121] text-white hover:bg-[#383838]'
                          }`}
                          title={item.variants.length > 1 ? `Includes: ${item.variants.join(', ')}` : item.baseSize}
                        >
                          {item.baseSize}
                          {item.variants.length > 1 && (
                            <span className="text-xs opacity-60 ml-1">
                              ({item.variants.length})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clear button */}
                {hasSelection && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        onClear();
                        setIsOpen(false);
                      }}
                      className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
                    >
                      Clear all selections
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// More Filters Dropdown
interface MoreFiltersDropdownProps {
  filterOptions: FilterOptions;
  currentFilters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

const MoreFiltersDropdown: React.FC<MoreFiltersDropdownProps> = ({
  filterOptions,
  currentFilters,
  onFiltersChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection =
    (currentFilters.genders && currentFilters.genders.length > 0) ||
    (currentFilters.materials && currentFilters.materials.length > 0) ||
    currentFilters.priceMin !== undefined ||
    currentFilters.priceMax !== undefined;

  const toggleFilter = (key: keyof ProductFilters, value: string) => {
    const current = (currentFilters[key] as string[]) || [];
    const newValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({
      ...currentFilters,
      [key]: newValues.length > 0 ? newValues : undefined
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-full px-4 text-sm font-semibold uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
          isOpen || hasSelection
            ? 'bg-[#78BE20] text-black'
            : 'bg-transparent text-white hover:bg-[#78BE20] hover:text-black'
        }`}
      >
        MORE FILTERS
        <span className="text-xs tracking-widest">•••</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-0 w-80 bg-[#212121] shadow-2xl z-50 max-h-[500px] overflow-y-auto scrollbar-thin rounded-b-lg border border-[#383838]">
          {/* Price Range */}
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-white text-sm mb-3">PRICE RANGE</h3>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="£0"
                  value={currentFilters.priceMin || ''}
                  onChange={(e) => onFiltersChange({
                    ...currentFilters,
                    priceMin: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/10 focus:border-[#78BE20]/50"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/50 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={currentFilters.priceMax || ''}
                  onChange={(e) => onFiltersChange({
                    ...currentFilters,
                    priceMax: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/10 focus:border-[#78BE20]/50"
                />
              </div>
            </div>
          </div>

          {/* Genders */}
          {filterOptions.genders.length > 0 && (
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white text-sm mb-3">GENDER</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.genders.map((gender) => {
                  const isSelected = currentFilters.genders?.includes(gender);
                  return (
                    <button
                      key={gender}
                      onClick={() => toggleFilter('genders', gender)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        isSelected
                          ? 'bg-[#78BE20] text-black'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {gender}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Materials */}
          {filterOptions.materials.length > 0 && (
            <div className="p-4">
              <h3 className="font-bold text-white text-sm mb-3">MATERIAL</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.materials.slice(0, 12).map((material) => {
                  const isSelected = currentFilters.materials?.includes(material);
                  return (
                    <button
                      key={material}
                      onClick={() => toggleFilter('materials', material)}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        isSelected
                          ? 'bg-[#78BE20] text-black'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      {material}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

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
    brandOptions: [],
    genders: [],
    ageGroups: [],
    accreditations: []
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [relevantSizes, setRelevantSizes] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');

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

  // Load relevant sizes when product types change
  useEffect(() => {
    const loadRelevantSizes = async () => {
      if (currentFilters.productTypes && currentFilters.productTypes.length > 0) {
        const sizes = await getSizesForProductTypes(currentFilters.productTypes);
        setRelevantSizes(sizes);
      } else {
        setRelevantSizes([]);
      }
    };
    loadRelevantSizes();
  }, [currentFilters.productTypes]);

  // Debounced search - update filters when search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFiltersChange({
        ...currentFilters,
        searchQuery: searchInput.trim() || undefined
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

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

  const loadProducts = useCallback(async (filters: ProductFilters, page: number = 1, sizeOverride?: number) => {
    try {
      setLoading(true);
      const effectivePageSize = sizeOverride ?? pageSize;
      const response = await getAllProducts(filters, page, effectivePageSize);

      console.log('📦 ProductBrowser: Received products from API:', {
        totalProducts: response.products.length,
        page,
        pageSize,
        totalCount: response.totalCount,
        totalPages: response.totalPages
      });

      setAllProducts(response.products);
      const groups = groupProductsByStyle(response.products);

      console.log('📦 ProductBrowser: Grouped products:', {
        totalGroups: groups.length,
        styleCodes: groups.map(g => g.style_code)
      });

      setProductGroups(groups);
      setCurrentPage(page);

      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setHasMoreProducts(response.hasNextPage);

    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, groupProductsByStyle]);

  // Initial load
  useEffect(() => {
    loadProducts(currentFilters, 1);
  }, []);

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setCurrentFilters(newFilters);
    setCurrentPage(1);
    loadProducts(newFilters, 1);
  };

  const clearAllFilters = () => {
    setCurrentFilters({});
    setSearchInput('');
    setCurrentPage(1);
    loadProducts({}, 1);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.searchQuery) count++;
    if (currentFilters.productTypes?.length) count += currentFilters.productTypes.length;
    if (currentFilters.brands?.length) count += currentFilters.brands.length;
    if (currentFilters.colors?.length) count += currentFilters.colors.length;
    if (currentFilters.sizes?.length) count += currentFilters.sizes.length;
    if (currentFilters.genders?.length) count += currentFilters.genders.length;
    if (currentFilters.materials?.length) count += currentFilters.materials.length;
    if (currentFilters.priceMin !== undefined || currentFilters.priceMax !== undefined) count++;
    return count;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1600px] mx-auto px-4 py-4">

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <span className="text-xs text-white/50 uppercase font-semibold tracking-wider">ACTIVE FILTERS</span>

            {/* Product Type Badges */}
            {currentFilters.productTypes?.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#78BE20] text-black text-sm font-bold uppercase tracking-wide"
              >
                {type}
                <button
                  onClick={() => {
                    const newTypes = currentFilters.productTypes?.filter(t => t !== type);
                    handleFiltersChange({
                      ...currentFilters,
                      productTypes: newTypes?.length ? newTypes : undefined
                    });
                  }}
                  className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}

            {/* Brand Badges */}
            {currentFilters.brands?.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#78BE20] text-black text-sm font-bold uppercase tracking-wide"
              >
                {brand}
                <button
                  onClick={() => {
                    const newBrands = currentFilters.brands?.filter(b => b !== brand);
                    handleFiltersChange({
                      ...currentFilters,
                      brands: newBrands?.length ? newBrands : undefined
                    });
                  }}
                  className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}

            {/* Color Badges */}
            {currentFilters.colors?.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#78BE20] text-black text-sm font-bold uppercase tracking-wide"
              >
                {color}
                <button
                  onClick={() => {
                    const newColors = currentFilters.colors?.filter(c => c !== color);
                    handleFiltersChange({
                      ...currentFilters,
                      colors: newColors?.length ? newColors : undefined
                    });
                  }}
                  className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}

            {/* Size Badges */}
            {currentFilters.sizes?.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#78BE20] text-black text-sm font-bold uppercase tracking-wide"
              >
                {size}
                <button
                  onClick={() => {
                    const newSizes = currentFilters.sizes?.filter(s => s !== size);
                    handleFiltersChange({
                      ...currentFilters,
                      sizes: newSizes?.length ? newSizes : undefined
                    });
                  }}
                  className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}

            {/* Clear All Button */}
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-colors ml-2"
            >
              <X size={14} />
              CLEAR ALL
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-white/10 mb-6">
          <div className="flex h-12">
            {/* Filters Label */}
            <span className="flex items-center gap-2 text-white/50 uppercase text-xs font-semibold tracking-wider mr-4 px-4">
              <FilterIcon className="w-4 h-4" />
              FILTERS
            </span>

            {/* Filter Buttons */}
            <div className="flex h-full">
              {/* Product Type */}
              {filterOptions.productTypes.length > 0 && (
                <ProductTypeMegaMenu
                  options={filterOptions.productTypes}
                  selectedValues={currentFilters.productTypes || []}
                  onToggleGroup={(items) => {
                    handleFiltersChange({
                      ...currentFilters,
                      productTypes: items
                    });
                  }}
                />
              )}

              {/* Colour */}
              {filterOptions.colors.length > 0 && (
                <ColourMegaMenu
                  options={filterOptions.colors}
                  selectedValues={currentFilters.colors || []}
                  onToggle={(value) => {
                    const current = currentFilters.colors || [];
                    const newValues = current.includes(value)
                      ? current.filter(v => v !== value)
                      : [...current, value];
                    handleFiltersChange({
                      ...currentFilters,
                      colors: newValues.length > 0 ? newValues : undefined
                    });
                  }}
                  onClear={() => handleFiltersChange({ ...currentFilters, colors: undefined })}
                />
              )}

              {/* Brand */}
              {(filterOptions.brandOptions?.length > 0 || filterOptions.brands?.length > 0) && (
                <BrandMegaMenu
                  brands={filterOptions.brandOptions?.length > 0 
                    ? filterOptions.brandOptions 
                    : filterOptions.brands.map((name, i) => ({ id: `brand-${i}`, name }))
                  }
                  selectedValues={currentFilters.brands || []}
                  onToggle={(value) => {
                    const current = currentFilters.brands || [];
                    const newValues = current.includes(value)
                      ? current.filter(v => v !== value)
                      : [...current, value];
                    handleFiltersChange({
                      ...currentFilters,
                      brands: newValues.length > 0 ? newValues : undefined
                    });
                  }}
                  onClear={() => handleFiltersChange({ ...currentFilters, brands: undefined })}
                />
              )}

              {/* Size - Only show when product type is selected */}
              {relevantSizes.length > 0 && currentFilters.productTypes && currentFilters.productTypes.length > 0 && (
                <SizeMegaMenu
                  options={relevantSizes}
                  selectedValues={currentFilters.sizes || []}
                  onToggle={(value) => {
                    const current = currentFilters.sizes || [];
                    const newValues = current.includes(value)
                      ? current.filter(v => v !== value)
                      : [...current, value];
                    handleFiltersChange({
                      ...currentFilters,
                      sizes: newValues.length > 0 ? newValues : undefined
                    });
                  }}
                  onClear={() => handleFiltersChange({ ...currentFilters, sizes: undefined })}
                />
              )}

              {/* More Filters */}
              <MoreFiltersDropdown
                filterOptions={filterOptions}
                currentFilters={currentFilters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Right Side: Search & Smart Search */}
          <div className="flex items-center gap-4">
            {/* AJAX Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-10 py-2 bg-[#1a1a1a] border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#78BE20] focus:bg-[#202020] w-64 transition-colors"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="border-l border-white/20 pl-4 flex items-center gap-3">
              <span className="text-xs text-white/50 uppercase tracking-wide">STUCK FOR IDEAS?</span>
              <button
                onClick={() => setIsSmartSearchOpen(true)}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm rounded transition-colors flex items-center gap-2"
              >
                Use Smartsearch
                <Lightbulb size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : productGroups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No products found matching your filters.</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-6 py-3 bg-[#78BE20] text-black font-bold rounded hover:bg-[#6da71d] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-6'
            }>
              {productGroups.map((group) => (
                <ProductCard
                  key={group.style_code}
                  productGroup={group}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between bg-[#111] border border-white/10 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <span>Page</span>
                  <select
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value, 10);
                      setCurrentPage(page);
                      loadProducts(currentFilters, page);
                    }}
                    className="bg-[#1a1a1a] text-white border border-white/20 rounded px-2 py-1 text-sm"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <span>of {totalPages}</span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-white/70 text-sm">Per page:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const size = parseInt(e.target.value, 10);
                      setPageSize(size);
                      setCurrentPage(1);
                      loadProducts(currentFilters, 1, size);
                    }}
                    className="bg-[#1a1a1a] text-white border border-white/20 rounded px-2 py-1 text-sm"
                  >
                    {[20, 30, 50].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (currentPage > 1) {
                          const prev = currentPage - 1;
                          setCurrentPage(prev);
                          loadProducts(currentFilters, prev);
                        }
                      }}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded bg-[#1a1a1a] border border-white/20 text-white text-sm ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#2a2a2a]'}`}
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => {
                        if (currentPage < totalPages) {
                          const next = currentPage + 1;
                          setCurrentPage(next);
                          loadProducts(currentFilters, next);
                        }
                      }}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded bg-[#1a1a1a] border border-white/20 text-white text-sm ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#2a2a2a]'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Smart Search Modal */}
      <SmartSearchModal
        isOpen={isSmartSearchOpen}
        onClose={() => setIsSmartSearchOpen(false)}
        onApplySearch={(query: string, filters: ProductFilters) => {
          handleFiltersChange({ ...currentFilters, ...filters, searchQuery: query });
          setIsSmartSearchOpen(false);
        }}
      />
    </div>
  );
};

export default ProductBrowser;

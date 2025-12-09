import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TopsIcon,
  OuterwearIcon,
  BottomsIcon,
  WorkwearIcon,
  HeadwearIcon,
  FootwearIcon,
  BagsIcon,
  AccessoriesIcon,
  UnderwearIcon,
  HomeGiftsIcon
} from './ProductTypeIcons';

// Product Type Groups - matched to actual database product_type values
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
    items: ['Trousers', 'Shorts', 'Skirts', 'Leggings', 'Sweatpants', 'Chinos', 'Jeans', 'Trackwear']
  },
  {
    name: 'WORKWEAR',
    Icon: WorkwearIcon,
    items: ['Aprons', 'Tabards', 'Bibs', 'Chef Jackets', 'Safety Vests', 'Coveralls']
  },
  {
    name: 'HEADWEAR',
    Icon: HeadwearIcon,
    items: ['Caps', 'Beanies', 'Hats', 'Headbands', 'Snoods']
  },
  {
    name: 'FOOTWEAR',
    Icon: FootwearIcon,
    items: ['Shoes', 'Boots', 'Trainers', 'Slippers', 'Socks']
  },
  {
    name: 'BAGS & CASES',
    Icon: BagsIcon,
    items: ['Bags', 'Laptop Cases', 'Pencil Cases', 'Document Wallets', 'Wallets']
  },
  {
    name: 'ACCESSORIES',
    Icon: AccessoriesIcon,
    items: ['Accessories', 'Scarves', 'Gloves', 'Belts', 'Ties', 'Umbrellas']
  },
  {
    name: 'UNDERWEAR',
    Icon: UnderwearIcon,
    items: ['Boxers', 'Bodysuits', 'Bras', 'Robes', 'Pyjamas', 'Loungewear Bottoms']
  },
  {
    name: 'HOME & GIFTS',
    Icon: HomeGiftsIcon,
    items: ['Towels', 'Blankets', 'Cushions', 'Cushion Covers', 'Bottles', 'Keyrings', 'Soft Toys']
  }
];

const CategoryNavigationBar: React.FC = () => {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleItemClick = (productType: string) => {
    // Navigate to ClothingBrowser with single filter
    navigate(`/clothing?productTypes=${encodeURIComponent(productType)}`);
  };

  const handleGroupClick = (items: string[]) => {
    // Navigate to ClothingBrowser with all items in the group
    navigate(`/clothing?productTypes=${items.map(encodeURIComponent).join(',')}`);
  };

  return (
    <nav className="w-full bg-[#1a1a1a] border-b border-white/10 overflow-visible">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 overflow-visible">
        <div className="flex items-center justify-center overflow-visible">
          {PRODUCT_TYPE_GROUPS.map((group) => {
            const isHovered = hoveredGroup === group.name;
            const Icon = group.Icon;

            return (
              <div
                key={group.name}
                className="relative flex-shrink-0"
                onMouseEnter={() => setHoveredGroup(group.name)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                {/* Main Button */}
                <button
                  className="flex flex-col items-center gap-2 px-4 py-4 transition-all duration-300 group min-w-[100px]"
                  onClick={() => handleGroupClick(group.items)}
                >
                  {/* Icon Container */}
                  <div className={`relative transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    <Icon
                      className={`w-6 h-6 transition-all duration-300 ${
                        isHovered ? 'text-[#78BE20]' : 'text-white/70 group-hover:text-white'
                      }`}
                    />
                    {/* Animated circle background */}
                    <div
                      className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${
                        isHovered ? 'bg-[#78BE20]/20 scale-150' : 'bg-transparent scale-100'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      isHovered ? 'text-[#78BE20]' : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    {group.name}
                  </span>

                  {/* Underline indicator */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#78BE20] transition-all duration-300 ${
                      isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50 transition-all duration-300 ${
                    isHovered
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl p-3 min-w-[240px] max-w-[280px] backdrop-blur-xl">
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#111] border-l border-t border-white/10 rotate-45" />

                    {/* Items */}
                    <div className="relative space-y-0.5">
                      {group.items.map((item, index) => (
                        <button
                          key={item}
                          onClick={() => handleItemClick(item)}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-[#78BE20] hover:bg-white/5 transition-all duration-200 group/item"
                          style={{
                            animationDelay: `${index * 30}ms`,
                            animation: isHovered ? 'slideIn 0.3s ease-out forwards' : 'none'
                          }}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-white/40 group-hover/item:bg-[#78BE20] transition-colors" />
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      ` }} />
    </nav>
  );
};

export default CategoryNavigationBar;

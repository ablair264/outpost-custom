import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoriesWithCounts, CategoryData } from '../lib/supabase';
import { ArrowRight, Sparkles, Grid3X3, Play } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  imageUrl: string;
  productCount: number;
  group: string;
}

// Category group definitions with metadata
const GROUP_METADATA: Record<string, {
  title: string;
  subtitle: string;
  gradient: string;
  accentColor: string;
}> = {
  'Clothing': {
    title: 'Clothing',
    subtitle: 'Premium apparel for every occasion',
    gradient: 'from-[#78BE20]/20 via-transparent to-transparent',
    accentColor: '#78BE20'
  },
  'Headwear': {
    title: 'Headwear',
    subtitle: 'Caps, beanies, and everything in between',
    gradient: 'from-blue-500/20 via-transparent to-transparent',
    accentColor: '#3B82F6'
  },
  'Bags': {
    title: 'Bags & Accessories',
    subtitle: 'Carry your brand everywhere',
    gradient: 'from-purple-500/20 via-transparent to-transparent',
    accentColor: '#8B5CF6'
  },
  'Workwear': {
    title: 'Workwear',
    subtitle: 'Professional and durable workwear',
    gradient: 'from-orange-500/20 via-transparent to-transparent',
    accentColor: '#F97316'
  },
  'Sports': {
    title: 'Sports & Activewear',
    subtitle: 'Performance gear for athletes',
    gradient: 'from-cyan-500/20 via-transparent to-transparent',
    accentColor: '#06B6D4'
  },
  'default': {
    title: 'Other Categories',
    subtitle: 'Explore more options',
    gradient: 'from-[#78BE20]/20 via-transparent to-transparent',
    accentColor: '#78BE20'
  }
};

// Bento card component
const BentoCard: React.FC<{
  category: Category;
  size: 'large' | 'medium' | 'small';
  accentColor: string;
}> = ({ category, size, accentColor }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    large: 'col-span-2 row-span-2 min-h-[400px]',
    medium: 'col-span-1 row-span-2 min-h-[400px]',
    small: 'col-span-1 row-span-1 min-h-[190px]'
  };

  const titleSizes = {
    large: 'text-2xl md:text-3xl',
    medium: 'text-xl md:text-2xl',
    small: 'text-lg'
  };

  return (
    <div
      onClick={() => navigate(`/browse?productTypes=${encodeURIComponent(category.name)}`)}
      className={`${sizeClasses[size]} relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
      style={{
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 20px 40px -20px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={category.imageUrl}
          alt={category.displayName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/800x600/1a1a1a/78BE20?text=${encodeURIComponent(category.displayName)}`;
          }}
        />
      </div>

      {/* Video indicator (placeholder for future) */}
      {false && (
        <div className="absolute top-4 right-4 z-20">
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Play size={16} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)`
        }}
      />

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}15 0%, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Product count badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300 group-hover:scale-105"
          style={{
            background: `${accentColor}20`,
            color: accentColor,
            border: `1px solid ${accentColor}30`
          }}
        >
          {category.productCount.toLocaleString()} products
        </div>

        {/* Title and description */}
        <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
          <h3 className={`${titleSizes[size]} font-bold text-white mb-2 leading-tight`}>
            {category.displayName}
          </h3>

          {size !== 'small' && category.description && (
            <p className="text-sm text-white/60 mb-3 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* CTA */}
          <div
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
            style={{ color: accentColor }}
          >
            <span>Explore</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${accentColor}40, 0 0 30px ${accentColor}20`
        }}
      />
    </div>
  );
};

// Group section component with bento layout
const CategoryGroupSection: React.FC<{
  groupName: string;
  categories: Category[];
  isFirst: boolean;
}> = ({ groupName, categories, isFirst }) => {
  const metadata = GROUP_METADATA[groupName] || GROUP_METADATA['default'];

  // Create bento layout pattern based on number of categories
  const getBentoPattern = (count: number): ('large' | 'medium' | 'small')[] => {
    if (count === 1) return ['large'];
    if (count === 2) return ['large', 'medium'];
    if (count === 3) return ['large', 'medium', 'small'];
    if (count === 4) return ['large', 'small', 'small', 'medium'];
    if (count === 5) return ['large', 'medium', 'small', 'small', 'small'];
    if (count === 6) return ['large', 'medium', 'small', 'small', 'small', 'small'];
    // For more items, repeat the pattern
    const basePattern: ('large' | 'medium' | 'small')[] = ['large', 'medium', 'small', 'small', 'medium', 'small'];
    const pattern: ('large' | 'medium' | 'small')[] = [];
    for (let i = 0; i < count; i++) {
      pattern.push(basePattern[i % basePattern.length]);
    }
    return pattern;
  };

  const pattern = getBentoPattern(categories.length);

  return (
    <section className={`relative ${isFirst ? 'pt-0' : 'pt-20'}`}>
      {/* Section background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${metadata.gradient} opacity-30 pointer-events-none`}
        style={{ top: '-100px', height: 'calc(100% + 200px)' }}
      />

      {/* Section header */}
      <div className="relative mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: metadata.accentColor }}
          />
          <span
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: metadata.accentColor }}
          >
            {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          {metadata.title}
        </h2>

        <p className="text-lg text-white/50 max-w-xl">
          {metadata.subtitle}
        </p>
      </div>

      {/* Bento grid */}
      <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[190px]">
        {categories.map((category, index) => (
          <BentoCard
            key={category.id}
            category={category}
            size={pattern[index] || 'small'}
            accentColor={metadata.accentColor}
          />
        ))}
      </div>
    </section>
  );
};

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await getCategoriesWithCounts();

        const formattedCategories: Category[] = categoryData
          .filter(cat => cat.is_active && cat.product_count > 0)
          .map(cat => ({
            id: cat.id,
            name: cat.category_key,
            displayName: cat.display_name,
            description: cat.description,
            imageUrl: cat.image_url
              ? cat.image_url.replace(/\s+/g, '').trim()
              : `https://via.placeholder.com/800x600/1a1a1a/78BE20?text=${encodeURIComponent(cat.display_name)}`,
            productCount: cat.product_count,
            group: cat.category_group || 'default'
          }))
          .sort((a, b) => b.productCount - a.productCount);

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Group categories by category_group
  const groupedCategories = useMemo(() => {
    const groups: Record<string, Category[]> = {};

    categories.forEach(cat => {
      const group = cat.group || 'default';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(cat);
    });

    // Sort groups by total product count
    return Object.entries(groups)
      .sort((a, b) => {
        const countA = a[1].reduce((sum, cat) => sum + cat.productCount, 0);
        const countB = b[1].reduce((sum, cat) => sum + cat.productCount, 0);
        return countB - countA;
      });
  }, [categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#78BE20] border-t-transparent animate-spin" />
          <p className="text-white/60 text-sm font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#78BE20]/5 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] translate-x-1/2" />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Header */}
        <header className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#78BE20]/10 to-[#78BE20]/5 border border-[#78BE20]/20 mb-6">
            <Sparkles size={14} className="text-[#78BE20]" />
            <span className="text-xs font-semibold text-[#78BE20] uppercase tracking-wider">
              Shop by Category
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Explore Our
            <span className="block bg-gradient-to-r from-[#78BE20] to-[#5a9a10] bg-clip-text text-transparent">
              Product Range
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Browse through our curated collection of customisable products,
            organised by category for easy navigation.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 pt-10 border-t border-white/5">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {categories.length}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#78BE20] mb-1">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {groupedCategories.length}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-wider">Collections</div>
            </div>
          </div>
        </header>

        {/* Quick nav pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {groupedCategories.map(([groupName]) => {
            const metadata = GROUP_METADATA[groupName] || GROUP_METADATA['default'];
            return (
              <a
                key={groupName}
                href={`#${groupName.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: `${metadata.accentColor}15`,
                  color: metadata.accentColor,
                  border: `1px solid ${metadata.accentColor}30`,
                }}
              >
                {metadata.title}
              </a>
            );
          })}
        </div>

        {/* Category sections */}
        <div className="space-y-24">
          {groupedCategories.map(([groupName, cats], index) => (
            <div key={groupName} id={groupName.toLowerCase().replace(/\s+/g, '-')}>
              <CategoryGroupSection
                groupName={groupName}
                categories={cats}
                isFirst={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-20">
            <Grid3X3 size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50 text-lg">No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryGrid;

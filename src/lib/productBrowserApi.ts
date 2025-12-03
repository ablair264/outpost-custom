import { supabase } from './supabase';
import { Product } from './supabase';

export interface ProductFilters {
  searchQuery?: string;
  productTypes?: string[];
  sizes?: string[];
  colors?: string[];
  colorShades?: string[];
  categories?: string[];
  materials?: string[];
  brands?: string[];
  genders?: string[];
  ageGroups?: string[];
  sustainableOrganic?: string[];
  accreditations?: string[];
  priceMin?: number;
  priceMax?: number;
}

export interface ProductsResponse {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BrandOption {
  id: string;
  name: string;
  logo_url?: string;
}

export interface FilterOptions {
  materials: string[];
  categories: string[];
  priceRange: { min: number; max: number };
  productTypes: string[];
  sizes: string[];
  colors: string[];
  colorShades: string[];
  brands: string[];
  brandOptions: BrandOption[];
  genders: string[];
  ageGroups: string[];
  accreditations: string[];
}

export async function getAllProducts(
  filters: ProductFilters = {},
  page: number = 1,
  pageSize: number = 12
): Promise<ProductsResponse> {
  try {
    console.log('🗄️ Database query starting with filters:', filters);

    // Use the optimized product_styles table instead of product_data
    let stylesQuery = supabase
      .from('product_styles')
      .select('*', { count: 'exact' });

    // Apply filters - much faster with the aggregated table
    if (filters.searchQuery) {
      // Use full-text search instead of ilike
      const searchTerms = filters.searchQuery
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !['the', 'and', 'for', 'with', 'need', 'want', 'looking'].includes(word))
        .join(' & ');

      if (searchTerms) {
        stylesQuery = stylesQuery.textSearch('search_vector', searchTerms);
      }
    }

    if (filters.productTypes?.length) {
      stylesQuery = stylesQuery.in('product_type', filters.productTypes);
    }

    if (filters.brands?.length) {
      stylesQuery = stylesQuery.in('brand', filters.brands);
    }

    if (filters.genders?.length) {
      stylesQuery = stylesQuery.in('gender', filters.genders);
    }

    if (filters.ageGroups?.length) {
      stylesQuery = stylesQuery.in('age_group', filters.ageGroups);
    }

    if (filters.sustainableOrganic?.length) {
      stylesQuery = stylesQuery.in('sustainable_organic', filters.sustainableOrganic);
    }

    // Price range filtering on aggregated min/max prices
    if (filters.priceMin !== undefined) {
      stylesQuery = stylesQuery.gte('price_min', filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      stylesQuery = stylesQuery.lte('price_max', filters.priceMax);
    }

    // Array containment for sizes and colors (much faster with GIN indexes)
    if (filters.sizes?.length) {
      stylesQuery = stylesQuery.overlaps('available_sizes', filters.sizes);
    }

    if (filters.colors?.length) {
      stylesQuery = stylesQuery.overlaps('available_colors', filters.colors);
    }

    if (filters.colorShades?.length) {
      stylesQuery = stylesQuery.overlaps('color_shades', filters.colorShades);
    }

    // Text search filters (still using ilike but on fewer rows)
    if (filters.materials?.length) {
      const materialConditions = filters.materials.map(material =>
        `fabric.ilike.%${material}%`
      ).join(',');
      stylesQuery = stylesQuery.or(materialConditions);
    }

    if (filters.categories?.length) {
      const categoryConditions = filters.categories.map(category =>
        `categorisation.ilike.%${category}%`
      ).join(',');
      stylesQuery = stylesQuery.or(categoryConditions);
    }

    if (filters.accreditations?.length) {
      const accredConditions = filters.accreditations.map(accred =>
        `accreditations.ilike.%${accred}%`
      ).join(',');
      stylesQuery = stylesQuery.or(accredConditions);
    }

    // Apply pagination and ordering
    const startIndex = (page - 1) * pageSize;
    stylesQuery = stylesQuery
      .order('price_min', { ascending: true })
      .range(startIndex, startIndex + pageSize - 1);

    const { data: styles, count, error } = await stylesQuery;

    if (error) {
      console.error('❌ Error fetching styles:', error);
      throw error;
    }

    console.log('📊 Query result:', {
      stylesFound: styles?.length || 0,
      totalCount: count || 0,
      page,
      pageSize
    });

    // Fetch all variants for the matched styles
    const styleCodesInPage = styles?.map(s => s.style_code) || [];

    let productsQuery = supabase
      .from('product_data')
      .select('*')
      .in('style_code', styleCodesInPage)
      .order('style_code', { ascending: true })
      .order('id', { ascending: true });

    const { data: products, error: productsError } = await productsQuery;

    if (productsError) {
      console.error('❌ Error fetching product variants:', productsError);
      throw productsError;
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return {
      products: products || [],
      totalCount: count || 0,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false
    };
  }
}

export async function getFilterOptions(): Promise<FilterOptions> {
  try {
    // Use the optimized product_styles table for much faster filter option loading
    const [
      productTypesResult,
      brandsResult,
      gendersResult,
      ageGroupsResult,
      priceRangeResult,
      sizesResult,
      colorsResult,
      colorShadesResult,
      materialsResult,
      brandLogosResult
    ] = await Promise.all([
      // Get distinct values from product_styles (much smaller table)
      // Using range(0, 9999) to get all rows (product_styles only has ~4K rows)
      supabase.from('product_styles').select('product_type').not('product_type', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('brand').not('brand', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('gender').not('gender', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('age_group').not('age_group', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('price_min, price_max').not('price_min', 'is', null).range(0, 9999),

      // Get aggregated arrays from product_styles
      supabase.from('product_styles').select('available_sizes').not('available_sizes', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('available_colors').not('available_colors', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('color_shades').not('color_shades', 'is', null).range(0, 9999),
      supabase.from('product_styles').select('fabric').not('fabric', 'is', null).limit(500),

      // Get brand logos
      supabase.from('brand_logos').select('*').order('name')
    ]);

    // Extract unique product types
    const productTypes = Array.from(
      new Set(productTypesResult.data?.map(p => p.product_type).filter(Boolean) || [])
    ).sort();

    // Extract unique brands
    const brandsFromStyles = Array.from(
      new Set(brandsResult.data?.map(p => p.brand).filter(Boolean) || [])
    ).sort();

    // Build brand options with logos
    let brandOptions: BrandOption[] = [];
    if (brandLogosResult.data && brandLogosResult.data.length > 0) {
      const logoMap = new Map(
        brandLogosResult.data.map(b => [b.name, b.logo_url])
      );

      brandOptions = brandsFromStyles.map((name, index) => ({
        id: logoMap.has(name) ? `brand-${name}` : `fallback-${index}`,
        name,
        logo_url: logoMap.get(name) || undefined
      }));
    } else {
      brandOptions = brandsFromStyles.map((name, index) => ({
        id: `brand-${index}`,
        name
      }));
    }

    // Extract unique genders and age groups
    const genders = Array.from(
      new Set(gendersResult.data?.map(p => p.gender).filter(Boolean) || [])
    ).sort();

    const ageGroups = Array.from(
      new Set(ageGroupsResult.data?.map(p => p.age_group).filter(Boolean) || [])
    ).sort();

    // Calculate price range from aggregated min/max
    const priceMin = Math.floor(
      Math.min(...(priceRangeResult.data?.map(p => p.price_min).filter(Boolean) || [0]))
    );
    const priceMax = Math.ceil(
      Math.max(...(priceRangeResult.data?.map(p => p.price_max).filter(Boolean) || [1000]))
    );
    const priceRange = { min: priceMin, max: priceMax };

    // Flatten arrays to get unique sizes, colors, and shades
    const sizes = Array.from(
      new Set(
        sizesResult.data?.flatMap(p => p.available_sizes || []).filter(Boolean) || []
      )
    ).sort();

    const colors = Array.from(
      new Set(
        colorsResult.data?.flatMap(p => p.available_colors || []).filter(Boolean) || []
      )
    ).sort();

    const colorShades = Array.from(
      new Set(
        colorShadesResult.data?.flatMap(p => p.color_shades || []).filter(Boolean) || []
      )
    ).sort();

    // Extract materials from fabric field (limited sample)
    const materials = new Set<string>();
    const commonMaterials = [
      'Cotton', 'Polyester', 'Wool', 'Denim', 'Fleece', 'Canvas',
      'Merino', 'Terry Cloth', 'Jersey', 'Teddy', 'Corduroy', 'Leather',
      'Twill', 'French Terry', 'Silk', 'Linen', 'Nylon', 'Viscose',
      'Acrylic', 'Spandex', 'Elastane', 'Polyamide', 'Modal', 'Bamboo'
    ];

    materialsResult.data?.forEach(product => {
      if (product.fabric) {
        commonMaterials.forEach(material => {
          if (product.fabric.toLowerCase().includes(material.toLowerCase())) {
            materials.add(material);
          }
        });
      }
    });

    console.log('📊 Filter options loaded (optimized):', {
      productTypesCount: productTypes.length,
      sizesCount: sizes.length,
      colorsCount: colors.length,
      brandsCount: brandsFromStyles.length,
      brandOptionsCount: brandOptions.length,
      gendersCount: genders.length,
      ageGroupsCount: ageGroups.length,
      materialsCount: materials.size
    });

    return {
      materials: Array.from(materials).sort(),
      categories: [],
      priceRange,
      productTypes,
      sizes,
      colors,
      colorShades,
      brands: brandsFromStyles,
      brandOptions,
      genders,
      ageGroups,
      accreditations: []
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {
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
    };
  }
}

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
    // Filter out discontinued products by default
    let stylesQuery = supabase
      .from('product_styles')
      .select('*', { count: 'exact' })
      .eq('is_live', true);

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

    // Fetch all variants for the matched styles (excluding discontinued)
    const styleCodesInPage = styles?.map(s => s.style_code) || [];

    let productsQuery = supabase
      .from('product_data')
      .select('*')
      .in('style_code', styleCodesInPage)
      .neq('sku_status', 'Discontinued')
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

// Get sizes available for specific product types
export async function getSizesForProductTypes(productTypes: string[]): Promise<string[]> {
  if (!productTypes || productTypes.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('product_styles')
      .select('available_sizes')
      .in('product_type', productTypes);

    if (error) {
      console.error('Error fetching sizes for product types:', error);
      return [];
    }

    // Flatten and deduplicate all sizes
    const allSizes = new Set<string>();
    data?.forEach(row => {
      if (row.available_sizes) {
        row.available_sizes.forEach((size: string) => allSizes.add(size));
      }
    });

    return Array.from(allSizes).sort();
  } catch (error) {
    console.error('Error in getSizesForProductTypes:', error);
    return [];
  }
}

export async function getFilterOptions(): Promise<FilterOptions> {
  try {
    // Use RPC to call the optimized PostgreSQL function for distinct values
    // This ensures we get ALL distinct values without pagination limits
    const { data: filterData, error: rpcError } = await supabase.rpc('get_filter_options');

    if (rpcError) {
      console.error('RPC error:', rpcError);
      throw rpcError;
    }

    // Get additional data
    const [brandLogosResult, materialsResult] = await Promise.all([
      supabase.from('brand_logos').select('*').order('name'),
      supabase.rpc('extract_materials')
    ]);

    // Parse the JSON response from the function
    const productTypes = (filterData?.productTypes as string[]) || [];
    const brandsFromDB = (filterData?.brands as string[]) || [];
    const genders = (filterData?.genders as string[]) || [];
    const ageGroups = (filterData?.ageGroups as string[]) || [];
    const priceRange = (filterData?.priceRange as { min: number; max: number }) || { min: 0, max: 1000 };
    const sizes = (filterData?.sizes as string[]) || [];
    const colors = (filterData?.colors as string[]) || [];
    const colorShades = (filterData?.colorShades as string[]) || [];
    const materials = (materialsResult.data as string[]) || [];

    // Build brand options with logos
    let brandOptions: BrandOption[] = [];
    if (brandLogosResult.data && brandLogosResult.data.length > 0) {
      const logoMap = new Map(
        brandLogosResult.data.map(b => [b.name, b.logo_url])
      );

      brandOptions = brandsFromDB.map((name, index) => ({
        id: logoMap.has(name) ? `brand-${name}` : `fallback-${index}`,
        name,
        logo_url: logoMap.get(name) || undefined
      }));
    } else {
      brandOptions = brandsFromDB.map((name, index) => ({
        id: `brand-${index}`,
        name
      }));
    }

    console.log('📊 Filter options loaded (optimized with RPC):', {
      productTypesCount: productTypes.length,
      sizesCount: sizes.length,
      colorsCount: colors.length,
      brandsCount: brandsFromDB.length,
      brandOptionsCount: brandOptions.length,
      gendersCount: genders.length,
      ageGroupsCount: ageGroups.length,
      materialsCount: materials.length
    });

    return {
      materials: materials.sort(),
      categories: [],
      priceRange,
      productTypes: productTypes.sort(),
      sizes: sizes.sort(),
      colors: colors.sort(),
      colorShades: colorShades.sort(),
      brands: brandsFromDB.sort(),
      brandOptions,
      genders: genders.sort(),
      ageGroups: ageGroups.sort(),
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

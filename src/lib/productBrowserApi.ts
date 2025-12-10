// Product Browser API - connects to Neon via Netlify Functions
import { Product } from './supabase';

const API_BASE = '/.netlify/functions/products';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

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

    // Build query params
    const params = new URLSearchParams();

    if (filters.productTypes?.length) {
      params.set('productType', filters.productTypes.join(','));
    }
    if (filters.brands?.length) {
      params.set('brand', filters.brands.join(','));
    }
    if (filters.genders?.length) {
      params.set('gender', filters.genders.join(','));
    }
    if (filters.sizes?.length) {
      params.set('sizes', filters.sizes.join(','));
    }
    if (filters.colors?.length) {
      params.set('colors', filters.colors.join(','));
    }
    if (filters.priceMin !== undefined) {
      params.set('priceMin', filters.priceMin.toString());
    }
    if (filters.priceMax !== undefined) {
      params.set('priceMax', filters.priceMax.toString());
    }
    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
    }

    params.set('limit', pageSize.toString());
    params.set('offset', ((page - 1) * pageSize).toString());

    // First get the styles
    const stylesResponse = await apiFetch<{
      success: boolean;
      styles: any[];
      total: number;
      totalPages: number;
      currentPage: number;
    }>(`/styles?${params.toString()}`);

    if (!stylesResponse.success || !stylesResponse.styles?.length) {
      return {
        products: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false
      };
    }

    // Get variants for these styles
    const styleCodes = stylesResponse.styles.map(s => s.style_code);
    const variantsParams = new URLSearchParams();
    variantsParams.set('styleCode', styleCodes[0]); // For now, get one at a time or batch

    // Fetch all variants for the matched styles
    const allProducts: Product[] = [];
    for (const style of stylesResponse.styles) {
      try {
        const variantsResponse = await apiFetch<{ success: boolean; products: Product[] }>(
          `/styles/${encodeURIComponent(style.style_code)}/variants`
        );
        if (variantsResponse.products) {
          allProducts.push(...variantsResponse.products);
        }
      } catch (e) {
        console.warn(`Failed to fetch variants for ${style.style_code}`);
      }
    }

    console.log('📊 Query result:', {
      stylesFound: stylesResponse.styles.length,
      totalCount: stylesResponse.total,
      page,
      pageSize
    });

    return {
      products: allProducts,
      totalCount: stylesResponse.total,
      totalPages: stylesResponse.totalPages,
      currentPage: page,
      hasNextPage: page < stylesResponse.totalPages,
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
    const params = new URLSearchParams();
    params.set('productType', productTypes.join(','));
    params.set('limit', '1000');

    const response = await apiFetch<{ success: boolean; styles: any[] }>(
      `/styles?${params.toString()}`
    );

    // Flatten and deduplicate all sizes
    const allSizes = new Set<string>();
    response.styles?.forEach(style => {
      if (style.available_sizes) {
        style.available_sizes.forEach((size: string) => allSizes.add(size));
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
    const response = await apiFetch<{
      success: boolean;
      productTypes?: string[];
      brands?: string[];
      genders?: string[];
      ageGroups?: string[];
      priceRange?: { min: number; max: number };
      sizes?: string[];
      colors?: string[];
      colorShades?: string[];
    }>('/filter-options');

    // Get brand logos
    const brandsResponse = await apiFetch<{
      success: boolean;
      brands: Array<{ id: string; name: string; logo_url?: string }>;
    }>('/brands');

    const brandOptions: BrandOption[] = (response.brands || []).map((name, index) => {
      const brandWithLogo = brandsResponse.brands?.find(b => b.name === name);
      return {
        id: brandWithLogo?.id || `brand-${index}`,
        name,
        logo_url: brandWithLogo?.logo_url
      };
    });

    console.log('📊 Filter options loaded:', {
      productTypesCount: response.productTypes?.length || 0,
      sizesCount: response.sizes?.length || 0,
      colorsCount: response.colors?.length || 0,
      brandsCount: response.brands?.length || 0,
      gendersCount: response.genders?.length || 0,
      ageGroupsCount: response.ageGroups?.length || 0
    });

    return {
      materials: [], // TODO: Add materials endpoint if needed
      categories: [],
      priceRange: response.priceRange || { min: 0, max: 1000 },
      productTypes: (response.productTypes || []).sort(),
      sizes: (response.sizes || []).sort(),
      colors: (response.colors || []).sort(),
      colorShades: (response.colorShades || []).sort(),
      brands: (response.brands || []).sort(),
      brandOptions,
      genders: (response.genders || []).sort(),
      ageGroups: (response.ageGroups || []).sort(),
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

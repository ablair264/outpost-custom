// Product API - connects to Neon via Netlify Functions
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
  genders: string[];
  ageGroups: string[];
  accreditations: string[];
}

export async function getFilteredProducts(
  categoryKey: string,
  filters: ProductFilters = {},
  page: number = 1,
  pageSize: number = 12
): Promise<ProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.set('productType', categoryKey);

    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
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

    params.set('limit', pageSize.toString());
    params.set('offset', ((page - 1) * pageSize).toString());

    const response = await apiFetch<{
      success: boolean;
      products: Product[];
      total: number;
    }>(`?${params.toString()}`);

    const totalPages = Math.ceil((response.total || 0) / pageSize);

    return {
      products: response.products || [],
      totalCount: response.total || 0,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error in getFilteredProducts:', error);
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page
    };
  }
}

export async function getFilterOptions(categoryKey: string): Promise<FilterOptions> {
  try {
    // Get products for this category to extract filter options
    const response = await apiFetch<{
      success: boolean;
      products: Product[];
    }>(`?productType=${encodeURIComponent(categoryKey)}&limit=1000`);

    const products = response.products || [];

    // Extract unique values
    const materials = new Set<string>();
    const categories = new Set<string>();

    products.forEach(product => {
      // Extract materials from fabric
      if (product.fabric) {
        const commonMaterials = [
          'Cotton', 'Polyester', 'Wool', 'Denim', 'Fleece', 'Canvas',
          'Merino', 'Terry Cloth', 'Jersey', 'Teddy', 'Corduroy', 'Leather',
          'Twill', 'French Terry', 'Silk', 'Linen', 'Nylon', 'Viscose',
          'Acrylic', 'Spandex', 'Elastane', 'Polyamide', 'Modal', 'Bamboo'
        ];

        commonMaterials.forEach(material => {
          if (product.fabric?.toLowerCase().includes(material.toLowerCase())) {
            materials.add(material);
          }
        });
      }

      // Extract categories
      if (product.categorisation) {
        product.categorisation.split('|').forEach((cat: string) => {
          const trimmedCat = cat.trim();
          if (trimmedCat &&
              !trimmedCat.includes('Top 1000') &&
              !trimmedCat.includes('DM') &&
              !trimmedCat.includes('Raladeal') &&
              !trimmedCat.includes('Edge -') &&
              !trimmedCat.includes('New in') &&
              !trimmedCat.includes('Must Haves')) {
            categories.add(trimmedCat);
          }
        });
      }
    });

    const prices = products
      .map(p => parseFloat(p.single_price))
      .filter(p => !isNaN(p) && p > 0);

    return {
      materials: Array.from(materials).sort(),
      categories: Array.from(categories).sort(),
      priceRange: prices.length > 0 ? {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices))
      } : { min: 0, max: 1000 },
      productTypes: Array.from(new Set(products.map(p => p.product_type).filter(Boolean))).sort(),
      sizes: Array.from(new Set(products.map(p => p.size_name).filter(Boolean))).sort(),
      colors: Array.from(new Set(products.map(p => p.primary_colour).filter(Boolean))).sort(),
      colorShades: Array.from(new Set(products.map(p => p.colour_shade).filter((shade): shade is string => Boolean(shade)))).sort(),
      brands: Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort(),
      genders: Array.from(new Set(products.map(p => p.gender).filter(Boolean))).sort(),
      ageGroups: Array.from(new Set(products.map(p => p.age_group).filter((age): age is string => Boolean(age)))).sort(),
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
      genders: [],
      ageGroups: [],
      accreditations: []
    };
  }
}

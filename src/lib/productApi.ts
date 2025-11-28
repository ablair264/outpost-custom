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
    let query = supabase
      .from('product_data')
      .select('*', { count: 'exact' });

    // Base category filter
    query = query.eq('product_type', categoryKey);

    // Apply filters
    if (filters.searchQuery) {
      // Search across multiple fields
      query = query.or(`style_name.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%,retail_description.ilike.%${filters.searchQuery}%`);
    }

    if (filters.productTypes?.length) {
      query = query.in('product_type', filters.productTypes);
    }

    if (filters.sizes?.length) {
      query = query.in('size_name', filters.sizes);
    }

    if (filters.colors?.length) {
      query = query.in('primary_colour', filters.colors);
    }

    if (filters.colorShades?.length) {
      query = query.in('colour_shade', filters.colorShades);
    }

    if (filters.brands?.length) {
      query = query.in('brand', filters.brands);
    }

    if (filters.genders?.length) {
      query = query.in('gender', filters.genders);
    }

    if (filters.ageGroups?.length) {
      query = query.in('age_group', filters.ageGroups);
    }

    if (filters.sustainableOrganic?.length) {
      query = query.in('sustainable_organic', filters.sustainableOrganic);
    }

    // Price range filter
    if (filters.priceMin !== undefined) {
      query = query.gte('single_price', filters.priceMin.toString());
    }
    if (filters.priceMax !== undefined) {
      query = query.lte('single_price', filters.priceMax.toString());
    }

    // Material filter (requires text search in fabric field)
    if (filters.materials?.length) {
      const materialConditions = filters.materials.map(material => 
        `fabric.ilike.%${material}%`
      ).join(',');
      query = query.or(materialConditions);
    }

    // Category filter (requires text search in categorisation field)
    if (filters.categories?.length) {
      const categoryConditions = filters.categories.map(category => 
        `categorisation.ilike.%${category}%`
      ).join(',');
      query = query.or(categoryConditions);
    }

    // Accreditations filter
    if (filters.accreditations?.length) {
      const accredConditions = filters.accreditations.map(accred => 
        `accreditations.ilike.%${accred}%`
      ).join(',');
      query = query.or(accredConditions);
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);

    // Order by style_code for consistent grouping
    query = query.order('style_code').order('colour_code');

    const { data: products, count, error } = await query;

    if (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return {
      products: products || [],
      totalCount: count || 0,
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
    // Get a sample of products to extract filter options
    const { data: products, error } = await supabase
      .from('product_data')
      .select('*')
      .eq('product_type', categoryKey)
      .limit(1000); // Get a representative sample

    if (error || !products) {
      throw error;
    }

    // Extract unique values
    const materials = new Set<string>();
    const categories = new Set<string>();
    const accreditationsRaw: { accreditations: string }[] = [];
    
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
          if (product.fabric.toLowerCase().includes(material.toLowerCase())) {
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
      
      // Collect accreditations
      if (product.accreditations) {
        accreditationsRaw.push({ accreditations: product.accreditations });
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
      accreditations: [] // Will be populated from the accreditationsRaw
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
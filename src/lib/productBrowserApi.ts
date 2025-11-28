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

export async function getAllProducts(
  filters: ProductFilters = {},
  page: number = 1,
  pageSize: number = 12
): Promise<ProductsResponse> {
  try {
    console.log('🗄️ Database query starting with filters:', filters);
    let query = supabase
      .from('product_data')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.searchQuery) {
      // Extract meaningful keywords from the search query
      const keywords = filters.searchQuery
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/) // Split by whitespace
        .filter(word => 
          word.length > 2 && // Keep words longer than 2 characters
          !['the', 'and', 'for', 'with', 'need', 'want', 'looking'].includes(word) // Remove common stop words
        );
      
      console.log('🔍 Search keywords extracted:', keywords);
      
      // Search for each keyword across multiple fields
      if (keywords.length > 0) {
        const searchConditions = keywords.map(keyword => 
          `style_name.ilike.%${keyword}%,brand.ilike.%${keyword}%,retail_description.ilike.%${keyword}%,specification.ilike.%${keyword}%,product_type.ilike.%${keyword}%`
        ).join(',');
        query = query.or(searchConditions);
      }
    }

    if (filters.productTypes?.length) {
      console.log('🔍 Filtering by product_type:', filters.productTypes);
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
      console.log('🔍 Filtering by gender:', filters.genders);
      query = query.in('gender', filters.genders);
    }

    if (filters.ageGroups?.length) {
      query = query.in('age_group', filters.ageGroups);
    }

    if (filters.sustainableOrganic?.length) {
      query = query.in('sustainable_organic', filters.sustainableOrganic);
    }

    // Price range filter - convert to number for proper comparison
    if (filters.priceMin !== undefined) {
      console.log('🔍 Filtering by priceMin:', filters.priceMin);
      query = query.gte('single_price::numeric', filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      console.log('🔍 Filtering by priceMax:', filters.priceMax);
      query = query.lte('single_price::numeric', filters.priceMax);
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

    // Simple pagination - let frontend handle grouping
    const startIndex = (page - 1) * pageSize;
    query = query.range(startIndex, startIndex + pageSize - 1);
    
    // Order by style_code for better grouping diversity
    query = query.order('style_code', { ascending: true }).order('id', { ascending: true });

    const { data: products, count, error } = await query;

    console.log('🔍 Supabase query result:', {
      error: error || 'No error',
      count: count,
      productsLength: products?.length || 0,
      firstProduct: products?.[0]?.sku_code || 'No products'
    });

    if (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
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
    // Get distinct values for each filter type using aggregation
    const [
      productTypesResult,
      sizesResult,
      colorsResult,
      brandsResult,
      gendersResult,
      priceRangeResult
    ] = await Promise.all([
      supabase.from('product_data').select('product_type').not('product_type', 'is', null).limit(100000),
      supabase.from('product_data').select('size_name').not('size_name', 'is', null).limit(100000),
      supabase.from('product_data').select('primary_colour').not('primary_colour', 'is', null).limit(100000),
      supabase.from('product_data').select('brand').not('brand', 'is', null).limit(100000),
      supabase.from('product_data').select('gender').not('gender', 'is', null).limit(100000),
      supabase.from('product_data').select('single_price').not('single_price', 'is', null).limit(100000)
    ]);

    // Check for errors
    if (brandsResult.error) {
      console.error('❌ Error fetching brands:', brandsResult.error);
    }
    if (productTypesResult.error) {
      console.error('❌ Error fetching product types:', productTypesResult.error);
    }

    // Extract unique values
    const productTypes = Array.from(new Set(productTypesResult.data?.map(p => p.product_type) || [])).sort();
    const sizes = Array.from(new Set(sizesResult.data?.map(p => p.size_name) || [])).sort();
    const colors = Array.from(new Set(colorsResult.data?.map(p => p.primary_colour) || [])).sort();
    const brands = Array.from(new Set(brandsResult.data?.map(p => p.brand) || [])).sort();
    const genders = Array.from(new Set(gendersResult.data?.map(p => p.gender) || [])).sort();

    // Debug logging
    console.log('📊 Filter options loaded:', {
      productTypesCount: productTypes.length,
      sizesCount: sizes.length,
      colorsCount: colors.length,
      brandsCount: brands.length,
      brands: brands,
      brandDataLength: brandsResult.data?.length,
      gendersCount: genders.length
    });
    
    // Calculate price range
    const prices = priceRangeResult.data?.map(p => parseFloat(p.single_price)).filter(p => !isNaN(p)) || [];
    const priceRange = prices.length > 0 ? {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    } : { min: 0, max: 1000 };

    // For materials, categories, etc., we need to sample products since they require text parsing
    const { data: sampleProducts } = await supabase
      .from('product_data')
      .select('fabric, categorisation, colour_shade, age_group, accreditations')
      .limit(500);

    const materials = new Set<string>();
    const categories = new Set<string>();
    const colorShades = new Set<string>();
    const ageGroups = new Set<string>();
    const accreditationsSet = new Set<string>();
    
    sampleProducts?.forEach(product => {
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

      // Extract color shades
      if (product.colour_shade) {
        colorShades.add(product.colour_shade);
      }

      // Extract age groups
      if (product.age_group) {
        ageGroups.add(product.age_group);
      }
      
      // Extract accreditations
      if (product.accreditations) {
        product.accreditations.split('|').forEach((accred: string) => {
          const trimmed = accred.trim();
          if (trimmed) {
            accreditationsSet.add(trimmed);
          }
        });
      }
    });
    
    return {
      materials: Array.from(materials).sort(),
      categories: Array.from(categories).sort(),
      priceRange,
      productTypes,
      sizes,
      colors,
      colorShades: Array.from(colorShades).sort(),
      brands,
      genders,
      ageGroups: Array.from(ageGroups).sort(),
      accreditations: Array.from(accreditationsSet).sort()
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
// Database API - connects to Neon via Netlify Functions
// No longer using Supabase - all queries go through /.netlify/functions/products

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

// Product data types
export interface Product {
  id: string;
  sku_code: string;
  style_code: string;
  style_name: string;
  brand: string;
  product_type: string;
  primary_colour: string;
  primary_product_image_url: string;
  back_image_url?: string;
  side_image_url?: string;
  additional_image_url?: string;
  single_price: string;
  gender: string;
  categorisation: string;
  colour_code: string;
  colour_name: string;
  colour_image: string;
  size_code: string;
  size_name: string;
  size_range: string;
  rgb: string;
  fabric?: string;
  colour_shade?: string;
  age_group?: string;
  accreditations?: string;
  sustainable_organic?: string;
  specification?: string;
  retail_description?: string;
  washing_instructions?: string;
  product_feature_1?: string;
  product_feature_2?: string;
  product_feature_3?: string;
  tag?: string;
  weight_gsm?: string;
  sizing_to_fit?: string;
  size_exclusions?: string;
  jacket_length?: string;
  leg_length?: string;
  sku_status?: string;
}

// Category management types
export interface CategoryData {
  id: string;
  category_key: string;
  display_name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  category_group: string;
  product_count: number;
  created_at: string;
  updated_at: string;
}

// Color variant information
export interface ColorVariant {
  colour_code: string;
  colour_name: string;
  colour_image: string;
  rgb: string;
  colour_shade?: string;
  back_image_url?: string;
  side_image_url?: string;
  additional_image_url?: string;
}

// Grouped product type - represents a product with all its variants
export interface GroupedProduct {
  style_code: string;
  style_name: string;
  brand: string;
  product_type: string;
  primary_product_image_url: string;
  gender: string;
  categorisation: string;
  age_group?: string;
  accreditations?: string;
  sustainable_organic?: string;
  specification?: string;
  retail_description?: string;
  fabric?: string;
  variants: Product[];
  colors: ColorVariant[];
  sizes: string[];
  size_range: string;
  price_range: {
    min: number;
    max: number;
  };
}

// Product type/collection interface
export interface ProductType {
  product_type: string;
  product_count: number;
  total_variants: number;
}

// ============ API Functions ============

// Get categories with product counts
export const getCategoriesWithCounts = async (): Promise<CategoryData[]> => {
  try {
    console.log('Fetching categories from Neon...');
    const response = await apiFetch<{ success: boolean; categories: CategoryData[] }>('/categories');
    console.log('Categories received:', response.categories?.length, 'items');
    return response.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Legacy function for backwards compatibility
export const getProductCategories = async () => {
  const categories = await getCategoriesWithCounts();
  return categories.map(cat => ({
    name: cat.category_key,
    productCount: cat.product_count
  }));
};

// Update category image
export const updateCategoryImage = async (categoryKey: string, imageUrl: string): Promise<boolean> => {
  try {
    // First get the category ID
    const categories = await getCategoriesWithCounts();
    const category = categories.find(c => c.category_key === categoryKey);
    if (!category) return false;

    await apiFetch(`/categories/${category.id}`, {
      method: 'PUT',
      body: JSON.stringify({ image_url: imageUrl }),
    });
    return true;
  } catch (error) {
    console.error('Error updating category image:', error);
    return false;
  }
};

// Toggle category status
export const toggleCategoryStatus = async (categoryKey: string): Promise<boolean> => {
  try {
    const categories = await getCategoriesWithCounts();
    const category = categories.find(c => c.category_key === categoryKey);
    if (!category) return false;

    await apiFetch(`/categories/${category.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !category.is_active }),
    });
    return true;
  } catch (error) {
    console.error('Error toggling category status:', error);
    return false;
  }
};

// Update category details
export const updateCategory = async (
  id: string,
  updates: Partial<Pick<CategoryData, 'display_name' | 'description' | 'category_group' | 'sort_order' | 'is_active'>>
): Promise<boolean> => {
  try {
    await apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
};

// Get active categories only
export const getActiveCategories = async (): Promise<CategoryData[]> => {
  try {
    const response = await apiFetch<{ success: boolean; categories: CategoryData[] }>('/categories?activeOnly=true');
    return response.categories || [];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return [];
  }
};

// Get products by category (excludes discontinued products)
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await apiFetch<{ success: boolean; products: Product[] }>(
      `?productType=${encodeURIComponent(category)}&limit=50`
    );
    return response.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Group products by style_code (combining all color and size variants)
export const groupProductVariants = (products: Product[]): GroupedProduct[] => {
  const grouped = new Map<string, GroupedProduct>();

  products.forEach((product) => {
    const key = product.style_code;

    if (!grouped.has(key)) {
      const price = parseFloat(product.single_price) || 0;
      grouped.set(key, {
        style_code: product.style_code,
        style_name: product.style_name,
        brand: product.brand,
        product_type: product.product_type,
        primary_product_image_url: product.primary_product_image_url,
        gender: product.gender,
        categorisation: product.categorisation,
        age_group: product.age_group,
        accreditations: product.accreditations,
        sustainable_organic: product.sustainable_organic,
        specification: product.specification,
        retail_description: product.retail_description,
        fabric: product.fabric,
        variants: [product],
        colors: [{
          colour_code: product.colour_code,
          colour_name: product.colour_name,
          colour_image: product.colour_image,
          rgb: product.rgb,
          colour_shade: product.colour_shade,
          back_image_url: product.back_image_url,
          side_image_url: product.side_image_url,
          additional_image_url: product.additional_image_url,
        }],
        sizes: [product.size_name],
        size_range: product.size_range,
        price_range: {
          min: price,
          max: price,
        },
      });
    } else {
      const group = grouped.get(key)!;
      group.variants.push(product);

      const colorExists = group.colors.some(c => c.colour_code === product.colour_code);
      if (!colorExists) {
        group.colors.push({
          colour_code: product.colour_code,
          colour_name: product.colour_name,
          colour_image: product.colour_image,
          rgb: product.rgb,
          colour_shade: product.colour_shade,
          back_image_url: product.back_image_url,
          side_image_url: product.side_image_url,
          additional_image_url: product.additional_image_url,
        });
      }

      if (!group.sizes.includes(product.size_name)) {
        group.sizes.push(product.size_name);
      }

      const price = parseFloat(product.single_price) || 0;
      group.price_range.min = Math.min(group.price_range.min, price);
      group.price_range.max = Math.max(group.price_range.max, price);
    }
  });

  return Array.from(grouped.values());
};

// Fetch and group products for carousel
export const getGroupedProductsForCarousel = async (limit: number = 12): Promise<GroupedProduct[]> => {
  try {
    const response = await apiFetch<{ success: boolean; products: GroupedProduct[] }>(
      `/carousel?limit=${limit}`
    );
    return response.products || [];
  } catch (error) {
    console.error('Error fetching carousel products:', error);
    return [];
  }
};

// Get all unique product types with counts
export const getProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await apiFetch<{ success: boolean; productTypes: string[] }>('/filter-options');

    // Get counts from categories
    const categories = await getCategoriesWithCounts();
    const categoryMap = new Map(categories.map(c => [c.category_key, c.product_count]));

    return (response.productTypes || []).map(pt => ({
      product_type: pt,
      product_count: categoryMap.get(pt) || 0,
      total_variants: 0
    }));
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
};

// Get grouped products by product type/collection
export const getGroupedProductsByType = async (productType: string): Promise<GroupedProduct[]> => {
  try {
    const response = await apiFetch<{ success: boolean; products: Product[] }>(
      `?productType=${encodeURIComponent(productType)}&limit=500`
    );
    return groupProductVariants(response.products || []);
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return [];
  }
};

// Get RGB values lookup table
export const getRgbValues = async (): Promise<Map<string, string>> => {
  try {
    const response = await apiFetch<{ success: boolean; rgbValues: Array<{ rgb_text: string; hex: string }> }>(
      '/rgb-values'
    );
    const lookup = new Map<string, string>();
    response.rgbValues?.forEach(row => {
      if (row.rgb_text && row.hex) {
        const normalized = row.rgb_text.replace(/\s+/g, ' ').trim();
        lookup.set(normalized, row.hex);
      }
    });
    return lookup;
  } catch (error) {
    console.error('Error fetching RGB values:', error);
    return new Map();
  }
};

// Get products by style code (for product detail page)
export const getProductsByStyleCode = async (styleCode: string): Promise<Product[]> => {
  try {
    const response = await apiFetch<{ success: boolean; products: Product[] }>(
      `/styles/${encodeURIComponent(styleCode)}/variants`
    );
    return response.products || [];
  } catch (error) {
    console.error('Error fetching product by style code:', error);
    return [];
  }
};

// Export a dummy supabase object for backward compatibility with imports
// This prevents import errors in files that haven't been updated yet
export const supabase = {
  from: (table: string) => {
    console.warn(`Direct supabase.from('${table}') called - use API functions instead`);
    return {
      select: () => Promise.resolve({ data: [], error: new Error('Use API functions instead of direct Supabase calls') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Use API functions instead') }),
      update: () => Promise.resolve({ data: null, error: new Error('Use API functions instead') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Use API functions instead') }),
    };
  },
  rpc: () => Promise.resolve({ data: null, error: new Error('Use API functions instead') }),
};

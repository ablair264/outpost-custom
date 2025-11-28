import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ptmpshcuvhshcwbpaqit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bXBzaGN1dmhzaGN3YnBhcWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODExNDIsImV4cCI6MjA3NDE1NzE0Mn0.Nrt89ux7TWCwPojWDgtDk3wXbeyT51ruMjmuzcvnlCY';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  single_price: string; // Changed to string since it comes as string from DB
  gender: string;
  categorisation: string;
  colour_code: string;
  colour_name: string;
  colour_image: string;
  size_code: string;
  size_name: string;
  size_range: string;
  rgb: string;
  // Additional fields from the full product data
  fabric?: string;
  colour_shade?: string;
  age_group?: string;
  accreditations?: string;
  sustainable_organic?: string;
  specification?: string;
  retail_description?: string;
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

// Get categories with product counts from the categories table
export const getCategoriesWithCounts = async (): Promise<CategoryData[]> => {
  try {
    console.log('Fetching categories with counts from Supabase...');
    
    // First, get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');
    
    if (categoriesError) {
      console.error('Categories error:', categoriesError);
      throw categoriesError;
    }
    
    // Then get product counts for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count, error: countError } = await supabase
          .from('product_data')
          .select('*', { count: 'exact', head: true })
          .eq('product_type', category.category_key);
        
        if (countError) {
          console.warn(`Error counting products for ${category.category_key}:`, countError);
        }
        
        return {
          ...category,
          product_count: count || 0
        };
      })
    );
    
    console.log('Categories with counts received:', categoriesWithCounts?.length, 'items');
    return categoriesWithCounts || [];
  } catch (error) {
    console.error('Error fetching categories with counts:', error);
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
    const { data, error } = await supabase
      .rpc('update_category_image', {
        p_category_key: categoryKey,
        p_image_url: imageUrl
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating category image:', error);
    return false;
  }
};

// Toggle category status
export const toggleCategoryStatus = async (categoryKey: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('toggle_category_status', {
        p_category_key: categoryKey
      });
    
    if (error) throw error;
    return data;
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
    const { error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
};

// Get active categories only
export const getActiveCategories = async (): Promise<CategoryData[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from('product_data')
      .select('*')
      .eq('product_type', category)
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Color variant information
export interface ColorVariant {
  colour_code: string;
  colour_name: string;
  colour_image: string;
  rgb: string;
  colour_shade?: string;
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
  // Aggregated variant data
  variants: Product[];
  colors: ColorVariant[];
  sizes: string[];
  size_range: string;
  price_range: {
    min: number;
    max: number;
  };
}

// Group products by style_code only (combining all color and size variants)
export const groupProductVariants = (products: Product[]): GroupedProduct[] => {
  const grouped = new Map<string, GroupedProduct>();

  products.forEach((product) => {
    // Group only by style_code to combine all color/size variants
    const key = product.style_code;

    if (!grouped.has(key)) {
      // Create new grouped product entry
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
        }],
        sizes: [product.size_name],
        size_range: product.size_range,
        price_range: {
          min: price,
          max: price,
        },
      });
    } else {
      // Add variant to existing group
      const group = grouped.get(key)!;
      group.variants.push(product);

      // Add color if not already present
      const colorExists = group.colors.some(c => c.colour_code === product.colour_code);
      if (!colorExists) {
        group.colors.push({
          colour_code: product.colour_code,
          colour_name: product.colour_name,
          colour_image: product.colour_image,
          rgb: product.rgb,
          colour_shade: product.colour_shade,
        });
      }

      // Add size if not already present
      if (!group.sizes.includes(product.size_name)) {
        group.sizes.push(product.size_name);
      }

      // Update price range
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
    // Fetch a large sample to ensure we get enough unique style codes
    // Since products have multiple variants (colors/sizes), we need many rows
    const { data, error } = await supabase
      .from('product_data')
      .select('*')
      .limit(200); // Fetch 200 rows to ensure variety

    if (error) throw error;

    // Group the products by style_code
    const grouped = groupProductVariants(data || []);

    // Return only the requested number of unique products
    return grouped.slice(0, limit);
  } catch (error) {
    console.error('Error fetching grouped products:', error);
    return [];
  }
};

// Product type/collection interface
export interface ProductType {
  product_type: string;
  product_count: number;
  total_variants: number;
}

// Get all unique product types with counts
export const getProductTypes = async (): Promise<ProductType[]> => {
  try {
    // Fetch all products
    const { data, error } = await supabase
      .from('product_data')
      .select('product_type, style_code');

    if (error) throw error;

    // Group by product_type and count unique style_codes
    const typeMap = new Map<string, Set<string>>();
    let totalVariants = new Map<string, number>();

    data?.forEach(item => {
      if (item.product_type) {
        if (!typeMap.has(item.product_type)) {
          typeMap.set(item.product_type, new Set());
          totalVariants.set(item.product_type, 0);
        }
        typeMap.get(item.product_type)!.add(item.style_code);
        totalVariants.set(item.product_type, (totalVariants.get(item.product_type) || 0) + 1);
      }
    });

    // Convert to array format
    const productTypes: ProductType[] = Array.from(typeMap.entries()).map(([product_type, styleCodes]) => ({
      product_type,
      product_count: styleCodes.size,
      total_variants: totalVariants.get(product_type) || 0,
    }));

    // Sort by product count descending
    return productTypes.sort((a, b) => b.product_count - a.product_count);
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
};

// Get grouped products by product type/collection
export const getGroupedProductsByType = async (productType: string): Promise<GroupedProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('product_data')
      .select('*')
      .eq('product_type', productType);

    if (error) throw error;

    // Group the products by style_code
    const grouped = groupProductVariants(data || []);

    return grouped;
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return [];
  }
};
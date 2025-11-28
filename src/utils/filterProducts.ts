// Define FilterState locally since FilterModal was removed
interface FilterState {
  searchQuery: string;
  productType: string[];
  size: string[];
  color: string[];
  colorShade: string[];
  category: string[];
  material: string[];
  brand: string[];
  gender: string[];
  ageGroup: string[];
  sustainableOrganic: string[];
  accreditations: string[];
  price: { min: number; max: number };
}

export function filterProducts(products: any[], filters: FilterState): any[] {
  return products.filter(product => {
    // Search query filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const searchableText = [
        product.style_name,
        product.brand,
        product.product_type,
        product.colour_name,
        product.retail_description,
        product.specification
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    // Product type filter
    if (filters.productType.length > 0) {
      if (!filters.productType.includes(product.product_type)) {
        return false;
      }
    }

    // Size filter
    if (filters.size.length > 0) {
      if (!filters.size.includes(product.size_name)) {
        return false;
      }
    }

    // Color filter
    if (filters.color.length > 0) {
      if (!filters.color.includes(product.primary_colour)) {
        return false;
      }
    }

    // Color shade filter
    if (filters.colorShade.length > 0) {
      if (!filters.colorShade.includes(product.colour_shade)) {
        return false;
      }
    }

    // Category filter - check if product has any of the selected categories
    if (filters.category.length > 0) {
      const productCategories = product.categorisation ? 
        product.categorisation.split('|').map((c: string) => c.trim()) : [];
      const hasCategory = filters.category.some(cat => 
        productCategories.includes(cat)
      );
      if (!hasCategory) {
        return false;
      }
    }

    // Material filter - check if fabric contains any of the selected materials
    if (filters.material.length > 0) {
      const fabricLower = (product.fabric || '').toLowerCase();
      const hasMaterial = filters.material.some(material => 
        fabricLower.includes(material.toLowerCase())
      );
      if (!hasMaterial) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand.length > 0) {
      if (!filters.brand.includes(product.brand)) {
        return false;
      }
    }

    // Gender filter
    if (filters.gender.length > 0) {
      if (!filters.gender.includes(product.gender)) {
        return false;
      }
    }

    // Age group filter
    if (filters.ageGroup.length > 0) {
      if (!filters.ageGroup.includes(product.age_group)) {
        return false;
      }
    }

    // Sustainable/Organic filter
    if (filters.sustainableOrganic.length > 0) {
      if (!filters.sustainableOrganic.includes(product.sustainable_organic)) {
        return false;
      }
    }

    // Accreditations filter
    if (filters.accreditations.length > 0) {
      const productAccreditations = product.accreditations ? 
        product.accreditations.split('|').map((a: string) => a.trim()) : [];
      const hasAccreditation = filters.accreditations.some(accred => 
        productAccreditations.includes(accred)
      );
      if (!hasAccreditation) {
        return false;
      }
    }

    // Price filter
    const price = parseFloat(product.single_price);
    if (!isNaN(price)) {
      if (price < filters.price.min || price > filters.price.max) {
        return false;
      }
    }

    return true;
  });
}
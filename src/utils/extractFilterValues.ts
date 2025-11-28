import fs from 'fs';
import path from 'path';

// Common fabric materials to extract
const COMMON_MATERIALS = [
  'Cotton', 'Polyester', 'Wool', 'Denim', 'Fleece', 'Canvas',
  'Merino', 'Terry Cloth', 'Jersey', 'Teddy', 'Corduroy', 'Leather',
  'Twill', 'French Terry', 'Silk', 'Linen', 'Nylon', 'Viscose',
  'Acrylic', 'Spandex', 'Elastane', 'Polyamide', 'Modal', 'Bamboo',
  'Cashmere', 'Velvet', 'Satin', 'Chiffon', 'Organza', 'Tulle',
  'Lycra', 'Rayon', 'Hemp', 'Alpaca', 'Angora', 'Mohair',
  'Polypropylene', 'Gore-Tex', 'Neoprene', 'Mesh', 'Taffeta',
  'Suede', 'PU', 'PVC', 'EVA', 'Ripstop', 'Microfibre',
  'Softshell', 'Hardshell', 'Fleece', 'Sherpa', 'Velour'
];

// Common category keywords
const CATEGORY_KEYWORDS = [
  // Product Types
  'T-Shirts', 'Shirts', 'Polos', 'Hoodies', 'Sweatshirts', 'Jackets', 
  'Coats', 'Vests', 'Trousers', 'Shorts', 'Jeans', 'Dresses', 'Skirts',
  'Blouses', 'Knitwear', 'Jumpers', 'Cardigans', 'Fleece', 'Softshells',
  'Gilets', 'Bodywarmers', 'Rainwear', 'Windbreakers', 'Baselayers',
  'Underwear', 'Socks', 'Accessories', 'Bags', 'Luggage', 'Headwear',
  'Caps', 'Beanies', 'Scarves', 'Gloves', 'Belts', 'Footwear',
  
  // Collections/Themes
  'Workwear', 'Safetywear', 'Sportswear', 'Activewear', 'Leisurewear',
  'Loungewear', 'Streetwear', 'Corporate', 'Hospitality', 'Healthcare',
  'Education', 'Outdoor', 'Performance', 'Premium', 'Organic', 
  'Sustainable', 'Recycled', 'Eco-Friendly', 'Plus Sizes', 'Junior',
  'Kids', 'Baby', 'Maternity', 'Unisex', "Women's", "Men's",
  
  // Specific Features
  'Waterproof', 'Windproof', 'Breathable', 'Insulated', 'Thermal',
  'UV Protection', 'Quick Dry', 'Moisture Wicking', 'Anti-Bacterial',
  'Reflective', 'High Visibility', 'Flame Resistant', 'Anti-Static',
  
  // Seasons/Occasions
  'Summer', 'Winter', 'Spring', 'Autumn', 'All Season', 'Christmas',
  'Festival', 'Travel', 'Sports', 'Golf', 'Running', 'Yoga', 'Gym'
];

export function extractMaterialsFromCSV(csvPath: string): string[] {
  const materials = new Set<string>();
  
  try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      const fabricText = line.toLowerCase();
      
      COMMON_MATERIALS.forEach(material => {
        // Check if the material appears in the fabric description
        const regex = new RegExp(`\\b${material.toLowerCase()}\\b`, 'i');
        if (regex.test(fabricText)) {
          materials.add(material);
        }
      });
      
      // Special cases
      if (fabricText.includes('organic cotton')) {
        materials.add('Organic Cotton');
      }
      if (fabricText.includes('recycled polyester')) {
        materials.add('Recycled Polyester');
      }
      if (fabricText.includes('recycled cotton')) {
        materials.add('Recycled Cotton');
      }
      if (fabricText.includes('merino wool')) {
        materials.add('Merino Wool');
      }
    });
  } catch (error) {
    console.error('Error reading fabric CSV:', error);
  }
  
  return Array.from(materials).sort();
}

export function extractCategoriesFromCSV(csvPath: string): string[] {
  const categories = new Set<string>();
  
  try {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').slice(1); // Skip header
    
    lines.forEach(line => {
      if (!line.trim()) return;
      
      // Split by pipe character
      const cats = line.split('|');
      
      cats.forEach(cat => {
        const trimmedCat = cat.trim();
        if (trimmedCat && trimmedCat.length > 2) {
          // Filter out very specific or promotional categories
          if (!trimmedCat.includes('Top 1000') && 
              !trimmedCat.includes('DM') &&
              !trimmedCat.includes('Raladeal') &&
              !trimmedCat.includes('Edge -') &&
              !trimmedCat.includes('New in') &&
              !trimmedCat.includes('New Styles') &&
              !trimmedCat.includes('New Colours') &&
              !trimmedCat.includes('Latest Additions') &&
              !trimmedCat.includes('Must Haves') &&
              !trimmedCat.includes('Exclusives') &&
              !trimmedCat.includes('On Raladeal')) {
            categories.add(trimmedCat);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error reading categorisation CSV:', error);
  }
  
  return Array.from(categories).sort();
}

// Function to get price range from products
export function extractPriceRange(products: any[]): { min: number, max: number } {
  const prices = products
    .map(p => parseFloat(p.single_price))
    .filter(p => !isNaN(p) && p > 0);
  
  if (prices.length === 0) {
    return { min: 0, max: 1000 };
  }
  
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices))
  };
}

// Main function to extract all filter options
export function extractAllFilterOptions(products: any[]) {
  const fabricPath = path.join(process.cwd(), 'fabric.csv');
  const categorisationPath = path.join(process.cwd(), 'categorisation.csv');
  
  return {
    materials: extractMaterialsFromCSV(fabricPath),
    categories: extractCategoriesFromCSV(categorisationPath),
    priceRange: extractPriceRange(products),
    productTypes: Array.from(new Set(products.map(p => p.product_type).filter(Boolean))).sort(),
    sizes: Array.from(new Set(products.map(p => p.size_name).filter(Boolean))).sort(),
    colors: Array.from(new Set(products.map(p => p.primary_colour).filter(Boolean))).sort(),
    brands: Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort()
  };
}
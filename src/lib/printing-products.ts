// Printing Products Data Utilities
import { printingCategories } from './printing-theme';
import productsData from '../data/outpost_printing_products.json';

// Product type from the JSON
export interface PrintingProduct {
  url: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  price: string;
  categories: string[];
  images: string[];
}

// Product Type Categories (single select)
// Order matters - more specific categories first to avoid false matches
export const productTypes = [
  { id: 'all', label: 'All Products', keywords: [] as string[] },
  {
    id: 'stationery',
    label: 'Stationery',
    keywords: ['letterhead', 'compliment slip', 'certificate', 'notepads']
  },
  {
    id: 'stickers',
    label: 'Stickers & Labels',
    keywords: ['sticker sheet', 'sticker', 'product label']
  },
  {
    id: 'calendars',
    label: 'Calendars',
    keywords: ['calendar', 'desk calendar', 'wall calendar']
  },
  {
    id: 'packaging',
    label: 'Packaging & Tags',
    keywords: ['packaging sleeve', 'belly band', 'swing tag', 'backing card', 'bookmark']
  },
  {
    id: 'specialty',
    label: 'Specialty',
    keywords: ['funeral', 'memorial sign', 'table talker', 'table tent', 'postcard']
  },
  {
    id: 'cards',
    label: 'Cards',
    keywords: ['business card', 'appointment card', 'loyalty card', 'christmas card', 'greetings card', 'gift voucher', 'scratch card']
  },
  {
    id: 'flyers',
    label: 'Flyers & Leaflets',
    keywords: ['flyer', 'leaflet']
  },
  {
    id: 'booklets',
    label: 'Booklets & Brochures',
    keywords: ['booklet', 'brochure', 'wire bound document', 'wire bound notebook', 'order of service']
  },
  {
    id: 'posters',
    label: 'Posters & Prints',
    keywords: ['poster', 'art print']
  },
];

// Use Case Tags (multi-select)
export const useCaseTags = [
  { id: 'business', label: 'Business & Corporate', keywords: ['business', 'corporate', 'professional', 'networking', 'client', 'office'] },
  { id: 'events', label: 'Events & Marketing', keywords: ['event', 'marketing', 'promotion', 'trade show', 'exhibition', 'campaign'] },
  { id: 'retail', label: 'Retail & Resale', keywords: ['retail', 'resale', 'shop', 'store', 'sell', 'stock'] },
  { id: 'weddings', label: 'Weddings & Celebrations', keywords: ['wedding', 'celebration', 'party', 'anniversary', 'birthday'] },
  { id: 'hospitality', label: 'Hospitality & Cafes', keywords: ['cafe', 'restaurant', 'hotel', 'bar', 'hospitality', 'menu'] },
  { id: 'funerals', label: 'Funerals & Memorials', keywords: ['funeral', 'memorial', 'order of service', 'remembrance'] },
  { id: 'seasonal', label: 'Seasonal', keywords: ['christmas', 'holiday', 'seasonal', 'new year', 'easter'] },
];

export const allProducts: PrintingProduct[] = productsData as PrintingProduct[];

// Get product type ID for a product
export function getProductType(product: PrintingProduct): string {
  const titleLower = product.title.toLowerCase();
  const descLower = (product.short_description + ' ' + product.full_description).toLowerCase();
  const text = titleLower + ' ' + descLower;

  for (const type of productTypes) {
    if (type.id === 'all') continue;
    if (type.keywords.some(keyword => text.includes(keyword))) {
      return type.id;
    }
  }
  return 'specialty'; // Default fallback
}

// Get use case tags for a product
export function getProductUseCases(product: PrintingProduct): string[] {
  const text = (product.title + ' ' + product.short_description + ' ' + product.full_description + ' ' + product.categories.join(' ')).toLowerCase();
  const matches: string[] = [];

  for (const tag of useCaseTags) {
    if (tag.keywords.some(keyword => text.includes(keyword))) {
      matches.push(tag.id);
    }
  }

  // Default to business if no matches
  return matches.length > 0 ? matches : ['business'];
}

// Filter products by type
export function filterProductsByType(products: PrintingProduct[], typeId: string): PrintingProduct[] {
  if (typeId === 'all') return products;
  return products.filter(p => getProductType(p) === typeId);
}

// Filter products by use cases (any match)
export function filterProductsByUseCases(products: PrintingProduct[], useCaseIds: string[]): PrintingProduct[] {
  if (useCaseIds.length === 0) return products;
  return products.filter(p => {
    const productUseCases = getProductUseCases(p);
    return useCaseIds.some(id => productUseCases.includes(id));
  });
}

// Get products by category slug
export function getProductsByCategory(categorySlug: string): PrintingProduct[] {
  if (categorySlug === 'all') {
    return allProducts;
  }

  const category = printingCategories.find(c => c.slug === categorySlug);
  if (!category) return [];

  return allProducts.filter(product =>
    product.categories.some(cat =>
      (category.jsonCategories as readonly string[]).includes(cat)
    )
  );
}

// Get product by slug
export function getProductBySlug(slug: string): PrintingProduct | undefined {
  return allProducts.find(p => p.slug === slug);
}

// Get product count by category
export function getProductCountByCategory(categorySlug: string): number {
  return getProductsByCategory(categorySlug).length;
}

// Get all category counts
export function getAllCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};

  printingCategories.forEach(category => {
    counts[category.slug] = getProductCountByCategory(category.slug);
  });

  counts['all'] = allProducts.length;

  return counts;
}

// Get related products (same category, excluding current)
export function getRelatedProducts(currentSlug: string, limit = 4): PrintingProduct[] {
  const currentProduct = getProductBySlug(currentSlug);
  if (!currentProduct) return [];

  const related = allProducts
    .filter(p =>
      p.slug !== currentSlug &&
      p.categories.some(cat => currentProduct.categories.includes(cat))
    )
    .slice(0, limit);

  // If not enough related, pad with random products
  if (related.length < limit) {
    const others = allProducts
      .filter(p => p.slug !== currentSlug && !related.includes(p))
      .slice(0, limit - related.length);
    return [...related, ...others];
  }

  return related;
}

// Extract finish types mentioned in product description
export function extractFinishTypes(product: PrintingProduct): string[] {
  const finishes: string[] = [];
  const desc = product.full_description.toLowerCase();

  if (desc.includes('matt') || desc.includes('matte')) finishes.push('matt-lamination');
  if (desc.includes('gloss')) finishes.push('gloss-lamination');
  if (desc.includes('uncoated')) finishes.push('uncoated');
  if (desc.includes('coated silk') || desc.includes('silk')) finishes.push('coated-silk');
  if (desc.includes('wire') || desc.includes('wiro')) finishes.push('wire-binding');
  if (desc.includes('saddle stitch') || desc.includes('stapl')) finishes.push('saddle-stitched');
  if (desc.includes('rounded corner')) finishes.push('rounded-corners');
  if (desc.includes('drill')) finishes.push('drilled-holes');

  return finishes;
}

// Filter products by finish type
export function filterProductsByFinish(products: PrintingProduct[], finishTypes: string[]): PrintingProduct[] {
  if (finishTypes.length === 0) return products;

  return products.filter(product => {
    const productFinishes = extractFinishTypes(product);
    return finishTypes.some(f => productFinishes.includes(f));
  });
}

// Get category info by slug
export function getCategoryBySlug(slug: string) {
  return printingCategories.find(c => c.slug === slug);
}

// Parse "Perfect for" use cases from description
export function extractUseCases(product: PrintingProduct): string[] {
  const desc = product.full_description;
  const useCases: string[] = [];

  // Common use case patterns
  const patterns = [
    /perfect for ([^.]+)/gi,
    /great for ([^.]+)/gi,
    /ideal for ([^.]+)/gi,
  ];

  patterns.forEach(pattern => {
    const matches = Array.from(desc.matchAll(pattern));
    for (const match of matches) {
      if (match[1]) {
        // Split by commas and 'and'
        const cases = match[1]
          .split(/,|and/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && s.length < 50);
        useCases.push(...cases);
      }
    }
  });

  // If no patterns found, generate from categories
  if (useCases.length === 0) {
    if (product.categories.includes('Business Stationery')) {
      useCases.push('Networking events', 'Client meetings', 'Professional branding');
    } else if (product.categories.includes('Promotional Marketing + Events')) {
      useCases.push('Trade shows', 'Marketing campaigns', 'Event promotions');
    } else if (product.categories.includes('Resale Product')) {
      useCases.push('Retail stock', 'Gift shops', 'Online stores');
    } else if (product.categories.includes('Packaging')) {
      useCases.push('Product packaging', 'Retail displays', 'Brand identity');
    } else {
      useCases.push('Business promotions', 'Marketing materials', 'Brand visibility');
    }
  }

  return useCases.slice(0, 4);
}

// Extract key specs from description
export function extractKeySpecs(product: PrintingProduct): { label: string; value: string }[] {
  const desc = product.full_description;
  const specs: { label: string; value: string }[] = [];

  // Minimum quantity
  const qtyMatch = desc.match(/from (\d+)/i);
  if (qtyMatch) {
    specs.push({ label: 'Minimum', value: `From ${qtyMatch[1]}` });
  }

  // Sizes
  if (desc.includes('A4') || desc.includes('A5') || desc.includes('A6') || desc.includes('DL')) {
    specs.push({ label: 'Sizes', value: 'Multiple sizes available' });
  }

  // Finish options
  const finishes = extractFinishTypes(product);
  if (finishes.length > 0) {
    specs.push({ label: 'Finishes', value: 'Matt & Gloss options' });
  }

  return specs;
}

// Clean up product description - remove "REQUEST A PRICE LIST" and format nicely
export function cleanDescription(description: string): string {
  return description
    .replace(/REQUEST A PRICE LIST/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Get a short, clean tagline from description (first sentence or key benefit)
export function getProductTagline(product: PrintingProduct): string {
  const desc = cleanDescription(product.short_description);

  // Try to get just the first sentence (up to first period or dash pattern)
  const firstSentence = desc.split(/[.!]|–|\s-\s/)[0];

  // If it's too long, truncate
  if (firstSentence.length > 100) {
    return firstSentence.substring(0, 97) + '...';
  }

  return firstSentence;
}

// Extract key specs as bullet points from short description
export function extractKeyFeatures(product: PrintingProduct): string[] {
  const desc = cleanDescription(product.short_description);
  const features: string[] = [];

  // Common patterns to extract
  const patterns = [
    /From (\d+) \w+/i,
    /Available in .+?(?=\s[A-Z]|$)/i,
    /(\d+)gsm/gi,
    /Matt or Gloss/i,
    /Single or Double Sided/i,
    /A[0-7] (?:or|to|and) A[0-7]/i,
  ];

  // Extract minimum quantity
  const minMatch = desc.match(/From (\d+)/i);
  if (minMatch) {
    features.push(`From ${minMatch[1]} units`);
  }

  // Extract sizes
  const sizePatterns = ['A4', 'A5', 'A6', 'A7', 'DL', 'A3', 'A2', 'A1', 'Square'];
  const foundSizes = sizePatterns.filter(size => desc.includes(size));
  if (foundSizes.length > 0) {
    features.push(`${foundSizes.slice(0, 3).join(', ')}${foundSizes.length > 3 ? ' + more' : ''}`);
  }

  // Check for lamination
  if (desc.toLowerCase().includes('lamination')) {
    features.push('Matt or Gloss lamination');
  }

  // Check for paper options
  if (desc.includes('gsm')) {
    features.push('Multiple paper weights');
  }

  return features.slice(0, 4);
}

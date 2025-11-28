// Netlify Function: Smart Search with Product Summary
// Uses a pre-generated product summary for faster, smarter AI-powered search

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load product summary (cached in memory)
let productSummary = null;
let summaryLoadTime = null;

function loadProductSummary() {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, '..', '..', 'public', 'product-summary.json'),
      path.join(process.cwd(), 'public', 'product-summary.json'),
      '/var/task/public/product-summary.json', // Netlify production path
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        productSummary = JSON.parse(data);
        summaryLoadTime = new Date().toISOString();
        console.log(`[smart-search] Product summary loaded from ${filePath}`);
        console.log(`[smart-search] ${productSummary.metadata.total_products} products, ${productSummary.metadata.total_variants} variants`);
        return true;
      }
    }

    console.warn('[smart-search] Product summary file not found in any location');
    return false;
  } catch (error) {
    console.error('[smart-search] Error loading product summary:', error);
    return false;
  }
}

// Create a compact product list for AI context (keep under token limit)
function getProductContextForAI(limit = 50) {
  if (!productSummary) {
    loadProductSummary();
  }

  if (!productSummary) {
    return { products: [], metadata: {} };
  }

  // Take first N products (or all if less than limit)
  const products = productSummary.products.slice(0, limit).map(p => ({
    name: `${p.brand} ${p.style_name}`,
    type: p.product_type,
    price: `£${p.price_range.min}-£${p.price_range.max}`,
    features: p.features.join(', '),
    materials: p.materials.join(', '),
    sustainable: p.sustainable,
    categories: p.categories.join(', '),
  }));

  return {
    products,
    metadata: productSummary.metadata
  };
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) };
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  try {
    const payload = JSON.parse(event.body || '{}');
    const query = payload.query || '';
    const selectedQuestions = payload.selectedQuestions || [];
    const fullQuery = [query, ...selectedQuestions].filter(Boolean).join('. ');

    console.log('[smart-search] Processing query:', fullQuery);

    // Load product summary if not already loaded
    if (!productSummary) {
      const loaded = loadProductSummary();
      if (!loaded) {
        console.warn('[smart-search] Falling back to simple filter generation');
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            filters: generateFallbackFilters(fullQuery, payload.availableFilters),
            explanation: 'Using fallback filters (product summary not available)',
            mode: 'fallback'
          })
        };
      }
    }

    if (!OPENAI_KEY) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          filters: generateFallbackFilters(fullQuery, payload.availableFilters),
          explanation: 'Using fallback filters (OpenAI API key not configured)',
          mode: 'fallback'
        })
      };
    }

    // Use OpenAI with actual product data
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    // Get product context
    const context = getProductContextForAI(30); // Limit to 30 products to stay under token limits

    const prompt = `You are an expert product search assistant for a promotional products/workwear company.

AVAILABLE PRODUCT DATA:
We have ${context.metadata.total_products} unique products with ${context.metadata.total_variants} total variants.

Product Types: ${context.metadata.product_types.join(', ')}
Brands: ${context.metadata.brands.join(', ')}
Genders: ${context.metadata.genders.join(', ')}
Price Range: £${context.metadata.price_range.min} - £${context.metadata.price_range.max}

SAMPLE PRODUCTS:
${context.products.slice(0, 20).map((p, i) => `${i + 1}. ${p.name} (${p.type}) - ${p.price}${p.features ? ` - Features: ${p.features}` : ''}${p.sustainable ? ' [SUSTAINABLE]' : ''}`).join('\n')}

USER QUERY: "${fullQuery}"

Based on the actual products we have in stock, generate search filters that will return relevant results.

Return JSON only:
{
  "filters": {
    "productTypes": ["Array of product types from our catalog"],
    "brands": ["Array of brands we actually stock"],
    "genders": ["Male", "Female", "Unisex"],
    "ageGroups": ["Adult", "Youth", "Kids"],
    "priceMin": number or null,
    "priceMax": number or null,
    "materials": ["Cotton", "Polyester", etc],
    "sustainable": true/false/null
  },
  "explanation": "Brief explanation of why these filters match the query",
  "matchedProducts": ["Names of 2-3 specific products that match"]
}

CRITICAL RULES:
1. ONLY suggest Product Types and Brands that EXIST in our catalog (see AVAILABLE PRODUCT DATA above)
2. If query is generic (e.g. "team uniforms"), suggest 2-3 product types: ["Polos", "T-Shirts"]
3. Only add brand filter if user explicitly mentions a brand
4. Only add price filters if user mentions budget/price
5. Only add materials if user specifically mentions fabric type
6. Keep filters broad - better to show more results than none
7. If user asks for sustainable/eco products, set "sustainable": true
8. Look at the SAMPLE PRODUCTS to understand what we actually have`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful product search assistant. Always respond with valid JSON based on actual product data.' },
        { role: 'user', content: prompt }
      ],
      temperature: Number(process.env.AI_TEMPERATURE ?? 0.2),
      max_tokens: Number(process.env.AI_MAX_TOKENS ?? 600),
    });

    const ai = completion.choices?.[0]?.message?.content || '{}';
    console.log('[smart-search] OpenAI response:', ai);

    let json;
    try {
      json = JSON.parse(ai);
    } catch {
      const match = ai.match(/\{[\s\S]*\}/);
      json = match ? JSON.parse(match[0]) : {};
    }

    const filters = json.filters || {};
    const explanation = json.explanation || 'AI-generated filters';
    const matchedProducts = json.matchedProducts || [];

    // Validate filters against actual data
    const validatedFilters = validateFilters(filters, context.metadata);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        filters: validatedFilters,
        explanation,
        matchedProducts,
        mode: 'ai',
        productsAnalyzed: context.products.length
      })
    };

  } catch (err) {
    console.error('[smart-search] Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: err.message,
        filters: generateFallbackFilters(payload?.query || '', payload?.availableFilters)
      })
    };
  }
}

// Validate filters against actual product data
function validateFilters(filters, metadata) {
  const validated = { ...filters };

  // Validate product types
  if (validated.productTypes) {
    validated.productTypes = validated.productTypes.filter(type =>
      metadata.product_types.includes(type)
    );
    if (validated.productTypes.length === 0) delete validated.productTypes;
  }

  // Validate brands
  if (validated.brands) {
    validated.brands = validated.brands.filter(brand =>
      metadata.brands.includes(brand)
    );
    if (validated.brands.length === 0) delete validated.brands;
  }

  // Validate genders
  if (validated.genders) {
    validated.genders = validated.genders.filter(gender =>
      metadata.genders.includes(gender)
    );
    if (validated.genders.length === 0) delete validated.genders;
  }

  // Validate price range
  if (validated.priceMin !== undefined && validated.priceMin !== null) {
    validated.priceMin = Math.max(validated.priceMin, metadata.price_range.min);
  }
  if (validated.priceMax !== undefined && validated.priceMax !== null) {
    validated.priceMax = Math.min(validated.priceMax, metadata.price_range.max);
  }

  // Remove null/undefined values
  Object.keys(validated).forEach(key => {
    if (validated[key] === null || validated[key] === undefined ||
        (Array.isArray(validated[key]) && validated[key].length === 0)) {
      delete validated[key];
    }
  });

  return validated;
}

// Fallback function for when AI is not available
function generateFallbackFilters(query, availableFilters = {}) {
  const filters = {};
  const lowerQuery = query.toLowerCase();

  // Product type detection
  const typeMap = {
    'polo': 'Polos',
    't-shirt': 'T-Shirts',
    'tee': 'T-Shirts',
    'hoodie': 'Hoodies',
    'sweatshirt': 'Sweatshirts',
    'jacket': 'Jackets',
    'coat': 'Jackets',
    'bag': 'Bags',
    'tote': 'Bags',
    'cap': 'Caps',
    'hat': 'Caps',
    'trouser': 'Trousers',
    'pant': 'Trousers',
    'short': 'Shorts'
  };

  const detectedTypes = [];
  Object.entries(typeMap).forEach(([keyword, type]) => {
    if (lowerQuery.includes(keyword)) {
      detectedTypes.push(type);
    }
  });

  if (detectedTypes.length > 0) {
    filters.productTypes = [...new Set(detectedTypes)];
  } else if (lowerQuery.includes('uniform') || lowerQuery.includes('team')) {
    filters.productTypes = ['Polos', 'T-Shirts'];
  } else if (lowerQuery.includes('promo') || lowerQuery.includes('event')) {
    filters.productTypes = ['T-Shirts', 'Bags', 'Caps'];
  }

  // Price detection
  const priceMatch = lowerQuery.match(/under\s*£?(\d+)|£?(\d+)\s*or\s*less|budget.*£?(\d+)/);
  if (priceMatch) {
    const price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
    if (!isNaN(price)) {
      filters.priceMax = price;
    }
  }

  // Sustainability
  if (lowerQuery.includes('sustainable') || lowerQuery.includes('eco') || lowerQuery.includes('organic')) {
    filters.sustainable = true;
  }

  // Gender
  if (lowerQuery.includes('men') || lowerQuery.includes('male')) {
    filters.genders = ['Male'];
  } else if (lowerQuery.includes('women') || lowerQuery.includes('female')) {
    filters.genders = ['Female'];
  } else if (lowerQuery.includes('unisex')) {
    filters.genders = ['Unisex'];
  }

  return filters;
}

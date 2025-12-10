// Netlify Function: Smart Search (re-implemented)
// - Grounds the LLM with live catalog metadata (from products API)
// - Validates AI filters against real data
// - Queries database via products API to return concrete product suggestions alongside filters

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CACHE_TTL_MS = Number(process.env.SMART_SEARCH_CACHE_MS || 15 * 60 * 1000); // 15 mins
const SAMPLE_PRODUCTS_FOR_AI = 60;
const MAX_RESULTS = 24;

// ------------------------------ Fallback summary (local JSON) ----------------
let productSummary = null;
function loadProductSummaryFallback() {
  if (productSummary) return productSummary;
  const paths = [
    path.join(process.cwd(), 'public', 'product-summary.json'),
    path.join(process.cwd(), 'build', 'product-summary.json'),
    '/var/task/public/product-summary.json',
    '/opt/build/repo/public/product-summary.json',
    '/opt/build/repo/build/product-summary.json'
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try {
        productSummary = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`[smart-search] Loaded fallback summary from ${p}`);
        break;
      } catch (err) {
        console.warn('[smart-search] Failed to parse fallback summary', err);
      }
    }
  }
  return productSummary;
}

// ------------------------------ Reference data cache -------------------------
let referenceCache = { loadedAt: 0, data: null };

async function loadReferenceData() {
  if (referenceCache.data && Date.now() - referenceCache.loadedAt < CACHE_TTL_MS) {
    return referenceCache.data;
  }

  try {
    // Load product types from database
    const productTypesData = await prisma.productType.findMany({
      select: { name: true },
      orderBy: { name: 'asc' }
    });
    const productTypes = productTypesData.map(t => t.name).filter(Boolean);

    // Load price range from product_styles
    const priceStats = await prisma.$queryRaw`
      SELECT MIN(price_min) as min_price, MAX(price_max) as max_price
      FROM product_styles
      WHERE price_min IS NOT NULL AND price_max IS NOT NULL
    `;
    const priceRange = {
      min: Math.floor(Number(priceStats[0]?.min_price) || 0),
      max: Math.ceil(Number(priceStats[0]?.max_price) || 0)
    };

    // Load brands
    const brandsData = await prisma.$queryRaw`
      SELECT DISTINCT brand FROM product_styles WHERE brand IS NOT NULL ORDER BY brand
    `;
    const brands = brandsData.map(b => b.brand).filter(Boolean);

    // Load sample products
    const sampleProducts = await prisma.$queryRaw`
      SELECT style_code, style_name, brand, product_type, price_min, price_max,
             fabric, categorisation, sustainable_organic, retail_description,
             primary_product_image_url
      FROM product_styles
      WHERE product_type IS NOT NULL
      LIMIT ${SAMPLE_PRODUCTS_FOR_AI}
    `;

    // Fallback to local summary if database fetch fails
    if ((!productTypes.length || !sampleProducts.length) && loadProductSummaryFallback()) {
      const summary = productSummary;
      referenceCache = {
        loadedAt: Date.now(),
        data: {
          productTypes: summary.metadata?.product_types || [],
          priceRange: summary.metadata?.price_range || { min: 0, max: 0 },
          brands: summary.metadata?.brands || [],
          sampleProducts: summary.products?.slice(0, SAMPLE_PRODUCTS_FOR_AI) || []
        }
      };
      return referenceCache.data;
    }

    referenceCache = {
      loadedAt: Date.now(),
      data: {
        productTypes,
        priceRange,
        brands,
        sampleProducts: sampleProducts.map(s => ({
          style_code: s.style_code,
          style_name: s.style_name,
          brand: s.brand,
          product_type: s.product_type,
          single_price: s.price_min,
          price_range: { min: s.price_min, max: s.price_max },
          fabric: s.fabric,
          categorisation: s.categorisation,
          sustainable_organic: s.sustainable_organic,
          retail_description: s.retail_description,
          primary_product_image_url: s.primary_product_image_url
        }))
      }
    };

    return referenceCache.data;
  } catch (error) {
    console.error('[smart-search] Error loading reference data:', error);
    // Fallback to local summary
    if (loadProductSummaryFallback()) {
      const summary = productSummary;
      return {
        productTypes: summary.metadata?.product_types || [],
        priceRange: summary.metadata?.price_range || { min: 0, max: 0 },
        brands: summary.metadata?.brands || [],
        sampleProducts: summary.products?.slice(0, SAMPLE_PRODUCTS_FOR_AI) || []
      };
    }
    return { productTypes: [], priceRange: { min: 0, max: 0 }, brands: [], sampleProducts: [] };
  }
}

// ------------------------------ Helpers -------------------------------------
function extractKeywords(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(w => !['the', 'and', 'for', 'with', 'need', 'want', 'looking', 'please', 'some'].includes(w));
}

function clampPrice(value, range) {
  if (value === null || value === undefined) return undefined;
  const num = Number(value);
  if (Number.isNaN(num)) return undefined;
  return Math.min(Math.max(num, range.min || 0), range.max || num);
}

function buildSampleForPrompt(sampleProducts) {
  return sampleProducts.slice(0, 20).map((p, i) => {
    const price = p.price_range
      ? `£${p.price_range.min}-${p.price_range.max}`
      : `£${Number(p.single_price || 0).toFixed(2)}`;
    return `${i + 1}. ${p.brand || 'Unknown'} ${p.style_name || p.style_code} (${p.product_type || 'Uncategorised'}) - ${price}${
      p.sustainable_organic?.toLowerCase().includes('yes') ? ' [SUSTAINABLE]' : ''
    }`;
  }).join('\n');
}

function validateFilters(filters, reference) {
  const out = { ...filters };
  if (out.productTypes) {
    out.productTypes = out.productTypes.filter(type => reference.productTypes.includes(type));
    if (!out.productTypes.length) delete out.productTypes;
  }
  if (out.brands) {
    out.brands = out.brands.filter(b => reference.brands.includes(b));
    if (!out.brands.length) delete out.brands;
  }
  out.priceMin = clampPrice(out.priceMin, reference.priceRange);
  out.priceMax = clampPrice(out.priceMax, reference.priceRange);
  if (out.priceMin && out.priceMax && out.priceMin > out.priceMax) {
    [out.priceMin, out.priceMax] = [out.priceMax, out.priceMin];
  }
  return Object.fromEntries(
    Object.entries(out).filter(
      ([, v]) => !(v === null || v === undefined || (Array.isArray(v) && v.length === 0))
    )
  );
}

function generateFallbackFilters(query, reference) {
  const lower = query.toLowerCase();
  const filters = {};
  const typeMap = [
    { key: 'polo', type: 'Polos' },
    { key: 't shirt', type: 'T-Shirts' },
    { key: 'tshirt', type: 'T-Shirts' },
    { key: 'hoodie', type: 'Hoodies' },
    { key: 'sweatshirt', type: 'Sweatshirts' },
    { key: 'jacket', type: 'Jackets' },
    { key: 'coat', type: 'Jackets' },
    { key: 'bag', type: 'Bags' },
    { key: 'tote', type: 'Bags' },
    { key: 'gift', type: 'Gifts' },
    { key: 'workwear', type: 'Workwear' }
  ];

  const detected = typeMap
    .filter(({ key }) => lower.includes(key))
    .map(t => t.type)
    .filter(t => reference.productTypes.includes(t));

  if (detected.length) {
    filters.productTypes = Array.from(new Set(detected));
  } else if (lower.includes('uniform') || lower.includes('team')) {
    filters.productTypes = reference.productTypes.filter(t => ['Polos', 'T-Shirts', 'Shirts'].includes(t)).slice(0, 3);
  }

  const budgetMatch = lower.match(/under\s*£?(\d+)/) || lower.match(/£\s?(\d+)\s*or\s*less/);
  if (budgetMatch) filters.priceMax = Number(budgetMatch[1]);
  if (lower.includes('budget')) filters.priceMax = Math.min(reference.priceRange.max || 25, 25);
  if (lower.includes('premium')) filters.priceMin = Math.max(reference.priceRange.min || 0, 50);
  if (lower.includes('sustainable') || lower.includes('eco') || lower.includes('organic')) filters.sustainable = true;
  if (lower.includes('men')) filters.genders = ['Male'];
  if (lower.includes('women')) filters.genders = ['Female'];
  if (lower.includes('unisex')) filters.genders = ['Unisex'];

  return validateFilters(filters, reference);
}

async function queryProducts(filters, queryText) {
  const lowerQuery = (queryText || '').toLowerCase();
  const wantsKids = lowerQuery.includes('kid') || lowerQuery.includes('child') || lowerQuery.includes('youth');
  const workwearIntent = ['workwear', 'hi vis', 'hi-vis', 'safety', 'construction', 'industrial', 'trade', 'warehouse'].some(
    kw => lowerQuery.includes(kw)
  );

  // Build WHERE conditions
  const conditions = ['is_live = true'];
  const params = [];
  let paramIndex = 1;

  if (filters.productTypes?.length) {
    conditions.push(`product_type = ANY($${paramIndex})`);
    params.push(filters.productTypes);
    paramIndex++;
  }

  if (filters.brands?.length) {
    conditions.push(`brand = ANY($${paramIndex})`);
    params.push(filters.brands);
    paramIndex++;
  }

  if (filters.genders?.length) {
    conditions.push(`gender = ANY($${paramIndex})`);
    params.push(filters.genders);
    paramIndex++;
  }

  if (filters.priceMin !== undefined) {
    conditions.push(`price_min >= $${paramIndex}`);
    params.push(filters.priceMin);
    paramIndex++;
  }

  if (filters.priceMax !== undefined) {
    conditions.push(`price_max <= $${paramIndex}`);
    params.push(filters.priceMax);
    paramIndex++;
  }

  if (filters.sustainable) {
    conditions.push(`sustainable_organic ILIKE '%yes%'`);
  }

  // Default to adult/unisex unless the user explicitly asks for kids/youth
  if (!wantsKids) {
    const kidWords = ['Kids', 'Kid', 'Youth', 'Child', 'Children', 'Childrens', 'Junior', 'Infant', 'Toddler', 'Boys', 'Girls'];
    conditions.push(`(age_group IS NULL OR age_group NOT IN (${kidWords.map((_, i) => `$${paramIndex + i}`).join(', ')}))`);
    params.push(...kidWords);
    paramIndex += kidWords.length;
  }

  // Full-text search if we have keywords
  const keywords = extractKeywords(queryText);
  if (keywords.length) {
    const searchTerms = keywords.join(' & ');
    conditions.push(`search_vector @@ to_tsquery('english', $${paramIndex})`);
    params.push(searchTerms);
    paramIndex++;
  }

  // For explicit workwear intent, prefer items tagged workwear/safety
  if (workwearIntent) {
    conditions.push(`(categorisation ILIKE '%workwear%' OR categorisation ILIKE '%safety%' OR categorisation ILIKE '%hi vis%' OR categorisation ILIKE '%hi-vis%')`);
  }

  // Material filter
  if (filters.materials?.length) {
    const materialConditions = filters.materials.map((_, i) => `fabric ILIKE $${paramIndex + i}`);
    conditions.push(`(${materialConditions.join(' OR ')})`);
    params.push(...filters.materials.map(m => `%${m}%`));
    paramIndex += filters.materials.length;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT style_code, style_name, brand, product_type, primary_product_image_url,
           price_min, price_max, sustainable_organic, categorisation, retail_description
    FROM product_styles
    ${whereClause}
    ORDER BY price_min ASC
    LIMIT ${MAX_RESULTS}
  `;

  try {
    const results = await prisma.$queryRawUnsafe(query, ...params);
    return results.map(item => ({
      style_code: item.style_code,
      style_name: item.style_name,
      brand: item.brand,
      product_type: item.product_type,
      primary_product_image_url: item.primary_product_image_url,
      sustainable_organic: item.sustainable_organic,
      categorisation: item.categorisation,
      retail_description: item.retail_description,
      price_min: item.price_min,
      price_max: item.price_max
    }));
  } catch (error) {
    console.error('[smart-search] Query error:', error);
    return [];
  }
}

function buildPrompt(fullQuery, reference) {
  return `You are an expert merchandiser for a branded merchandise & workwear company.

CATALOG FACTS:
- Product types (authoritative): ${reference.productTypes.join(', ')}
- Brands (sample): ${reference.brands.slice(0, 40).join(', ')}
- Price range: £${reference.priceRange.min || 0} - £${reference.priceRange.max || 0}

SAMPLE PRODUCTS:
${buildSampleForPrompt(reference.sampleProducts || [])}

USER QUERY: "${fullQuery}"

Return JSON ONLY:
{
  "filters": {
    "productTypes": ["Product types from catalog"],
    "brands": ["Only if user names a brand"],
    "priceMin": number or null,
    "priceMax": number or null,
    "genders": ["Male","Female","Unisex"] or null,
    "materials": ["Cotton","Polyester",...],
    "sustainable": true/false/null,
    "ageGroups": ["Adult","Youth","Kids"] or null
  },
  "explanation": "Why these filters fit",
  "matchedProducts": ["Name or style codes of 2-3 likely matches if obvious"],
  "budgetBand": "budget|mid|premium|null",
  "quantity": number or null
}

Rules:
- Use ONLY productTypes from the catalog list.
- Do not invent brands.
- Default to Adult/Unisex unless the user explicitly asks for kids/youth.
- If the query contains "uniform", prioritise Polos, Shirts, and T-Shirts.
- If user mentions budget/price/quantity, reflect it in priceMin/priceMax and quantity.
- If they mention printing/branding/embroidery, prefer product types suited to decoration (Polos, T-Shirts, Hoodies, Bags, Caps).
- If nothing clear, choose 2-3 broad types like Polos, T-Shirts, Bags.`;
}

async function runOpenAI(fullQuery, reference) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey });

  const prompt = buildPrompt(fullQuery, reference);
  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a concise assistant that only returns valid JSON. Never include prose outside JSON.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: Number(process.env.AI_TEMPERATURE ?? 0.2),
    max_tokens: Number(process.env.AI_MAX_TOKENS ?? 600)
  });

  const text = completion.choices?.[0]?.message?.content || '{}';
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    json = match ? JSON.parse(match[0]) : null;
  }
  return json;
}

// ------------------------------ Handler -------------------------------------
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method Not Allowed' }) };
  }

  const started = Date.now();
  try {
    const payload = JSON.parse(event.body || '{}');
    const query = payload.query || '';
    const selectedQuestions = payload.selectedQuestions || [];
    const fullQuery = [query, ...selectedQuestions].filter(Boolean).join('. ');

    const reference = await loadReferenceData();
    if (!reference.productTypes?.length) {
      throw new Error('Reference metadata unavailable');
    }

    // 1) LLM filter generation
    const aiJson = await runOpenAI(fullQuery, reference);
    const filtersFromAI = aiJson?.filters || null;
    const validatedFilters = filtersFromAI
      ? validateFilters(filtersFromAI, reference)
      : generateFallbackFilters(fullQuery, reference);

    // 2) Apply budget band nudges if provided
    if (aiJson?.budgetBand === 'budget' && !validatedFilters.priceMax) {
      validatedFilters.priceMax = Math.min(reference.priceRange.max || 0, 25);
    }
    if (aiJson?.budgetBand === 'premium' && !validatedFilters.priceMin) {
      validatedFilters.priceMin = Math.max(reference.priceRange.min || 0, 50);
    }

    // 3) Query database for concrete matches
    const results = await queryProducts(validatedFilters, fullQuery);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        mode: aiJson ? 'ai' : 'fallback',
        filters: validatedFilters,
        explanation: aiJson?.explanation || 'Heuristic filters applied',
        matchedProducts: aiJson?.matchedProducts || [],
        results,
        latencyMs: Date.now() - started
      })
    };
  } catch (error) {
    console.error('[smart-search] Error:', error);
    // Fallback: best-effort filters using cached metadata
    const reference = referenceCache.data || loadProductSummaryFallback() || { productTypes: [], priceRange: { min: 0, max: 0 } };
    const fallbackFilters = reference.productTypes?.length
      ? generateFallbackFilters(JSON.parse(event.body || '{}').query || '', reference)
      : {};
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message,
        filters: fallbackFilters,
        results: [],
        mode: 'fallback',
        latencyMs: Date.now() - started
      })
    };
  }
}

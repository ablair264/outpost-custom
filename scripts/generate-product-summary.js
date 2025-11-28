/**
 * Generate Product Summary for Smart Search
 *
 * This script fetches all products from Supabase and creates a lightweight
 * summary file optimized for AI-powered search.
 *
 * Run with: node scripts/generate-product-summary.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://ptmpshcuvhshcwbpaqit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0bXBzaGN1dmhzaGN3YnBhcWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODExNDIsImV4cCI6MjA3NDE1NzE0Mn0.Nrt89ux7TWCwPojWDgtDk3wXbeyT51ruMjmuzcvnlCY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Extract key features from specification text
function extractKeyFeatures(spec, retailDesc, productFeatures) {
  const features = [];

  // Add product features if available
  if (productFeatures) {
    [productFeatures.feature1, productFeatures.feature2, productFeatures.feature3]
      .filter(Boolean)
      .forEach(f => features.push(f));
  }

  // Extract from retail description
  if (retailDesc) {
    const desc = retailDesc.toLowerCase();
    if (desc.includes('brushed')) features.push('brushed fabric');
    if (desc.includes('moisture wicking')) features.push('moisture wicking');
    if (desc.includes('breathable')) features.push('breathable');
    if (desc.includes('water resistant') || desc.includes('waterproof')) features.push('water resistant');
    if (desc.includes('soft')) features.push('soft');
    if (desc.includes('warm')) features.push('warm');
    if (desc.includes('lightweight')) features.push('lightweight');
    if (desc.includes('durable')) features.push('durable');
    if (desc.includes('stretch')) features.push('stretch');
    if (desc.includes('fleece')) features.push('fleece');
  }

  return [...new Set(features)].slice(0, 5); // Max 5 unique features
}

// Extract material/fabric info in simple terms
function extractMaterials(fabric) {
  if (!fabric) return [];

  const materials = [];
  const lower = fabric.toLowerCase();

  if (lower.includes('cotton')) materials.push('Cotton');
  if (lower.includes('polyester')) materials.push('Polyester');
  if (lower.includes('recycled')) materials.push('Recycled');
  if (lower.includes('organic')) materials.push('Organic');
  if (lower.includes('viscose')) materials.push('Viscose');
  if (lower.includes('elastane') || lower.includes('spandex')) materials.push('Stretch');
  if (lower.includes('fleece')) materials.push('Fleece');
  if (lower.includes('wool')) materials.push('Wool');

  return [...new Set(materials)];
}

// Categorize product for better search
function categorizeProduct(productType, categorisation) {
  const categories = [];

  // Add product type
  if (productType) categories.push(productType);

  // Extract from categorisation string
  if (categorisation) {
    const cats = categorisation.split('|').map(c => c.trim());

    // Add relevant categories
    if (cats.some(c => c.includes('Workwear') || c.includes('Safety'))) categories.push('Workwear');
    if (cats.some(c => c.includes('Corporate') || c.includes('Office'))) categories.push('Corporate');
    if (cats.some(c => c.includes('Sport') || c.includes('Athletic'))) categories.push('Sports');
    if (cats.some(c => c.includes('Casual') || c.includes('Streetwear'))) categories.push('Casual');
    if (cats.some(c => c.includes('Outdoor'))) categories.push('Outdoor');
    if (cats.some(c => c.includes('Premium') || c.includes('Luxury'))) categories.push('Premium');
    if (cats.some(c => c.includes('Budget') || c.includes('Value'))) categories.push('Budget');
    if (cats.some(c => c.includes('Eco') || c.includes('Organic') || c.includes('Sustainable'))) categories.push('Sustainable');
  }

  return [...new Set(categories)];
}

// Group products by style_code
function groupProductsByStyle(products) {
  const grouped = new Map();

  products.forEach(product => {
    const key = product.style_code;

    if (!grouped.has(key)) {
      const price = parseFloat(product.single_price) || 0;
      grouped.set(key, {
        style_code: product.style_code,
        style_name: product.style_name,
        brand: product.brand,
        product_type: product.product_type,
        price_range: { min: price, max: price },
        gender: product.gender,
        age_group: product.age_group,
        colors: [product.colour_name],
        sizes: [product.size_name],
        size_range: product.size_range,
        features: extractKeyFeatures(
          product.specification,
          product.retail_description,
          {
            feature1: product.product_feature_1,
            feature2: product.product_feature_2,
            feature3: product.product_feature_3
          }
        ),
        materials: extractMaterials(product.fabric),
        sustainable: (product.sustainable_organic || '').toLowerCase() === 'yes',
        categories: categorizeProduct(product.product_type, product.categorisation),
        description: product.retail_description?.substring(0, 200) || '',
        image: product.primary_product_image_url,
        variant_count: 1
      });
    } else {
      const group = grouped.get(key);
      group.variant_count++;

      // Update price range
      const price = parseFloat(product.single_price) || 0;
      group.price_range.min = Math.min(group.price_range.min, price);
      group.price_range.max = Math.max(group.price_range.max, price);

      // Add unique colors and sizes
      if (!group.colors.includes(product.colour_name)) {
        group.colors.push(product.colour_name);
      }
      if (!group.sizes.includes(product.size_name)) {
        group.sizes.push(product.size_name);
      }
    }
  });

  return Array.from(grouped.values());
}

// Main function to generate summary
async function generateProductSummary() {
  console.log('🔍 Fetching products from Supabase...');

  try {
    // Fetch all products
    const { data: products, error } = await supabase
      .from('product_data')
      .select(`
        style_code,
        style_name,
        brand,
        product_type,
        colour_name,
        size_name,
        size_range,
        single_price,
        gender,
        age_group,
        fabric,
        sustainable_organic,
        categorisation,
        retail_description,
        specification,
        product_feature_1,
        product_feature_2,
        product_feature_3,
        primary_product_image_url
      `);

    if (error) throw error;

    console.log(`✅ Fetched ${products.length} product variants`);

    // Group products by style
    console.log('📦 Grouping products by style...');
    const groupedProducts = groupProductsByStyle(products);
    console.log(`✅ Grouped into ${groupedProducts.length} unique products`);

    // Generate metadata
    const metadata = {
      generated_at: new Date().toISOString(),
      total_products: groupedProducts.length,
      total_variants: products.length,
      brands: [...new Set(products.map(p => p.brand))].filter(Boolean).sort(),
      product_types: [...new Set(products.map(p => p.product_type))].filter(Boolean).sort(),
      genders: [...new Set(products.map(p => p.gender))].filter(Boolean).sort(),
      age_groups: [...new Set(products.map(p => p.age_group))].filter(Boolean).sort(),
      price_range: {
        min: Math.min(...products.map(p => parseFloat(p.single_price) || Infinity)),
        max: Math.max(...products.map(p => parseFloat(p.single_price) || 0))
      }
    };

    // Create summary object
    const summary = {
      metadata,
      products: groupedProducts
    };

    // Write to file
    const outputPath = path.join(__dirname, '..', 'public', 'product-summary.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

    console.log(`\n✨ Product summary generated successfully!`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`\n📊 Summary Stats:`);
    console.log(`   - Unique products: ${groupedProducts.length}`);
    console.log(`   - Total variants: ${products.length}`);
    console.log(`   - Brands: ${metadata.brands.length}`);
    console.log(`   - Product types: ${metadata.product_types.length}`);
    console.log(`   - Price range: £${metadata.price_range.min.toFixed(2)} - £${metadata.price_range.max.toFixed(2)}`);
    console.log(`   - File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error generating product summary:', error);
    process.exit(1);
  }
}

// Run the script
generateProductSummary();

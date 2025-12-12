import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'outpost-admin-jwt-secret-change-in-production';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Verify authentication
  const user = verifyToken(event.headers.authorization || event.headers.Authorization);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'Unauthorized' }),
    };
  }

  const path = event.path.replace('/.netlify/functions/products-admin', '');
  const method = event.httpMethod;
  const params = event.queryStringParameters || {};

  try {
    // ==========================================
    // DRILL-DOWN VIEWS
    // ==========================================

    // GET /products-admin/brands - List all brands with aggregates
    if (method === 'GET' && path === '/brands') {
      const { search, cursor, limit = '50' } = params;
      const limitNum = parseInt(limit);

      let query = `
        SELECT
          brand,
          COUNT(DISTINCT style_code) as style_count,
          COUNT(*) as variant_count,
          AVG(margin_percentage) as avg_margin,
          AVG(single_price) as avg_cost,
          AVG(final_price) as avg_final_price,
          SUM(CASE WHEN is_special_offer THEN 1 ELSE 0 END) as special_offer_count
        FROM product_data
        WHERE single_price IS NOT NULL
      `;

      if (search) {
        query += ` AND brand ILIKE '%${search.replace(/'/g, "''")}%'`;
      }

      if (cursor) {
        query += ` AND brand > '${cursor.replace(/'/g, "''")}'`;
      }

      query += ` GROUP BY brand ORDER BY brand ASC LIMIT ${limitNum + 1}`;

      const results = await sql.query(query);
      const hasMore = results.length > limitNum;
      const brands = hasMore ? results.slice(0, -1) : results;
      const nextCursor = hasMore ? brands[brands.length - 1].brand : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          brands,
          nextCursor,
          hasMore,
        }),
      };
    }

    // GET /products-admin/product-types - List all product types with aggregates
    if (method === 'GET' && path === '/product-types') {
      const { search, brand, cursor, limit = '50' } = params;
      const limitNum = parseInt(limit);

      let query = `
        SELECT
          product_type,
          COUNT(DISTINCT style_code) as style_count,
          COUNT(*) as variant_count,
          AVG(margin_percentage) as avg_margin,
          AVG(single_price) as avg_cost,
          AVG(final_price) as avg_final_price,
          SUM(CASE WHEN is_special_offer THEN 1 ELSE 0 END) as special_offer_count
        FROM product_data
        WHERE single_price IS NOT NULL
      `;

      if (brand) {
        query += ` AND brand = '${brand.replace(/'/g, "''")}'`;
      }

      if (search) {
        query += ` AND product_type ILIKE '%${search.replace(/'/g, "''")}%'`;
      }

      if (cursor) {
        query += ` AND product_type > '${cursor.replace(/'/g, "''")}'`;
      }

      query += ` GROUP BY product_type ORDER BY product_type ASC LIMIT ${limitNum + 1}`;

      const results = await sql.query(query);
      const hasMore = results.length > limitNum;
      const productTypes = hasMore ? results.slice(0, -1) : results;
      const nextCursor = hasMore ? productTypes[productTypes.length - 1].product_type : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          productTypes,
          nextCursor,
          hasMore,
        }),
      };
    }

    // GET /products-admin/styles - List styles with aggregates
    if (method === 'GET' && path === '/styles') {
      const { search, brand, productType, cursor, limit = '50' } = params;
      const limitNum = parseInt(limit);

      let query = `
        SELECT
          style_code,
          style_name,
          brand,
          product_type,
          COUNT(*) as variant_count,
          AVG(margin_percentage) as avg_margin,
          MIN(single_price) as min_cost,
          MAX(single_price) as max_cost,
          MIN(final_price) as min_final_price,
          MAX(final_price) as max_final_price,
          SUM(CASE WHEN is_special_offer THEN 1 ELSE 0 END) as special_offer_count,
          MAX(primary_product_image_url) as image_url
        FROM product_data
        WHERE single_price IS NOT NULL
      `;

      if (brand) {
        query += ` AND brand = '${brand.replace(/'/g, "''")}'`;
      }

      if (productType) {
        query += ` AND product_type = '${productType.replace(/'/g, "''")}'`;
      }

      if (search) {
        const searchEscaped = search.replace(/'/g, "''");
        query += ` AND (style_code ILIKE '%${searchEscaped}%' OR style_name ILIKE '%${searchEscaped}%')`;
      }

      if (cursor) {
        query += ` AND style_code > '${cursor.replace(/'/g, "''")}'`;
      }

      query += ` GROUP BY style_code, style_name, brand, product_type ORDER BY style_code ASC LIMIT ${limitNum + 1}`;

      const results = await sql.query(query);
      const hasMore = results.length > limitNum;
      const styles = hasMore ? results.slice(0, -1) : results;
      const nextCursor = hasMore ? styles[styles.length - 1].style_code : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          styles,
          nextCursor,
          hasMore,
        }),
      };
    }

    // GET /products-admin/variants - List individual product variants (SKUs)
    if (method === 'GET' && path === '/variants') {
      const { styleCode, brand, productType, search, cursor, limit = '50' } = params;
      const limitNum = parseInt(limit);

      let conditions = ['single_price IS NOT NULL'];

      if (styleCode) {
        conditions.push(`style_code = '${styleCode.replace(/'/g, "''")}'`);
      }

      if (brand) {
        conditions.push(`brand = '${brand.replace(/'/g, "''")}'`);
      }

      if (productType) {
        conditions.push(`product_type = '${productType.replace(/'/g, "''")}'`);
      }

      if (search) {
        const searchEscaped = search.replace(/'/g, "''");
        conditions.push(`(sku_code ILIKE '%${searchEscaped}%' OR style_name ILIKE '%${searchEscaped}%' OR brand ILIKE '%${searchEscaped}%')`);
      }

      if (cursor) {
        conditions.push(`id > '${cursor.replace(/'/g, "''")}'::uuid`);
      }

      const query = `
        SELECT
          id, sku_code, style_code, style_name, brand, product_type,
          colour_code, colour_name, size_code, size_name,
          single_price, margin_percentage, calculated_price, final_price,
          is_special_offer, offer_discount_percentage, applied_rule_id,
          primary_product_image_url, sku_status
        FROM product_data
        WHERE ${conditions.join(' AND ')}
        ORDER BY id ASC
        LIMIT ${limitNum + 1}
      `;

      const results = await sql.query(query);
      const hasMore = results.length > limitNum;
      const variants = hasMore ? results.slice(0, -1) : results;
      const nextCursor = hasMore ? variants[variants.length - 1].id : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          variants,
          nextCursor,
          hasMore,
        }),
      };
    }

    // GET /products-admin/all - Flat list of all products with cursor pagination
    if (method === 'GET' && path === '/all') {
      const { search, brand, productType, hasSpecialOffer, cursor, limit = '50', sortBy = 'sku_code', sortDir = 'asc' } = params;
      const limitNum = parseInt(limit);

      let conditions = ['single_price IS NOT NULL'];

      if (brand) {
        conditions.push(`brand = '${brand.replace(/'/g, "''")}'`);
      }

      if (productType) {
        conditions.push(`product_type = '${productType.replace(/'/g, "''")}'`);
      }

      if (hasSpecialOffer === 'true') {
        conditions.push(`is_special_offer = true`);
      }

      if (search) {
        const searchEscaped = search.replace(/'/g, "''");
        conditions.push(`(sku_code ILIKE '%${searchEscaped}%' OR style_name ILIKE '%${searchEscaped}%' OR brand ILIKE '%${searchEscaped}%')`);
      }

      // Validate sort column
      const validSortColumns = ['sku_code', 'style_name', 'brand', 'product_type', 'single_price', 'final_price', 'margin_percentage'];
      const safeSort = validSortColumns.includes(sortBy) ? sortBy : 'sku_code';
      const safeSortDir = sortDir.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

      // For cursor pagination, we need to handle the sort column
      if (cursor) {
        const operator = safeSortDir === 'ASC' ? '>' : '<';
        conditions.push(`${safeSort} ${operator} '${cursor.replace(/'/g, "''")}'`);
      }

      const query = `
        SELECT
          id, sku_code, style_code, style_name, brand, product_type,
          colour_code, colour_name, size_code, size_name,
          single_price, margin_percentage, calculated_price, final_price,
          is_special_offer, offer_discount_percentage, applied_rule_id,
          primary_product_image_url, sku_status
        FROM product_data
        WHERE ${conditions.join(' AND ')}
        ORDER BY ${safeSort} ${safeSortDir}
        LIMIT ${limitNum + 1}
      `;

      const results = await sql.query(query);
      const hasMore = results.length > limitNum;
      const products = hasMore ? results.slice(0, -1) : results;
      const nextCursor = hasMore ? products[products.length - 1][safeSort] : null;

      // Get total count for display
      const countQuery = `SELECT COUNT(*) as total FROM product_data WHERE ${conditions.join(' AND ').replace(new RegExp(`AND ${safeSort} [><] '[^']*'`), '')}`;
      const countResult = await sql.query(countQuery);
      const total = parseInt(countResult[0]?.total || 0);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          products,
          nextCursor,
          hasMore,
          total,
        }),
      };
    }

    // ==========================================
    // AGGREGATES & STATS
    // ==========================================

    // GET /products-admin/stats - Dashboard stats
    if (method === 'GET' && path === '/stats') {
      const stats = await sql`
        SELECT
          COUNT(*) as total_products,
          COUNT(DISTINCT style_code) as total_styles,
          COUNT(DISTINCT brand) as total_brands,
          COUNT(DISTINCT product_type) as total_product_types,
          AVG(margin_percentage) as avg_margin,
          SUM(CASE WHEN is_special_offer THEN 1 ELSE 0 END) as special_offer_count,
          AVG(single_price) as avg_cost,
          AVG(final_price) as avg_final_price
        FROM product_data
        WHERE single_price IS NOT NULL
      `;

      const rulesCount = await sql`SELECT COUNT(*) as count FROM margin_rules WHERE is_active = true`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          stats: {
            ...stats[0],
            activeRulesCount: parseInt(rulesCount[0]?.count || 0),
          },
        }),
      };
    }

    // GET /products-admin/filter-values - Get unique values for filters
    if (method === 'GET' && path === '/filter-values') {
      const [brands, productTypes] = await Promise.all([
        sql`SELECT DISTINCT brand FROM product_data WHERE brand IS NOT NULL ORDER BY brand`,
        sql`SELECT DISTINCT product_type FROM product_data WHERE product_type IS NOT NULL ORDER BY product_type`,
      ]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          brands: brands.map(b => b.brand),
          productTypes: productTypes.map(t => t.product_type),
        }),
      };
    }

    // ==========================================
    // BULK OPERATIONS
    // ==========================================

    // POST /products-admin/bulk/special-offer - Apply special offer to selected products
    if (method === 'POST' && path === '/bulk/special-offer') {
      const data = JSON.parse(event.body);
      const { skuCodes, discountPercentage, isSpecialOffer = true } = data;

      if (!skuCodes || !Array.isArray(skuCodes) || skuCodes.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'skuCodes array is required' }),
        };
      }

      // Convert to SQL array
      const skuArray = skuCodes.map(s => `'${s.replace(/'/g, "''")}'`).join(',');

      if (isSpecialOffer) {
        await sql.query(`
          UPDATE product_data SET
            is_special_offer = true,
            offer_discount_percentage = ${discountPercentage || 0},
            final_price = ROUND(calculated_price * (1 - ${discountPercentage || 0}/100), 2)
          WHERE sku_code IN (${skuArray})
        `);
      } else {
        await sql.query(`
          UPDATE product_data SET
            is_special_offer = false,
            offer_discount_percentage = NULL,
            final_price = calculated_price
          WHERE sku_code IN (${skuArray})
        `);
      }

      // Log the bulk operation
      await sql`
        INSERT INTO margin_audit_log (action, affected_product_count, performed_by, rule_snapshot)
        VALUES ('bulk_special_offer', ${skuCodes.length}, ${user.id}::uuid, ${JSON.stringify({ skuCodes, discountPercentage, isSpecialOffer })}::jsonb)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Updated ${skuCodes.length} products`,
          affectedCount: skuCodes.length,
        }),
      };
    }

    // POST /products-admin/bulk/margin - Apply margin override to selected products
    if (method === 'POST' && path === '/bulk/margin') {
      const data = JSON.parse(event.body);
      const { skuCodes, marginPercentage } = data;

      if (!skuCodes || !Array.isArray(skuCodes) || skuCodes.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'skuCodes array is required' }),
        };
      }

      if (marginPercentage === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'marginPercentage is required' }),
        };
      }

      // Convert to SQL array
      const skuArray = skuCodes.map(s => `'${s.replace(/'/g, "''")}'`).join(',');

      await sql.query(`
        UPDATE product_data SET
          margin_percentage = ${marginPercentage},
          calculated_price = ROUND(single_price * (1 + ${marginPercentage}/100), 2),
          final_price = CASE
            WHEN is_special_offer AND offer_discount_percentage IS NOT NULL
            THEN ROUND(single_price * (1 + ${marginPercentage}/100) * (1 - offer_discount_percentage/100), 2)
            ELSE ROUND(single_price * (1 + ${marginPercentage}/100), 2)
          END,
          applied_rule_id = NULL
        WHERE sku_code IN (${skuArray})
      `);

      // Log the bulk operation
      await sql`
        INSERT INTO margin_audit_log (action, affected_product_count, performed_by, rule_snapshot)
        VALUES ('bulk_margin_override', ${skuCodes.length}, ${user.id}::uuid, ${JSON.stringify({ skuCodes, marginPercentage })}::jsonb)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Updated margin for ${skuCodes.length} products`,
          affectedCount: skuCodes.length,
        }),
      };
    }

    // POST /products-admin/bulk/select-by-filter - Get SKU codes matching filter criteria
    if (method === 'POST' && path === '/bulk/select-by-filter') {
      const data = JSON.parse(event.body);
      const { brand, productType, styleCode, hasSpecialOffer } = data;

      let conditions = ['single_price IS NOT NULL'];

      if (brand) {
        conditions.push(`brand = '${brand.replace(/'/g, "''")}'`);
      }

      if (productType) {
        conditions.push(`product_type = '${productType.replace(/'/g, "''")}'`);
      }

      if (styleCode) {
        conditions.push(`style_code = '${styleCode.replace(/'/g, "''")}'`);
      }

      if (hasSpecialOffer !== undefined) {
        conditions.push(`is_special_offer = ${hasSpecialOffer}`);
      }

      const query = `SELECT sku_code FROM product_data WHERE ${conditions.join(' AND ')}`;
      const results = await sql.query(query);
      const skuCodes = results.map(r => r.sku_code);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          skuCodes,
          count: skuCodes.length,
        }),
      };
    }

    // ==========================================
    // SINGLE PRODUCT OPERATIONS
    // ==========================================

    // GET /products-admin/:skuCode - Get single product details
    if (method === 'GET' && path.match(/^\/[A-Za-z0-9_-]+$/)) {
      const skuCode = path.substring(1);

      const products = await sql`
        SELECT pd.*,
          mr.name as rule_name,
          mr.rule_type as rule_type
        FROM product_data pd
        LEFT JOIN margin_rules mr ON mr.id = pd.applied_rule_id
        WHERE pd.sku_code = ${skuCode}
      `;

      if (products.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Product not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, product: products[0] }),
      };
    }

    // PUT /products-admin/:skuCode - Update single product
    if (method === 'PUT' && path.match(/^\/[A-Za-z0-9_-]+$/)) {
      const skuCode = path.substring(1);
      const data = JSON.parse(event.body);
      const { marginPercentage, isSpecialOffer, offerDiscountPercentage } = data;

      // Build update
      let updates = ['updated_at = NOW()'];

      if (marginPercentage !== undefined) {
        updates.push(`margin_percentage = ${marginPercentage}`);
        updates.push(`calculated_price = ROUND(single_price * (1 + ${marginPercentage}/100), 2)`);
        updates.push(`applied_rule_id = NULL`); // Clear applied rule when manually overriding
      }

      if (isSpecialOffer !== undefined) {
        updates.push(`is_special_offer = ${isSpecialOffer}`);
      }

      if (offerDiscountPercentage !== undefined) {
        updates.push(`offer_discount_percentage = ${offerDiscountPercentage || null}`);
      }

      // Recalculate final price
      const finalPriceUpdate = `
        final_price = CASE
          WHEN ${isSpecialOffer !== undefined ? isSpecialOffer : 'is_special_offer'} AND ${offerDiscountPercentage !== undefined ? offerDiscountPercentage : 'offer_discount_percentage'} IS NOT NULL
          THEN ROUND(COALESCE(${marginPercentage !== undefined ? `single_price * (1 + ${marginPercentage}/100)` : 'calculated_price'}, single_price * 1.30) * (1 - ${offerDiscountPercentage !== undefined ? offerDiscountPercentage : 'offer_discount_percentage'}/100), 2)
          ELSE COALESCE(${marginPercentage !== undefined ? `ROUND(single_price * (1 + ${marginPercentage}/100), 2)` : 'calculated_price'}, ROUND(single_price * 1.30, 2))
        END
      `;
      updates.push(finalPriceUpdate);

      const query = `UPDATE product_data SET ${updates.join(', ')} WHERE sku_code = $1 RETURNING *`;
      const result = await sql.query(query, [skuCode]);

      if (result.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Product not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, product: result[0] }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Products admin function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
    };
  }
}

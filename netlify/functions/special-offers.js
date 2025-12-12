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

  const path = event.path.replace('/.netlify/functions/special-offers', '');
  const method = event.httpMethod;
  const params = event.queryStringParameters || {};

  try {
    // GET /special-offers - List all special offers
    if (method === 'GET' && (path === '' || path === '/')) {
      const { includeInactive, includeExpired } = params;

      let conditions = [];

      if (includeInactive !== 'true') {
        conditions.push('is_active = true');
      }

      if (includeExpired !== 'true') {
        conditions.push('(end_date IS NULL OR end_date > NOW())');
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = `
        SELECT so.*,
          (
            SELECT COUNT(*) FROM product_data pd
            WHERE pd.is_special_offer = true
            AND (
              (so.rule_type = 'product_override' AND pd.sku_code = so.sku_code)
              OR (so.rule_type = 'brand' AND pd.brand = so.brand)
              OR (so.rule_type = 'product_type' AND pd.product_type = so.product_type)
              OR (so.rule_type = 'category' AND pd.categorisation ILIKE '%' || so.category || '%')
            )
          ) as affected_count
        FROM special_offers so
        ${whereClause}
        ORDER BY so.created_at DESC
      `;

      const offers = await sql.query(query);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, offers }),
      };
    }

    // GET /special-offers/:id - Get single offer
    if (method === 'GET' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);

      const offers = await sql`
        SELECT * FROM special_offers WHERE id = ${id}::uuid
      `;

      if (offers.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Offer not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, offer: offers[0] }),
      };
    }

    // POST /special-offers - Create new offer
    if (method === 'POST' && (path === '' || path === '/')) {
      const data = JSON.parse(event.body);
      const { name, discountPercentage, ruleType, productType, category, brand, skuCode, startDate, endDate } = data;

      if (!name || discountPercentage === undefined || !ruleType) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Name, discountPercentage, and ruleType are required' }),
        };
      }

      const result = await sql`
        INSERT INTO special_offers (name, discount_percentage, rule_type, product_type, category, brand, sku_code, start_date, end_date, created_by)
        VALUES (${name}, ${discountPercentage}, ${ruleType}, ${productType || null}, ${category || null}, ${brand || null}, ${skuCode || null}, ${startDate || null}, ${endDate || null}, ${user.id}::uuid)
        RETURNING *
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, offer: result[0] }),
      };
    }

    // PUT /special-offers/:id - Update offer
    if (method === 'PUT' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);
      const data = JSON.parse(event.body);
      const { name, discountPercentage, ruleType, productType, category, brand, skuCode, startDate, endDate, isActive } = data;

      const currentOffer = await sql`SELECT * FROM special_offers WHERE id = ${id}::uuid`;
      if (currentOffer.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Offer not found' }),
        };
      }

      const result = await sql`
        UPDATE special_offers SET
          name = COALESCE(${name}, name),
          discount_percentage = COALESCE(${discountPercentage}, discount_percentage),
          rule_type = COALESCE(${ruleType}, rule_type),
          product_type = ${productType !== undefined ? productType : currentOffer[0].product_type},
          category = ${category !== undefined ? category : currentOffer[0].category},
          brand = ${brand !== undefined ? brand : currentOffer[0].brand},
          sku_code = ${skuCode !== undefined ? skuCode : currentOffer[0].sku_code},
          start_date = ${startDate !== undefined ? startDate : currentOffer[0].start_date},
          end_date = ${endDate !== undefined ? endDate : currentOffer[0].end_date},
          is_active = COALESCE(${isActive}, is_active)
        WHERE id = ${id}::uuid
        RETURNING *
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, offer: result[0] }),
      };
    }

    // DELETE /special-offers/:id - Soft delete offer
    if (method === 'DELETE' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);

      await sql`UPDATE special_offers SET is_active = false WHERE id = ${id}::uuid`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Offer deactivated' }),
      };
    }

    // POST /special-offers/:id/apply - Apply offer to matching products
    if (method === 'POST' && path.match(/^\/[a-f0-9-]+\/apply$/)) {
      const id = path.split('/')[1];

      const offers = await sql`SELECT * FROM special_offers WHERE id = ${id}::uuid AND is_active = true`;
      if (offers.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Active offer not found' }),
        };
      }

      const offer = offers[0];
      let whereClause = 'WHERE single_price IS NOT NULL';

      if (offer.rule_type === 'product_override' && offer.sku_code) {
        whereClause += ` AND sku_code = '${offer.sku_code.replace(/'/g, "''")}'`;
      } else if (offer.rule_type === 'brand' && offer.brand) {
        whereClause += ` AND brand = '${offer.brand.replace(/'/g, "''")}'`;
      } else if (offer.rule_type === 'product_type' && offer.product_type) {
        whereClause += ` AND product_type = '${offer.product_type.replace(/'/g, "''")}'`;
      } else if (offer.rule_type === 'category' && offer.category) {
        whereClause += ` AND categorisation ILIKE '%${offer.category.replace(/'/g, "''")}%'`;
      }

      const updateQuery = `
        UPDATE product_data SET
          is_special_offer = true,
          offer_discount_percentage = ${offer.discount_percentage},
          final_price = ROUND(calculated_price * (1 - ${offer.discount_percentage}/100), 2)
        ${whereClause}
      `;

      await sql.query(updateQuery);

      // Get affected count
      const countQuery = `SELECT COUNT(*) as count FROM product_data ${whereClause} AND is_special_offer = true`;
      const countResult = await sql.query(countQuery);
      const affectedCount = parseInt(countResult[0]?.count || 0);

      // Log the operation
      await sql`
        INSERT INTO margin_audit_log (action, affected_product_count, performed_by, rule_snapshot)
        VALUES ('special_offer_applied', ${affectedCount}, ${user.id}::uuid, ${JSON.stringify(offer)}::jsonb)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Applied offer to ${affectedCount} products`,
          affectedCount,
        }),
      };
    }

    // POST /special-offers/:id/remove - Remove offer from matching products
    if (method === 'POST' && path.match(/^\/[a-f0-9-]+\/remove$/)) {
      const id = path.split('/')[1];

      const offers = await sql`SELECT * FROM special_offers WHERE id = ${id}::uuid`;
      if (offers.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Offer not found' }),
        };
      }

      const offer = offers[0];
      let whereClause = 'WHERE is_special_offer = true';

      if (offer.rule_type === 'product_override' && offer.sku_code) {
        whereClause += ` AND sku_code = '${offer.sku_code.replace(/'/g, "''")}'`;
      } else if (offer.rule_type === 'brand' && offer.brand) {
        whereClause += ` AND brand = '${offer.brand.replace(/'/g, "''")}'`;
      } else if (offer.rule_type === 'product_type' && offer.product_type) {
        whereClause += ` AND product_type = '${offer.product_type.replace(/'/g, "''")}'`;
      } else if (offer.rule_type === 'category' && offer.category) {
        whereClause += ` AND categorisation ILIKE '%${offer.category.replace(/'/g, "''")}%'`;
      }

      // Get affected count before update
      const countQuery = `SELECT COUNT(*) as count FROM product_data ${whereClause}`;
      const countResult = await sql.query(countQuery);
      const affectedCount = parseInt(countResult[0]?.count || 0);

      const updateQuery = `
        UPDATE product_data SET
          is_special_offer = false,
          offer_discount_percentage = NULL,
          final_price = calculated_price
        ${whereClause}
      `;

      await sql.query(updateQuery);

      // Log the operation
      await sql`
        INSERT INTO margin_audit_log (action, affected_product_count, performed_by, rule_snapshot)
        VALUES ('special_offer_removed', ${affectedCount}, ${user.id}::uuid, ${JSON.stringify(offer)}::jsonb)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Removed offer from ${affectedCount} products`,
          affectedCount,
        }),
      };
    }

    // POST /special-offers/preview - Preview which products would be affected
    if (method === 'POST' && path === '/preview') {
      const data = JSON.parse(event.body);
      const { ruleType, productType, category, brand, skuCode, discountPercentage } = data;

      let whereClause = 'WHERE single_price IS NOT NULL AND calculated_price IS NOT NULL';

      if (ruleType === 'product_override' && skuCode) {
        whereClause += ` AND sku_code = '${skuCode.replace(/'/g, "''")}'`;
      } else if (ruleType === 'brand' && brand) {
        whereClause += ` AND brand = '${brand.replace(/'/g, "''")}'`;
      } else if (ruleType === 'product_type' && productType) {
        whereClause += ` AND product_type = '${productType.replace(/'/g, "''")}'`;
      } else if (ruleType === 'category' && category) {
        whereClause += ` AND categorisation ILIKE '%${category.replace(/'/g, "''")}%'`;
      }

      const query = `
        SELECT
          COUNT(*) as total_count,
          AVG(calculated_price) as avg_current_price,
          AVG(calculated_price * (1 - ${discountPercentage}/100)) as avg_offer_price,
          MIN(calculated_price * (1 - ${discountPercentage}/100)) as min_offer_price,
          MAX(calculated_price * (1 - ${discountPercentage}/100)) as max_offer_price
        FROM product_data
        ${whereClause}
      `;

      const result = await sql.query(query);
      const stats = result[0];

      // Get sample products
      const sampleQuery = `
        SELECT sku_code, style_name, brand, product_type, calculated_price,
          calculated_price * (1 - ${discountPercentage}/100) as projected_price
        FROM product_data
        ${whereClause}
        ORDER BY RANDOM()
        LIMIT 10
      `;

      const samples = await sql.query(sampleQuery);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          preview: {
            totalAffected: parseInt(stats.total_count || 0),
            avgCurrentPrice: parseFloat(stats.avg_current_price || 0).toFixed(2),
            avgOfferPrice: parseFloat(stats.avg_offer_price || 0).toFixed(2),
            minOfferPrice: parseFloat(stats.min_offer_price || 0).toFixed(2),
            maxOfferPrice: parseFloat(stats.max_offer_price || 0).toFixed(2),
            samples,
          },
        }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Special offers function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
    };
  }
}

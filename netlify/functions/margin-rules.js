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

// Rule type priority mapping
const RULE_PRIORITIES = {
  product_override: 1,
  product_type_category: 2,
  product_type: 3,
  brand: 4,
  category: 5,
  default: 6,
};

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

  const path = event.path.replace('/.netlify/functions/margin-rules', '');
  const method = event.httpMethod;
  const params = event.queryStringParameters || {};

  try {
    // GET /margin-rules - List all margin rules
    if (method === 'GET' && (path === '' || path === '/')) {
      const { includeInactive } = params;

      const rules = includeInactive === 'true'
        ? await sql`
            SELECT mr.*,
              (SELECT COUNT(*) FROM product_data pd WHERE pd.applied_rule_id = mr.id) as affected_count
            FROM margin_rules mr
            ORDER BY mr.priority ASC, mr.name ASC
          `
        : await sql`
            SELECT mr.*,
              (SELECT COUNT(*) FROM product_data pd WHERE pd.applied_rule_id = mr.id) as affected_count
            FROM margin_rules mr
            WHERE mr.is_active = true
            ORDER BY mr.priority ASC, mr.name ASC
          `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, rules }),
      };
    }

    // GET /margin-rules/:id - Get single rule
    if (method === 'GET' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);

      const rules = await sql`
        SELECT mr.*,
          (SELECT COUNT(*) FROM product_data pd WHERE pd.applied_rule_id = mr.id) as affected_count
        FROM margin_rules mr
        WHERE mr.id = ${id}::uuid
      `;

      if (rules.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Rule not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, rule: rules[0] }),
      };
    }

    // POST /margin-rules - Create new rule
    if (method === 'POST' && (path === '' || path === '/')) {
      const data = JSON.parse(event.body);
      const { name, ruleType, productType, category, brand, skuCode, marginPercentage } = data;

      if (!name || !ruleType || marginPercentage === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Name, ruleType, and marginPercentage are required' }),
        };
      }

      const priority = RULE_PRIORITIES[ruleType];
      if (!priority) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid rule type' }),
        };
      }

      const result = await sql`
        INSERT INTO margin_rules (name, priority, rule_type, product_type, category, brand, sku_code, margin_percentage, created_by)
        VALUES (${name}, ${priority}, ${ruleType}, ${productType || null}, ${category || null}, ${brand || null}, ${skuCode || null}, ${marginPercentage}, ${user.id}::uuid)
        RETURNING *
      `;

      // Log the creation
      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, performed_by)
        VALUES ('rule_created', ${result[0].id}::uuid, ${JSON.stringify(result[0])}::jsonb, ${user.id}::uuid)
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, rule: result[0] }),
      };
    }

    // PUT /margin-rules/:id - Update rule
    if (method === 'PUT' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);
      const data = JSON.parse(event.body);
      const { name, ruleType, productType, category, brand, skuCode, marginPercentage, isActive } = data;

      // Get current rule for audit
      const currentRule = await sql`SELECT * FROM margin_rules WHERE id = ${id}::uuid`;
      if (currentRule.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Rule not found' }),
        };
      }

      const priority = ruleType ? RULE_PRIORITIES[ruleType] : currentRule[0].priority;

      const result = await sql`
        UPDATE margin_rules SET
          name = COALESCE(${name}, name),
          priority = ${priority},
          rule_type = COALESCE(${ruleType}, rule_type),
          product_type = ${productType !== undefined ? productType : currentRule[0].product_type},
          category = ${category !== undefined ? category : currentRule[0].category},
          brand = ${brand !== undefined ? brand : currentRule[0].brand},
          sku_code = ${skuCode !== undefined ? skuCode : currentRule[0].sku_code},
          margin_percentage = COALESCE(${marginPercentage}, margin_percentage),
          is_active = COALESCE(${isActive}, is_active),
          updated_at = NOW()
        WHERE id = ${id}::uuid
        RETURNING *
      `;

      // Log the update
      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, performed_by, rollback_data)
        VALUES ('rule_updated', ${id}::uuid, ${JSON.stringify(result[0])}::jsonb, ${user.id}::uuid, ${JSON.stringify(currentRule[0])}::jsonb)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, rule: result[0] }),
      };
    }

    // DELETE /margin-rules/:id - Soft delete rule
    if (method === 'DELETE' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);

      // Get current rule for audit
      const currentRule = await sql`SELECT * FROM margin_rules WHERE id = ${id}::uuid`;
      if (currentRule.length === 0) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Rule not found' }),
        };
      }

      // Don't allow deleting the default rule
      if (currentRule[0].rule_type === 'default') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Cannot delete the default margin rule' }),
        };
      }

      // Soft delete
      await sql`UPDATE margin_rules SET is_active = false, updated_at = NOW() WHERE id = ${id}::uuid`;

      // Log the deletion
      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, performed_by)
        VALUES ('rule_deleted', ${id}::uuid, ${JSON.stringify(currentRule[0])}::jsonb, ${user.id}::uuid)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Rule deactivated' }),
      };
    }

    // POST /margin-rules/preview - Preview which products would be affected
    if (method === 'POST' && path === '/preview') {
      const data = JSON.parse(event.body);
      const { ruleType, productType, category, brand, skuCode, marginPercentage } = data;

      let query = `
        SELECT
          COUNT(*) as total_count,
          AVG(single_price) as avg_cost,
          AVG(single_price * (1 + ${marginPercentage}/100)) as avg_new_price,
          MIN(single_price * (1 + ${marginPercentage}/100)) as min_new_price,
          MAX(single_price * (1 + ${marginPercentage}/100)) as max_new_price
        FROM product_data
        WHERE single_price IS NOT NULL
      `;

      if (ruleType === 'product_override' && skuCode) {
        query += ` AND sku_code = '${skuCode.replace(/'/g, "''")}'`;
      } else if (ruleType === 'product_type_category' && productType && category) {
        query += ` AND product_type = '${productType.replace(/'/g, "''")}' AND categorisation ILIKE '%${category.replace(/'/g, "''")}%'`;
      } else if (ruleType === 'product_type' && productType) {
        query += ` AND product_type = '${productType.replace(/'/g, "''")}'`;
      } else if (ruleType === 'brand' && brand) {
        query += ` AND brand = '${brand.replace(/'/g, "''")}'`;
      } else if (ruleType === 'category' && category) {
        query += ` AND categorisation ILIKE '%${category.replace(/'/g, "''")}%'`;
      }
      // default rule affects all products

      const result = await sql.query(query);
      const stats = result[0];

      // Get sample products
      let sampleQuery = `
        SELECT sku_code, style_name, brand, product_type, single_price,
          single_price * (1 + ${marginPercentage}/100) as projected_price
        FROM product_data
        WHERE single_price IS NOT NULL
      `;

      if (ruleType === 'product_override' && skuCode) {
        sampleQuery += ` AND sku_code = '${skuCode.replace(/'/g, "''")}'`;
      } else if (ruleType === 'product_type_category' && productType && category) {
        sampleQuery += ` AND product_type = '${productType.replace(/'/g, "''")}' AND categorisation ILIKE '%${category.replace(/'/g, "''")}%'`;
      } else if (ruleType === 'product_type' && productType) {
        sampleQuery += ` AND product_type = '${productType.replace(/'/g, "''")}'`;
      } else if (ruleType === 'brand' && brand) {
        sampleQuery += ` AND brand = '${brand.replace(/'/g, "''")}'`;
      } else if (ruleType === 'category' && category) {
        sampleQuery += ` AND categorisation ILIKE '%${category.replace(/'/g, "''")}%'`;
      }

      sampleQuery += ` ORDER BY RANDOM() LIMIT 10`;

      const samples = await sql.query(sampleQuery);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          preview: {
            totalAffected: parseInt(stats.total_count || 0),
            avgCost: parseFloat(stats.avg_cost || 0).toFixed(2),
            avgNewPrice: parseFloat(stats.avg_new_price || 0).toFixed(2),
            minNewPrice: parseFloat(stats.min_new_price || 0).toFixed(2),
            maxNewPrice: parseFloat(stats.max_new_price || 0).toFixed(2),
            samples,
          },
        }),
      };
    }

    // POST /margin-rules/apply - Apply rules to products (recalculate all prices)
    if (method === 'POST' && path === '/apply') {
      const data = JSON.parse(event.body);
      const { ruleId } = data; // Optional: apply specific rule or all rules

      // Get all active rules ordered by priority
      const rules = await sql`
        SELECT * FROM margin_rules
        WHERE is_active = true
        ORDER BY priority ASC
      `;

      let affectedCount = 0;

      // Apply rules in priority order - higher priority rules (lower number) win
      for (const rule of rules) {
        let whereClause = 'WHERE single_price IS NOT NULL';

        // Only apply this rule where no higher-priority rule has already been applied
        // Or where the rule matches more specifically
        if (rule.rule_type === 'product_override' && rule.sku_code) {
          whereClause += ` AND sku_code = '${rule.sku_code.replace(/'/g, "''")}'`;
        } else if (rule.rule_type === 'product_type_category' && rule.product_type && rule.category) {
          whereClause += ` AND product_type = '${rule.product_type.replace(/'/g, "''")}' AND categorisation ILIKE '%${rule.category.replace(/'/g, "''")}%'`;
          whereClause += ` AND (applied_rule_id IS NULL OR applied_rule_id IN (SELECT id FROM margin_rules WHERE priority > ${rule.priority}))`;
        } else if (rule.rule_type === 'product_type' && rule.product_type) {
          whereClause += ` AND product_type = '${rule.product_type.replace(/'/g, "''")}'`;
          whereClause += ` AND (applied_rule_id IS NULL OR applied_rule_id IN (SELECT id FROM margin_rules WHERE priority > ${rule.priority}))`;
        } else if (rule.rule_type === 'brand' && rule.brand) {
          whereClause += ` AND brand = '${rule.brand.replace(/'/g, "''")}'`;
          whereClause += ` AND (applied_rule_id IS NULL OR applied_rule_id IN (SELECT id FROM margin_rules WHERE priority > ${rule.priority}))`;
        } else if (rule.rule_type === 'category' && rule.category) {
          whereClause += ` AND categorisation ILIKE '%${rule.category.replace(/'/g, "''")}%'`;
          whereClause += ` AND (applied_rule_id IS NULL OR applied_rule_id IN (SELECT id FROM margin_rules WHERE priority > ${rule.priority}))`;
        } else if (rule.rule_type === 'default') {
          whereClause += ` AND (applied_rule_id IS NULL OR applied_rule_id IN (SELECT id FROM margin_rules WHERE priority > ${rule.priority}))`;
        }

        const updateQuery = `
          UPDATE product_data SET
            margin_percentage = ${rule.margin_percentage},
            calculated_price = ROUND(single_price * (1 + ${rule.margin_percentage}/100), 2),
            applied_rule_id = '${rule.id}'::uuid,
            final_price = CASE
              WHEN is_special_offer AND offer_discount_percentage IS NOT NULL
              THEN ROUND(single_price * (1 + ${rule.margin_percentage}/100) * (1 - offer_discount_percentage/100), 2)
              ELSE ROUND(single_price * (1 + ${rule.margin_percentage}/100), 2)
            END
          ${whereClause}
        `;

        await sql.query(updateQuery);
      }

      // Get final affected count
      const countResult = await sql`SELECT COUNT(*) as count FROM product_data WHERE calculated_price IS NOT NULL`;
      affectedCount = parseInt(countResult[0]?.count || 0);

      // Log the bulk apply
      await sql`
        INSERT INTO margin_audit_log (action, affected_product_count, performed_by, rule_snapshot)
        VALUES ('bulk_apply', ${affectedCount}, ${user.id}::uuid, ${JSON.stringify({ rulesApplied: rules.length })}::jsonb)
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Applied ${rules.length} rules to ${affectedCount} products`,
          affectedCount,
          rulesApplied: rules.length,
        }),
      };
    }

    // GET /margin-rules/audit - Get audit log
    if (method === 'GET' && path === '/audit') {
      const { limit = '50', offset = '0' } = params;

      const logs = await sql`
        SELECT mal.*, au.name as performed_by_name, au.email as performed_by_email
        FROM margin_audit_log mal
        LEFT JOIN admin_users au ON au.id = mal.performed_by
        ORDER BY mal.performed_at DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;

      const countResult = await sql`SELECT COUNT(*) as total FROM margin_audit_log`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          logs,
          total: parseInt(countResult[0]?.total || 0),
        }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Margin rules function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
    };
  }
}

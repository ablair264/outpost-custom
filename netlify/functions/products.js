import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/products', '');
  const method = event.httpMethod;
  const params = event.queryStringParameters || {};

  try {
    // GET /products - List products with filters
    if (method === 'GET' && (path === '' || path === '/')) {
      const {
        productType,
        brand,
        gender,
        search,
        limit = '50',
        offset = '0',
        styleCode
      } = params;

      let query = `
        SELECT * FROM product_data
        WHERE sku_status != 'Discontinued'
      `;
      const queryParams = [];
      let paramIndex = 1;

      if (styleCode) {
        query += ` AND style_code = $${paramIndex}`;
        queryParams.push(styleCode);
        paramIndex++;
      }

      if (productType) {
        query += ` AND product_type = $${paramIndex}`;
        queryParams.push(productType);
        paramIndex++;
      }

      if (brand) {
        query += ` AND brand = $${paramIndex}`;
        queryParams.push(brand);
        paramIndex++;
      }

      if (gender) {
        query += ` AND gender = $${paramIndex}`;
        queryParams.push(gender);
        paramIndex++;
      }

      if (search) {
        query += ` AND (style_name ILIKE $${paramIndex} OR brand ILIKE $${paramIndex} OR retail_description ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY style_code, colour_code LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(parseInt(limit), parseInt(offset));

      const products = await sql(query, queryParams);

      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM product_data WHERE sku_status != 'Discontinued'`;
      const countParams = [];
      let countParamIndex = 1;

      if (styleCode) {
        countQuery += ` AND style_code = $${countParamIndex}`;
        countParams.push(styleCode);
        countParamIndex++;
      }
      if (productType) {
        countQuery += ` AND product_type = $${countParamIndex}`;
        countParams.push(productType);
        countParamIndex++;
      }
      if (brand) {
        countQuery += ` AND brand = $${countParamIndex}`;
        countParams.push(brand);
        countParamIndex++;
      }
      if (gender) {
        countQuery += ` AND gender = $${countParamIndex}`;
        countParams.push(gender);
        countParamIndex++;
      }
      if (search) {
        countQuery += ` AND (style_name ILIKE $${countParamIndex} OR brand ILIKE $${countParamIndex} OR retail_description ILIKE $${countParamIndex})`;
        countParams.push(`%${search}%`);
      }

      const countResult = await sql(countQuery, countParams);
      const total = parseInt(countResult[0]?.total || '0');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          products,
          total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }),
      };
    }

    // GET /products/styles - Get aggregated product styles for browsing
    if (method === 'GET' && path === '/styles') {
      const {
        productType,
        brand,
        gender,
        search,
        limit = '24',
        offset = '0',
        priceMin,
        priceMax,
        sizes,
        colors
      } = params;

      let query = `SELECT * FROM product_styles WHERE is_live = true`;
      const queryParams = [];
      let paramIndex = 1;

      if (productType) {
        const types = productType.split(',');
        query += ` AND product_type = ANY($${paramIndex}::text[])`;
        queryParams.push(types);
        paramIndex++;
      }

      if (brand) {
        const brands = brand.split(',');
        query += ` AND brand = ANY($${paramIndex}::text[])`;
        queryParams.push(brands);
        paramIndex++;
      }

      if (gender) {
        const genders = gender.split(',');
        query += ` AND gender = ANY($${paramIndex}::text[])`;
        queryParams.push(genders);
        paramIndex++;
      }

      if (priceMin) {
        query += ` AND price_max >= $${paramIndex}`;
        queryParams.push(parseFloat(priceMin));
        paramIndex++;
      }

      if (priceMax) {
        query += ` AND price_min <= $${paramIndex}`;
        queryParams.push(parseFloat(priceMax));
        paramIndex++;
      }

      if (sizes) {
        const sizeArr = sizes.split(',');
        query += ` AND available_sizes && $${paramIndex}::text[]`;
        queryParams.push(sizeArr);
        paramIndex++;
      }

      if (colors) {
        const colorArr = colors.split(',');
        query += ` AND available_colors && $${paramIndex}::text[]`;
        queryParams.push(colorArr);
        paramIndex++;
      }

      if (search) {
        query += ` AND search_vector @@ plainto_tsquery('english', $${paramIndex})`;
        queryParams.push(search);
        paramIndex++;
      }

      // Get count first
      const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
      const countResult = await sql(countQuery, queryParams);
      const total = parseInt(countResult[0]?.total || '0');

      // Add pagination
      query += ` ORDER BY price_min ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(parseInt(limit), parseInt(offset));

      const styles = await sql(query, queryParams);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          styles,
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
          currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1
        }),
      };
    }

    // GET /products/styles/:styleCode/variants - Get all variants for a style
    if (method === 'GET' && path.match(/^\/styles\/[^/]+\/variants$/)) {
      const styleCode = path.split('/')[2];

      const products = await sql`
        SELECT * FROM product_data
        WHERE style_code = ${styleCode}
        AND sku_status != 'Discontinued'
        ORDER BY colour_code, size_code
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, products }),
      };
    }

    // GET /products/categories - Get all categories
    if (method === 'GET' && path === '/categories') {
      const { activeOnly } = params;

      let query = `
        SELECT c.*,
          (SELECT COUNT(DISTINCT style_code) FROM product_styles ps WHERE ps.product_type = c.category_key AND ps.is_live = true) as product_count
        FROM categories c
      `;

      if (activeOnly === 'true') {
        query += ` WHERE c.is_active = true`;
      }

      query += ` ORDER BY c.sort_order, c.display_name`;

      const categories = await sql(query);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, categories }),
      };
    }

    // PUT /products/categories/:id - Update category
    if (method === 'PUT' && path.match(/^\/categories\/[^/]+$/)) {
      const id = path.split('/')[2];
      const data = JSON.parse(event.body);

      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (data.display_name !== undefined) {
        updateFields.push(`display_name = $${paramIndex}`);
        updateValues.push(data.display_name);
        paramIndex++;
      }
      if (data.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(data.description);
        paramIndex++;
      }
      if (data.image_url !== undefined) {
        updateFields.push(`image_url = $${paramIndex}`);
        updateValues.push(data.image_url);
        paramIndex++;
      }
      if (data.is_active !== undefined) {
        updateFields.push(`is_active = $${paramIndex}`);
        updateValues.push(data.is_active);
        paramIndex++;
      }
      if (data.sort_order !== undefined) {
        updateFields.push(`sort_order = $${paramIndex}`);
        updateValues.push(data.sort_order);
        paramIndex++;
      }
      if (data.category_group !== undefined) {
        updateFields.push(`category_group = $${paramIndex}`);
        updateValues.push(data.category_group);
        paramIndex++;
      }

      updateFields.push(`updated_at = NOW()`);
      updateValues.push(id);

      const query = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
      const result = await sql(query, updateValues);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, category: result[0] }),
      };
    }

    // GET /products/filter-options - Get filter options
    if (method === 'GET' && path === '/filter-options') {
      const result = await sql`SELECT get_filter_options() as options`;
      const options = result[0]?.options || {};

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, ...options }),
      };
    }

    // GET /products/rgb-values - Get RGB to hex lookup
    if (method === 'GET' && path === '/rgb-values') {
      const rgbValues = await sql`SELECT rgb_text, hex FROM rgb_values`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, rgbValues }),
      };
    }

    // GET /products/brands - Get all brands with logos
    if (method === 'GET' && path === '/brands') {
      const brands = await sql`
        SELECT * FROM brand_logos
        WHERE is_active = true
        ORDER BY name
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, brands }),
      };
    }

    // GET /products/carousel - Get products for homepage carousel
    if (method === 'GET' && path === '/carousel') {
      const { limit = '12' } = params;

      // Get random featured products
      const styles = await sql`
        SELECT * FROM product_styles
        WHERE is_live = true
        AND primary_product_image_url IS NOT NULL
        ORDER BY RANDOM()
        LIMIT ${parseInt(limit)}
      `;

      // Get variants for these styles
      const styleCodes = styles.map(s => s.style_code);

      if (styleCodes.length === 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, products: [] }),
        };
      }

      const variants = await sql`
        SELECT * FROM product_data
        WHERE style_code = ANY(${styleCodes}::text[])
        AND sku_status != 'Discontinued'
        ORDER BY style_code, colour_code
      `;

      // Group variants by style
      const grouped = styles.map(style => {
        const styleVariants = variants.filter(v => v.style_code === style.style_code);
        const colors = [];
        const seenColors = new Set();

        styleVariants.forEach(v => {
          if (!seenColors.has(v.colour_code)) {
            seenColors.add(v.colour_code);
            colors.push({
              colour_code: v.colour_code,
              colour_name: v.colour_name,
              colour_image: v.colour_image,
              rgb: v.rgb,
              colour_shade: v.colour_shade
            });
          }
        });

        return {
          style_code: style.style_code,
          style_name: style.style_name,
          brand: style.brand,
          product_type: style.product_type,
          gender: style.gender,
          primary_product_image_url: style.primary_product_image_url,
          price_range: { min: parseFloat(style.price_min), max: parseFloat(style.price_max) },
          size_range: style.size_range,
          colors,
          sizes: style.available_sizes || [],
          variants: styleVariants
        };
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, products: grouped }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Products function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
    };
  }
}

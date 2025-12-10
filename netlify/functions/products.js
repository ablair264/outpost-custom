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

      // Build query using tagged template literals for safety
      // For simple queries without dynamic filters, use tagged templates directly
      if (styleCode && !productType && !brand && !gender && !search) {
        const products = await sql`
          SELECT * FROM product_data
          WHERE sku_status != 'Discontinued' AND style_code = ${styleCode}
          ORDER BY style_code, colour_code
          LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `;
        const countResult = await sql`
          SELECT COUNT(*) as total FROM product_data
          WHERE sku_status != 'Discontinued' AND style_code = ${styleCode}
        `;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            products,
            total: parseInt(countResult[0]?.total || '0'),
            limit: parseInt(limit),
            offset: parseInt(offset)
          }),
        };
      }

      // For complex queries with multiple optional filters, build dynamically
      let products, total;

      if (!productType && !brand && !gender && !search) {
        // No filters - simple query
        products = await sql`
          SELECT * FROM product_data
          WHERE sku_status != 'Discontinued'
          ORDER BY style_code, colour_code
          LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
        `;
        const countResult = await sql`SELECT COUNT(*) as total FROM product_data WHERE sku_status != 'Discontinued'`;
        total = parseInt(countResult[0]?.total || '0');
      } else {
        // Build filter conditions
        const conditions = ["sku_status != 'Discontinued'"];
        if (productType) conditions.push(`product_type = '${productType.replace(/'/g, "''")}'`);
        if (brand) conditions.push(`brand = '${brand.replace(/'/g, "''")}'`);
        if (gender) conditions.push(`gender = '${gender.replace(/'/g, "''")}'`);
        if (search) {
          const searchEscaped = search.replace(/'/g, "''");
          conditions.push(`(style_name ILIKE '%${searchEscaped}%' OR brand ILIKE '%${searchEscaped}%' OR retail_description ILIKE '%${searchEscaped}%')`);
        }

        const whereClause = conditions.join(' AND ');

        // Use sql.query for parameterized queries
        const queryStr = `SELECT * FROM product_data WHERE ${whereClause} ORDER BY style_code, colour_code LIMIT $1 OFFSET $2`;
        products = await sql.query(queryStr, [parseInt(limit), parseInt(offset)]);

        const countStr = `SELECT COUNT(*) as total FROM product_data WHERE ${whereClause}`;
        const countResult = await sql.query(countStr, []);
        total = parseInt(countResult[0]?.total || '0');
      }

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

      // Category alias mapping for common variations
      const categoryAliases = {
        'polo shirts': 'Polos',
        'polo shirt': 'Polos',
        'polos': 'Polos',
        't-shirts': 'T-Shirts',
        't-shirt': 'T-Shirts',
        'tshirts': 'T-Shirts',
        'tshirt': 'T-Shirts',
        'tees': 'T-Shirts',
        'fleeces': 'Fleece',
        'fleece': 'Fleece',
        'hoodies': 'Hoodies',
        'hoodie': 'Hoodies',
        'sweatshirts': 'Sweatshirts',
        'sweatshirt': 'Sweatshirts',
        'jackets': 'Jackets',
        'jacket': 'Jackets',
        'coats': 'Jackets',
        'coat': 'Jackets',
        'caps': 'Caps',
        'cap': 'Caps',
        'hats': 'Hats',
        'hat': 'Hats',
        'beanies': 'Beanies',
        'beanie': 'Beanies',
        'bags': 'Bags',
        'bag': 'Bags',
        'shorts': 'Shorts',
        'trousers': 'Trousers',
        'pants': 'Trousers',
        'aprons': 'Aprons',
        'apron': 'Aprons',
        'hi-vis': 'Safety Vests',
        'hi vis': 'Safety Vests',
        'high vis': 'Safety Vests',
        'high visibility': 'Safety Vests',
        'safety vest': 'Safety Vests',
        'safety vests': 'Safety Vests',
        'workwear': 'Trousers', // Default workwear to trousers, or could be multiple
        'shirts': 'Shirts',
        'shirt': 'Shirts',
        'softshells': 'Softshells',
        'softshell': 'Softshells',
        'gilets': 'Gilets & Body Warmers',
        'gilet': 'Gilets & Body Warmers',
        'body warmers': 'Gilets & Body Warmers',
        'bodywarmers': 'Gilets & Body Warmers',
      };

      // Normalize productType using aliases
      const normalizeCategory = (cat) => {
        const lower = cat.toLowerCase().trim();
        return categoryAliases[lower] || cat; // Return alias if found, else original
      };

      // Build conditions
      const conditions = ['is_live = true'];

      if (productType) {
        const types = productType.split(',').map(t => {
          const normalized = normalizeCategory(t);
          return `'${normalized.replace(/'/g, "''")}'`;
        }).join(',');
        conditions.push(`product_type IN (${types})`);
      }

      if (brand) {
        const brands = brand.split(',').map(b => `'${b.replace(/'/g, "''")}'`).join(',');
        conditions.push(`brand IN (${brands})`);
      }

      if (gender) {
        const genders = gender.split(',').map(g => `'${g.replace(/'/g, "''")}'`).join(',');
        conditions.push(`gender IN (${genders})`);
      }

      if (priceMin) {
        conditions.push(`price_max >= ${parseFloat(priceMin)}`);
      }

      if (priceMax) {
        conditions.push(`price_min <= ${parseFloat(priceMax)}`);
      }

      if (sizes) {
        const sizeArr = sizes.split(',').map(s => `'${s.replace(/'/g, "''")}'`).join(',');
        conditions.push(`available_sizes && ARRAY[${sizeArr}]::text[]`);
      }

      if (colors) {
        const colorArr = colors.split(',').map(c => `'${c.replace(/'/g, "''")}'`).join(',');
        conditions.push(`available_colors && ARRAY[${colorArr}]::text[]`);
      }

      if (search) {
        const searchEscaped = search.replace(/'/g, "''");
        conditions.push(`search_vector @@ plainto_tsquery('english', '${searchEscaped}')`);
      }

      const whereClause = conditions.join(' AND ');

      // Get count
      const countQuery = `SELECT COUNT(*) as total FROM product_styles WHERE ${whereClause}`;
      const countResult = await sql.query(countQuery, []);
      const total = parseInt(countResult[0]?.total || '0');

      // Get styles
      const stylesQuery = `SELECT * FROM product_styles WHERE ${whereClause} ORDER BY price_min ASC LIMIT $1 OFFSET $2`;
      const styles = await sql.query(stylesQuery, [parseInt(limit), parseInt(offset)]);

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

      const categories = activeOnly === 'true'
        ? await sql`
            SELECT c.*,
              (SELECT COUNT(DISTINCT style_code) FROM product_styles ps WHERE ps.product_type = c.category_key AND ps.is_live = true) as product_count
            FROM categories c
            WHERE c.is_active = true
            ORDER BY c.sort_order, c.display_name
          `
        : await sql`
            SELECT c.*,
              (SELECT COUNT(DISTINCT style_code) FROM product_styles ps WHERE ps.product_type = c.category_key AND ps.is_live = true) as product_count
            FROM categories c
            ORDER BY c.sort_order, c.display_name
          `;

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

      // Build SET clause dynamically
      const updates = [];
      if (data.display_name !== undefined) updates.push(`display_name = '${data.display_name.replace(/'/g, "''")}'`);
      if (data.description !== undefined) updates.push(`description = '${(data.description || '').replace(/'/g, "''")}'`);
      if (data.image_url !== undefined) updates.push(`image_url = '${(data.image_url || '').replace(/'/g, "''")}'`);
      if (data.is_active !== undefined) updates.push(`is_active = ${data.is_active}`);
      if (data.sort_order !== undefined) updates.push(`sort_order = ${data.sort_order}`);
      if (data.category_group !== undefined) updates.push(`category_group = '${(data.category_group || '').replace(/'/g, "''")}'`);
      updates.push('updated_at = NOW()');

      const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
      const result = await sql.query(query, [id]);

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
      const limitNum = parseInt(params.limit || '12');

      // Get random featured products
      const styles = await sql`
        SELECT * FROM product_styles
        WHERE is_live = true
        AND primary_product_image_url IS NOT NULL
        ORDER BY RANDOM()
        LIMIT ${limitNum}
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

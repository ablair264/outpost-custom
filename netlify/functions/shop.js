// Shop Content API - connects to Neon PostgreSQL
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async (req, context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace('/.netlify/functions/shop', '');
  const method = req.method;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // ============ BENTO TILES ============
    if (path === '/bento-tiles' || path === '/bento-tiles/') {
      if (method === 'GET') {
        const section = url.searchParams.get('section');
        const activeOnly = url.searchParams.get('activeOnly') === 'true';

        if (section && activeOnly) {
          const tiles = await sql`SELECT * FROM bento_tiles WHERE grid_section = ${section} AND is_active = true ORDER BY grid_section, grid_position ASC`;
          return new Response(JSON.stringify({ success: true, tiles }), { headers });
        } else if (section) {
          const tiles = await sql`SELECT * FROM bento_tiles WHERE grid_section = ${section} ORDER BY grid_section, grid_position ASC`;
          return new Response(JSON.stringify({ success: true, tiles }), { headers });
        } else if (activeOnly) {
          const tiles = await sql`SELECT * FROM bento_tiles WHERE is_active = true ORDER BY grid_section, grid_position ASC`;
          return new Response(JSON.stringify({ success: true, tiles }), { headers });
        } else {
          const tiles = await sql`SELECT * FROM bento_tiles ORDER BY grid_section, grid_position ASC`;
          return new Response(JSON.stringify({ success: true, tiles }), { headers });
        }
      }

      if (method === 'POST') {
        const body = await req.json();
        const result = await sql`
          INSERT INTO bento_tiles (title, image_url, link_url, grid_section, grid_position, span_rows, span_cols, font_size, font_position, is_active)
          VALUES (${body.title}, ${body.image_url}, ${body.link_url}, ${body.grid_section}, ${body.grid_position || 0}, ${body.span_rows || 1}, ${body.span_cols || 1}, ${body.font_size}, ${body.font_position}, ${body.is_active !== false})
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, tile: result[0] }), { headers });
      }
    }

    // Single bento tile operations
    const bentoTileMatch = path.match(/^\/bento-tiles\/([^/]+)$/);
    if (bentoTileMatch) {
      const id = bentoTileMatch[1];

      if (method === 'PUT') {
        const body = await req.json();
        const { created_at, updated_at, id: _, ...updates } = body;

        const result = await sql`
          UPDATE bento_tiles
          SET title = COALESCE(${updates.title}, title),
              image_url = COALESCE(${updates.image_url}, image_url),
              link_url = COALESCE(${updates.link_url}, link_url),
              grid_section = COALESCE(${updates.grid_section}, grid_section),
              grid_position = COALESCE(${updates.grid_position}, grid_position),
              span_rows = COALESCE(${updates.span_rows}, span_rows),
              span_cols = COALESCE(${updates.span_cols}, span_cols),
              font_size = COALESCE(${updates.font_size}, font_size),
              font_position = COALESCE(${updates.font_position}, font_position),
              is_active = COALESCE(${updates.is_active}, is_active),
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, tile: result[0] }), { headers });
      }

      if (method === 'DELETE') {
        await sql`DELETE FROM bento_tiles WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    // ============ ADVERTISEMENT SLIDES ============
    if (path === '/slides' || path === '/slides/') {
      if (method === 'GET') {
        const activeOnly = url.searchParams.get('activeOnly') === 'true';

        const slides = activeOnly
          ? await sql`SELECT * FROM advertisement_slides WHERE is_active = true ORDER BY order_position ASC`
          : await sql`SELECT * FROM advertisement_slides ORDER BY order_position ASC`;

        return new Response(JSON.stringify({ success: true, slides }), { headers });
      }

      if (method === 'POST') {
        const body = await req.json();
        const result = await sql`
          INSERT INTO advertisement_slides (image_url, alt_text, link_url, order_position, is_active)
          VALUES (${body.image_url}, ${body.alt_text}, ${body.link_url}, ${body.order_position || 0}, ${body.is_active !== false})
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, slide: result[0] }), { headers });
      }
    }

    // Single slide operations
    const slideMatch = path.match(/^\/slides\/([^/]+)$/);
    if (slideMatch) {
      const id = slideMatch[1];

      if (method === 'PUT') {
        const body = await req.json();
        const { created_at, updated_at, id: _, ...updates } = body;

        const result = await sql`
          UPDATE advertisement_slides
          SET image_url = COALESCE(${updates.image_url}, image_url),
              alt_text = COALESCE(${updates.alt_text}, alt_text),
              link_url = COALESCE(${updates.link_url}, link_url),
              order_position = COALESCE(${updates.order_position}, order_position),
              is_active = COALESCE(${updates.is_active}, is_active),
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, slide: result[0] }), { headers });
      }

      if (method === 'DELETE') {
        await sql`DELETE FROM advertisement_slides WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    // ============ HERO GRID IMAGES ============
    if (path === '/hero-images' || path === '/hero-images/') {
      if (method === 'GET') {
        const activeOnly = url.searchParams.get('activeOnly') === 'true';

        const images = activeOnly
          ? await sql`SELECT * FROM hero_grid_images WHERE is_active = true ORDER BY position ASC`
          : await sql`SELECT * FROM hero_grid_images ORDER BY position ASC`;

        return new Response(JSON.stringify({ success: true, images }), { headers });
      }

      if (method === 'POST') {
        const body = await req.json();
        const result = await sql`
          INSERT INTO hero_grid_images (image_url, position, is_active)
          VALUES (${body.image_url}, ${body.position || 0}, ${body.is_active !== false})
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, image: result[0] }), { headers });
      }
    }

    // Single hero image operations
    const heroImageMatch = path.match(/^\/hero-images\/([^/]+)$/);
    if (heroImageMatch) {
      const id = heroImageMatch[1];

      if (method === 'PUT') {
        const body = await req.json();
        const { created_at, updated_at, id: _, ...updates } = body;

        const result = await sql`
          UPDATE hero_grid_images
          SET image_url = COALESCE(${updates.image_url}, image_url),
              position = COALESCE(${updates.position}, position),
              is_active = COALESCE(${updates.is_active}, is_active),
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, image: result[0] }), { headers });
      }

      if (method === 'DELETE') {
        await sql`DELETE FROM hero_grid_images WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    // ============ ACCORDION ITEMS ============
    if (path === '/accordion' || path === '/accordion/') {
      if (method === 'GET') {
        const activeOnly = url.searchParams.get('activeOnly') === 'true';

        const items = activeOnly
          ? await sql`SELECT * FROM accordion_items WHERE is_active = true ORDER BY order_position ASC`
          : await sql`SELECT * FROM accordion_items ORDER BY order_position ASC`;

        return new Response(JSON.stringify({ success: true, items }), { headers });
      }

      if (method === 'POST') {
        const body = await req.json();
        const result = await sql`
          INSERT INTO accordion_items (image_url, title, description, link_url, order_position, is_active)
          VALUES (${body.image_url}, ${body.title}, ${body.description}, ${body.link_url}, ${body.order_position || 0}, ${body.is_active !== false})
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, item: result[0] }), { headers });
      }
    }

    // Single accordion item operations
    const accordionMatch = path.match(/^\/accordion\/([^/]+)$/);
    if (accordionMatch) {
      const id = accordionMatch[1];

      if (method === 'PUT') {
        const body = await req.json();
        const { created_at, updated_at, id: _, ...updates } = body;

        const result = await sql`
          UPDATE accordion_items
          SET image_url = COALESCE(${updates.image_url}, image_url),
              title = COALESCE(${updates.title}, title),
              description = COALESCE(${updates.description}, description),
              link_url = COALESCE(${updates.link_url}, link_url),
              order_position = COALESCE(${updates.order_position}, order_position),
              is_active = COALESCE(${updates.is_active}, is_active),
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        return new Response(JSON.stringify({ success: true, item: result[0] }), { headers });
      }

      if (method === 'DELETE') {
        await sql`DELETE FROM accordion_items WHERE id = ${id}`;
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    // Not found
    return new Response(
      JSON.stringify({ success: false, error: 'Not found', path }),
      { status: 404, headers }
    );

  } catch (error) {
    console.error('Shop API Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/.netlify/functions/shop/*"
};

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'outpost-admin-jwt-secret-change-in-production';

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Helper to verify JWT token
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

// Helper to require authentication
function requireAuth(event) {
  const decoded = verifyToken(event.headers.authorization);
  if (!decoded) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'Authentication required' }),
    };
  }
  return decoded;
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/blog', '').replace('/api/blog', '');
  const method = event.httpMethod;

  try {
    // ==========================================
    // PUBLIC ENDPOINTS
    // ==========================================

    // GET /blog/posts - List all published blog posts
    if (method === 'GET' && (path === '/posts' || path === '')) {
      const url = new URL(event.rawUrl);
      const category = url.searchParams.get('category');
      const featured = url.searchParams.get('featured');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const where = {
        status: 'published',
        ...(category && category !== 'all' && { category }),
        ...(featured === 'true' && { featured: true }),
      };

      const posts = await prisma.blogPost.findMany({
        where,
        include: {
          author: true,
          blocks: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, posts }),
      };
    }

    // GET /blog/posts/:slug - Get single blog post by slug
    if (method === 'GET' && path.match(/^\/posts\/[^/]+$/)) {
      const slug = path.replace('/posts/', '');

      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: true,
          blocks: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (!post) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Post not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, post }),
      };
    }

    // GET /blog/case-studies - List all published case studies
    if (method === 'GET' && path === '/case-studies') {
      const caseStudies = await prisma.caseStudy.findMany({
        where: { status: 'published' },
        include: {
          stats: { orderBy: { sortOrder: 'asc' } },
          processSteps: { orderBy: { sortOrder: 'asc' } },
          results: { orderBy: { sortOrder: 'asc' } },
          gallery: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { publishedAt: 'desc' },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, caseStudies }),
      };
    }

    // GET /blog/case-studies/:slug - Get single case study by slug
    if (method === 'GET' && path.match(/^\/case-studies\/[^/]+$/)) {
      const slug = path.replace('/case-studies/', '');

      const caseStudy = await prisma.caseStudy.findUnique({
        where: { slug },
        include: {
          stats: { orderBy: { sortOrder: 'asc' } },
          processSteps: { orderBy: { sortOrder: 'asc' } },
          results: { orderBy: { sortOrder: 'asc' } },
          gallery: { orderBy: { sortOrder: 'asc' } },
        },
      });

      if (!caseStudy) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Case study not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, caseStudy }),
      };
    }

    // GET /blog/authors - List all authors
    if (method === 'GET' && path === '/authors') {
      const authors = await prisma.blogAuthor.findMany({
        orderBy: { name: 'asc' },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, authors }),
      };
    }

    // ==========================================
    // ADMIN ENDPOINTS (require authentication)
    // ==========================================

    // GET /blog/admin/posts - List ALL posts (including drafts)
    if (method === 'GET' && path === '/admin/posts') {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const posts = await prisma.blogPost.findMany({
        include: {
          author: true,
          blocks: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, posts }),
      };
    }

    // GET /blog/admin/case-studies - List ALL case studies (including drafts)
    if (method === 'GET' && path === '/admin/case-studies') {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const caseStudies = await prisma.caseStudy.findMany({
        include: {
          stats: { orderBy: { sortOrder: 'asc' } },
          processSteps: { orderBy: { sortOrder: 'asc' } },
          results: { orderBy: { sortOrder: 'asc' } },
          gallery: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, caseStudies }),
      };
    }

    // POST /blog/admin/posts - Create new blog post
    if (method === 'POST' && path === '/admin/posts') {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const data = JSON.parse(event.body);
      const { blocks, ...postData } = data;

      const post = await prisma.blogPost.create({
        data: {
          ...postData,
          blocks: blocks ? {
            create: blocks.map((block, index) => ({
              blockType: block.type || block.blockType,
              content: block.content,
              sortOrder: index,
              metadata: block.metadata || null,
            })),
          } : undefined,
        },
        include: {
          author: true,
          blocks: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, post }),
      };
    }

    // PUT /blog/admin/posts/:id - Update blog post
    if (method === 'PUT' && path.match(/^\/admin\/posts\/[^/]+$/)) {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const id = path.replace('/admin/posts/', '');
      const data = JSON.parse(event.body);
      const { blocks, ...postData } = data;

      // Delete existing blocks and recreate
      if (blocks) {
        await prisma.blogContentBlock.deleteMany({
          where: { postId: id },
        });
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: {
          ...postData,
          updatedAt: new Date(),
          blocks: blocks ? {
            create: blocks.map((block, index) => ({
              blockType: block.type || block.blockType,
              content: block.content,
              sortOrder: index,
              metadata: block.metadata || null,
            })),
          } : undefined,
        },
        include: {
          author: true,
          blocks: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, post }),
      };
    }

    // DELETE /blog/admin/posts/:id - Delete blog post
    if (method === 'DELETE' && path.match(/^\/admin\/posts\/[^/]+$/)) {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const id = path.replace('/admin/posts/', '');

      await prisma.blogPost.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    // POST /blog/admin/case-studies - Create new case study
    if (method === 'POST' && path === '/admin/case-studies') {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const data = JSON.parse(event.body);
      const { stats, processSteps, results, gallery, ...caseStudyData } = data;

      const caseStudy = await prisma.caseStudy.create({
        data: {
          ...caseStudyData,
          stats: stats ? {
            create: stats.map((stat, index) => ({
              value: stat.value,
              label: stat.label,
              sortOrder: index,
            })),
          } : undefined,
          processSteps: processSteps ? {
            create: processSteps.map((step, index) => ({
              title: step.title,
              description: step.description,
              sortOrder: index,
            })),
          } : undefined,
          results: results ? {
            create: results.map((result, index) => ({
              title: result.title,
              description: result.description,
              iconName: result.iconName,
              sortOrder: index,
            })),
          } : undefined,
          gallery: gallery ? {
            create: gallery.map((item, index) => ({
              iconName: item.iconName,
              label: item.label,
              imageUrl: item.imageUrl,
              isLarge: item.large || item.isLarge || false,
              sortOrder: index,
            })),
          } : undefined,
        },
        include: {
          stats: { orderBy: { sortOrder: 'asc' } },
          processSteps: { orderBy: { sortOrder: 'asc' } },
          results: { orderBy: { sortOrder: 'asc' } },
          gallery: { orderBy: { sortOrder: 'asc' } },
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, caseStudy }),
      };
    }

    // PUT /blog/admin/case-studies/:id - Update case study
    if (method === 'PUT' && path.match(/^\/admin\/case-studies\/[^/]+$/)) {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const id = path.replace('/admin/case-studies/', '');
      const data = JSON.parse(event.body);
      const { stats, processSteps, results, gallery, ...caseStudyData } = data;

      // Delete existing related data and recreate
      await Promise.all([
        stats && prisma.caseStudyStat.deleteMany({ where: { caseStudyId: id } }),
        processSteps && prisma.caseStudyProcessStep.deleteMany({ where: { caseStudyId: id } }),
        results && prisma.caseStudyResult.deleteMany({ where: { caseStudyId: id } }),
        gallery && prisma.caseStudyGallery.deleteMany({ where: { caseStudyId: id } }),
      ]);

      const caseStudy = await prisma.caseStudy.update({
        where: { id },
        data: {
          ...caseStudyData,
          updatedAt: new Date(),
          stats: stats ? {
            create: stats.map((stat, index) => ({
              value: stat.value,
              label: stat.label,
              sortOrder: index,
            })),
          } : undefined,
          processSteps: processSteps ? {
            create: processSteps.map((step, index) => ({
              title: step.title,
              description: step.description,
              sortOrder: index,
            })),
          } : undefined,
          results: results ? {
            create: results.map((result, index) => ({
              title: result.title,
              description: result.description,
              iconName: result.iconName,
              sortOrder: index,
            })),
          } : undefined,
          gallery: gallery ? {
            create: gallery.map((item, index) => ({
              iconName: item.iconName,
              label: item.label,
              imageUrl: item.imageUrl,
              isLarge: item.large || item.isLarge || false,
              sortOrder: index,
            })),
          } : undefined,
        },
        include: {
          stats: { orderBy: { sortOrder: 'asc' } },
          processSteps: { orderBy: { sortOrder: 'asc' } },
          results: { orderBy: { sortOrder: 'asc' } },
          gallery: { orderBy: { sortOrder: 'asc' } },
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, caseStudy }),
      };
    }

    // DELETE /blog/admin/case-studies/:id - Delete case study
    if (method === 'DELETE' && path.match(/^\/admin\/case-studies\/[^/]+$/)) {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const id = path.replace('/admin/case-studies/', '');

      await prisma.caseStudy.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    // POST /blog/admin/authors - Create new author
    if (method === 'POST' && path === '/admin/authors') {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const data = JSON.parse(event.body);

      const author = await prisma.blogAuthor.create({
        data,
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, author }),
      };
    }

    // PUT /blog/admin/authors/:id - Update author
    if (method === 'PUT' && path.match(/^\/admin\/authors\/[^/]+$/)) {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const id = path.replace('/admin/authors/', '');
      const data = JSON.parse(event.body);

      const author = await prisma.blogAuthor.update({
        where: { id },
        data,
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, author }),
      };
    }

    // DELETE /blog/admin/authors/:id - Delete author
    if (method === 'DELETE' && path.match(/^\/admin\/authors\/[^/]+$/)) {
      const auth = requireAuth(event);
      if (auth.statusCode) return auth;

      const id = path.replace('/admin/authors/', '');

      await prisma.blogAuthor.delete({
        where: { id },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Blog function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error', details: error.message }),
    };
  } finally {
    await prisma.$disconnect();
  }
}

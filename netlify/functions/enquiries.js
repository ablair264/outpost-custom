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

// Middleware to check auth
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

  const path = event.path.replace('/.netlify/functions/enquiries', '');
  const method = event.httpMethod;

  try {
    // POST /enquiries/submit - Public endpoint for submitting enquiries
    if (method === 'POST' && path === '/submit') {
      const data = JSON.parse(event.body);

      const enquiry = await prisma.clothingEnquiry.create({
        data: {
          status: 'new',
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone || null,
          companyName: data.companyName || null,
          productId: data.productId || null,
          productName: data.productName || null,
          productStyleCode: data.productStyleCode || null,
          productColor: data.productColor || null,
          productColorCode: data.productColorCode || null,
          productImageUrl: data.productImageUrl || null,
          logoFileName: data.logoAnalysis?.fileName || null,
          logoFileUrl: data.logoFileUrl || null,
          logoFileSize: data.logoAnalysis?.fileSize || null,
          logoFormat: data.logoAnalysis?.format || null,
          logoWidth: data.logoAnalysis?.width || null,
          logoHeight: data.logoAnalysis?.height || null,
          logoQualityTier: data.logoAnalysis?.qualityTier || null,
          logoQualityNotes: data.logoAnalysis?.qualityNotes || null,
          logoHasTransparency: data.logoAnalysis?.hasTransparency || null,
          logoPositionX: data.logoPositionX || null,
          logoPositionY: data.logoPositionY || null,
          logoSizePercent: data.logoSizePercent || null,
          estimatedQuantity: data.estimatedQuantity || null,
          additionalNotes: data.additionalNotes || null,
          enquiryType: data.enquiryType || 'upload',
          source: 'website',
        },
      });

      // Add initial system note
      await prisma.enquiryNote.create({
        data: {
          enquiryId: enquiry.id,
          noteType: 'system',
          content: `Enquiry submitted via website`,
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          enquiryId: enquiry.id,
        }),
      };
    }

    // All other endpoints require authentication
    const auth = requireAuth(event);
    if (auth.statusCode) return auth; // Return error response if auth failed
    const user = auth; // Otherwise it's the decoded user

    // GET /enquiries - List all enquiries
    if (method === 'GET' && (path === '' || path === '/')) {
      const params = event.queryStringParameters || {};
      const status = params.status;
      const limit = parseInt(params.limit) || 50;
      const offset = parseInt(params.offset) || 0;

      const where = status ? { status } : {};

      const [enquiries, total] = await Promise.all([
        prisma.clothingEnquiry.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          include: {
            assignedUser: {
              select: { id: true, name: true, email: true },
            },
          },
        }),
        prisma.clothingEnquiry.count({ where }),
      ]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, enquiries, total }),
      };
    }

    // GET /enquiries/counts - Get counts by status
    if (method === 'GET' && path === '/counts') {
      const counts = await prisma.clothingEnquiry.groupBy({
        by: ['status'],
        _count: { status: true },
      });

      const result = {
        new: 0,
        in_progress: 0,
        quoted: 0,
        approved: 0,
        in_production: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      };

      counts.forEach((c) => {
        result[c.status] = c._count.status;
        result.total += c._count.status;
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, counts: result }),
      };
    }

    // GET /enquiries/:id - Get single enquiry
    if (method === 'GET' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);

      const enquiry = await prisma.clothingEnquiry.findUnique({
        where: { id },
        include: {
          assignedUser: {
            select: { id: true, name: true, email: true },
          },
          notes: {
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!enquiry) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, error: 'Enquiry not found' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, enquiry }),
      };
    }

    // PUT /enquiries/:id - Update enquiry
    if (method === 'PUT' && path.match(/^\/[a-f0-9-]+$/)) {
      const id = path.substring(1);
      const data = JSON.parse(event.body);

      const updateData = {};
      if (data.status !== undefined) updateData.status = data.status;
      if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
      if (data.quoteAmount !== undefined) updateData.quoteAmount = data.quoteAmount;
      if (data.quoteNotes !== undefined) updateData.quoteNotes = data.quoteNotes;
      if (data.quoteSentAt !== undefined) updateData.quoteSentAt = data.quoteSentAt;

      const enquiry = await prisma.clothingEnquiry.update({
        where: { id },
        data: updateData,
      });

      // Add status change note if status was changed
      if (data.status && data.addNote !== false) {
        await prisma.enquiryNote.create({
          data: {
            enquiryId: id,
            noteType: 'status_change',
            content: `Status changed to ${data.status}`,
            createdBy: user.id,
          },
        });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, enquiry }),
      };
    }

    // POST /enquiries/:id/notes - Add note to enquiry
    if (method === 'POST' && path.match(/^\/[a-f0-9-]+\/notes$/)) {
      const id = path.split('/')[1];
      const { content, noteType = 'note' } = JSON.parse(event.body);

      if (!content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Content required' }),
        };
      }

      const note = await prisma.enquiryNote.create({
        data: {
          enquiryId: id,
          noteType,
          content,
          createdBy: user.id,
        },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, note }),
      };
    }

    // GET /enquiries/:id/notes - Get notes for enquiry
    if (method === 'GET' && path.match(/^\/[a-f0-9-]+\/notes$/)) {
      const id = path.split('/')[1];

      const notes = await prisma.enquiryNote.findMany({
        where: { enquiryId: id },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, notes }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Enquiries function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' }),
    };
  } finally {
    await prisma.$disconnect();
  }
}

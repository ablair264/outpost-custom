import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'outpost-admin-jwt-secret-change-in-production';
const JWT_EXPIRY = '7d';

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

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/auth', '');
  const method = event.httpMethod;

  try {
    // POST /auth/login
    if (method === 'POST' && path === '/login') {
      const { email, password } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Email and password required' }),
        };
      }

      const user = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid email or password' }),
        };
      }

      if (!user.isActive) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'Your account has been deactivated' }),
        };
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid email or password' }),
        };
      }

      const token = generateToken(user);
      const { passwordHash, ...userWithoutPassword } = user;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token,
          user: userWithoutPassword
        }),
      };
    }

    // GET /auth/me - Get current user from token
    if (method === 'GET' && path === '/me') {
      const decoded = verifyToken(event.headers.authorization);

      if (!decoded) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        };
      }

      const user = await prisma.adminUser.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user || !user.isActive) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, error: 'User not found or inactive' }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, user }),
      };
    }

    // POST /auth/register - Create new admin user (requires admin)
    if (method === 'POST' && path === '/register') {
      const decoded = verifyToken(event.headers.authorization);

      if (!decoded || decoded.role !== 'admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ success: false, error: 'Admin access required' }),
        };
      }

      const { email, password, name, role = 'staff' } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Email and password required' }),
        };
      }

      // Check if user already exists
      const existing = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existing) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'User with this email already exists' }),
        };
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = await prisma.adminUser.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          name: name || null,
          role: role === 'admin' ? 'admin' : 'staff',
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, user: newUser }),
      };
    }

    // POST /auth/setup - Initial setup (only works if no users exist)
    if (method === 'POST' && path === '/setup') {
      const userCount = await prisma.adminUser.count();

      if (userCount > 0) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ success: false, error: 'Setup already completed' }),
        };
      }

      const { email, password, name } = JSON.parse(event.body);

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Email and password required' }),
        };
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = await prisma.adminUser.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          name: name || 'Admin',
          role: 'admin',
          isActive: true,
        },
      });

      const token = generateToken(newUser);
      const { passwordHash: _, ...userWithoutPassword } = newUser;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          token,
          user: userWithoutPassword,
          message: 'Admin user created successfully'
        }),
      };
    }

    // GET /auth/users - List all admin users (requires admin)
    if (method === 'GET' && path === '/users') {
      const decoded = verifyToken(event.headers.authorization);

      if (!decoded || decoded.role !== 'admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ success: false, error: 'Admin access required' }),
        };
      }

      const users = await prisma.adminUser.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, users }),
      };
    }

    // PUT /auth/users/:id - Update admin user (requires admin)
    if (method === 'PUT' && path.startsWith('/users/')) {
      const decoded = verifyToken(event.headers.authorization);

      if (!decoded || decoded.role !== 'admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ success: false, error: 'Admin access required' }),
        };
      }

      const userId = path.replace('/users/', '');
      const { name, role, isActive } = JSON.parse(event.body);

      const updatedUser = await prisma.adminUser.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(role !== undefined && { role }),
          ...(isActive !== undefined && { isActive }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, user: updatedUser }),
      };
    }

    // DELETE /auth/users/:id - Deactivate admin user (requires admin)
    if (method === 'DELETE' && path.startsWith('/users/')) {
      const decoded = verifyToken(event.headers.authorization);

      if (!decoded || decoded.role !== 'admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ success: false, error: 'Admin access required' }),
        };
      }

      const userId = path.replace('/users/', '');

      // Soft delete - just deactivate
      await prisma.adminUser.update({
        where: { id: userId },
        data: { isActive: false },
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
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Internal server error' }),
    };
  } finally {
    await prisma.$disconnect();
  }
}

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

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/livechat', '');
  const method = event.httpMethod;

  try {
    // ==========================================
    // PUBLIC ENDPOINTS (for visitor widget)
    // ==========================================

    // GET /livechat/status - Check if admin is online
    if (method === 'GET' && path === '/status') {
      const result = await sql`
        SELECT is_online, welcome_message, offline_message
        FROM livechat_settings
        LIMIT 1
      `;
      const settings = result[0] || { is_online: false };
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          isOnline: settings.is_online,
          welcomeMessage: settings.welcome_message,
          offlineMessage: settings.offline_message,
        }),
      };
    }

    // POST /livechat/session - Create or get a chat session
    if (method === 'POST' && path === '/session') {
      const data = JSON.parse(event.body || '{}');
      const { visitorId, currentPage, productContext } = data;

      if (!visitorId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'visitorId is required' }),
        };
      }

      // Check for existing active session
      const existing = await sql`
        SELECT * FROM chat_sessions
        WHERE visitor_id = ${visitorId}
        AND status IN ('active', 'waiting_for_admin', 'admin_joined')
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (existing.length > 0) {
        // Update current page if provided
        if (currentPage) {
          await sql`
            UPDATE chat_sessions
            SET current_page = ${currentPage},
                product_context = ${productContext ? JSON.stringify(productContext) : null},
                updated_at = NOW()
            WHERE id = ${existing[0].id}
          `;
        }

        // Get messages for this session
        const messages = await sql`
          SELECT id, sender_type, content, created_at, metadata
          FROM chat_messages
          WHERE session_id = ${existing[0].id}
          ORDER BY created_at ASC
        `;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            session: { ...existing[0], messages },
            isNew: false,
          }),
        };
      }

      // Create new session
      const newSession = await sql`
        INSERT INTO chat_sessions (visitor_id, current_page, product_context)
        VALUES (${visitorId}, ${currentPage || null}, ${productContext ? JSON.stringify(productContext) : null})
        RETURNING *
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          session: { ...newSession[0], messages: [] },
          isNew: true,
        }),
      };
    }

    // POST /livechat/message - Send a message (visitor or AI)
    if (method === 'POST' && path === '/message') {
      const data = JSON.parse(event.body || '{}');
      const { sessionId, senderType, content, metadata } = data;

      if (!sessionId || !senderType || !content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'sessionId, senderType, and content are required' }),
        };
      }

      // Insert message
      const message = await sql`
        INSERT INTO chat_messages (session_id, sender_type, content, metadata)
        VALUES (${sessionId}, ${senderType}, ${content}, ${metadata ? JSON.stringify(metadata) : null})
        RETURNING *
      `;

      // Update session's last message time and unread count
      await sql`
        UPDATE chat_sessions
        SET last_message_at = NOW(),
            updated_at = NOW(),
            unread_count = CASE WHEN ${senderType} = 'visitor' THEN unread_count + 1 ELSE unread_count END
        WHERE id = ${sessionId}
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: message[0] }),
      };
    }

    // POST /livechat/escalate - Request to speak to a human
    if (method === 'POST' && path === '/escalate') {
      const data = JSON.parse(event.body || '{}');
      const { sessionId, visitorName, visitorEmail } = data;

      if (!sessionId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'sessionId is required' }),
        };
      }

      // Update session status and visitor info
      await sql`
        UPDATE chat_sessions
        SET status = 'waiting_for_admin',
            visitor_name = COALESCE(${visitorName || null}, visitor_name),
            visitor_email = COALESCE(${visitorEmail || null}, visitor_email),
            updated_at = NOW()
        WHERE id = ${sessionId}
      `;

      // Add system message
      await sql`
        INSERT INTO chat_messages (session_id, sender_type, content)
        VALUES (${sessionId}, 'system', 'Customer requested to speak with a team member')
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Escalation requested' }),
      };
    }

    // GET /livechat/messages/:sessionId - Poll for new messages (visitor)
    if (method === 'GET' && path.startsWith('/messages/')) {
      const sessionId = path.replace('/messages/', '');
      const since = event.queryStringParameters?.since;

      let messages;
      if (since) {
        messages = await sql`
          SELECT id, sender_type, content, created_at, metadata
          FROM chat_messages
          WHERE session_id = ${sessionId}
          AND created_at > ${since}
          ORDER BY created_at ASC
        `;
      } else {
        messages = await sql`
          SELECT id, sender_type, content, created_at, metadata
          FROM chat_messages
          WHERE session_id = ${sessionId}
          ORDER BY created_at ASC
        `;
      }

      // Get session status
      const session = await sql`
        SELECT status, taken_over_by FROM chat_sessions WHERE id = ${sessionId}
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          messages,
          sessionStatus: session[0]?.status,
          adminJoined: session[0]?.status === 'admin_joined',
        }),
      };
    }

    // ==========================================
    // ADMIN ENDPOINTS (require authentication)
    // ==========================================

    const decoded = verifyToken(event.headers.authorization);

    // GET /livechat/admin/sessions - Get all active chat sessions
    if (method === 'GET' && path === '/admin/sessions') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const sessions = await sql`
        SELECT
          cs.*,
          au.name as admin_name,
          (SELECT content FROM chat_messages WHERE session_id = cs.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM chat_sessions cs
        LEFT JOIN admin_users au ON cs.taken_over_by = au.id
        WHERE cs.status IN ('active', 'waiting_for_admin', 'admin_joined')
        ORDER BY
          CASE WHEN cs.status = 'waiting_for_admin' THEN 0 ELSE 1 END,
          cs.last_message_at DESC NULLS LAST
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, sessions }),
      };
    }

    // GET /livechat/admin/session/:id - Get a specific session with messages
    if (method === 'GET' && path.startsWith('/admin/session/')) {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const sessionId = path.replace('/admin/session/', '');

      const session = await sql`
        SELECT cs.*, au.name as admin_name
        FROM chat_sessions cs
        LEFT JOIN admin_users au ON cs.taken_over_by = au.id
        WHERE cs.id = ${sessionId}
      `;

      if (session.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: 'Session not found' }) };
      }

      const messages = await sql`
        SELECT cm.*, au.name as admin_name
        FROM chat_messages cm
        LEFT JOIN admin_users au ON cm.admin_id = au.id
        WHERE cm.session_id = ${sessionId}
        ORDER BY cm.created_at ASC
      `;

      // Mark as seen and reset unread count
      await sql`
        UPDATE chat_sessions
        SET last_seen_by_admin = NOW(), unread_count = 0
        WHERE id = ${sessionId}
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, session: session[0], messages }),
      };
    }

    // POST /livechat/admin/takeover - Admin takes over a chat
    if (method === 'POST' && path === '/admin/takeover') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const data = JSON.parse(event.body || '{}');
      const { sessionId } = data;

      await sql`
        UPDATE chat_sessions
        SET status = 'admin_joined',
            taken_over_by = ${decoded.id}::uuid,
            taken_over_at = NOW(),
            updated_at = NOW()
        WHERE id = ${sessionId}
      `;

      // Get admin name from token (or fallback to database lookup)
      const adminName = decoded.name || 'Team Member';

      // Add system message
      await sql`
        INSERT INTO chat_messages (session_id, sender_type, content)
        VALUES (${sessionId}, 'system', ${`${adminName} has joined the chat`})
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Takeover successful' }),
      };
    }

    // POST /livechat/admin/message - Admin sends a message
    if (method === 'POST' && path === '/admin/message') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const data = JSON.parse(event.body || '{}');
      const { sessionId, content, metadata } = data;

      if (!sessionId || !content) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'sessionId and content are required' }) };
      }

      const message = await sql`
        INSERT INTO chat_messages (session_id, sender_type, admin_id, content, metadata)
        VALUES (${sessionId}, 'admin', ${decoded.id}::uuid, ${content}, ${metadata ? JSON.stringify(metadata) : null})
        RETURNING *
      `;

      await sql`
        UPDATE chat_sessions
        SET last_message_at = NOW(), updated_at = NOW()
        WHERE id = ${sessionId}
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: message[0] }),
      };
    }

    // POST /livechat/admin/close - Close a chat session
    if (method === 'POST' && path === '/admin/close') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const data = JSON.parse(event.body || '{}');
      const { sessionId } = data;

      await sql`
        UPDATE chat_sessions
        SET status = 'closed', updated_at = NOW()
        WHERE id = ${sessionId}
      `;

      await sql`
        INSERT INTO chat_messages (session_id, sender_type, content)
        VALUES (${sessionId}, 'system', 'Chat session closed')
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Session closed' }),
      };
    }

    // GET /livechat/admin/settings - Get LiveChat settings
    if (method === 'GET' && path === '/admin/settings') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const settings = await sql`SELECT * FROM livechat_settings LIMIT 1`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, settings: settings[0] || {} }),
      };
    }

    // PUT /livechat/admin/settings - Update LiveChat settings (including online status)
    if (method === 'PUT' && path === '/admin/settings') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const data = JSON.parse(event.body || '{}');
      const { isOnline, welcomeMessage, offlineMessage, escalationKeywords, autoEscalateAfter } = data;

      // Check if settings exist
      const existing = await sql`SELECT id FROM livechat_settings LIMIT 1`;

      if (existing.length === 0) {
        await sql`
          INSERT INTO livechat_settings (is_online, welcome_message, offline_message, escalation_keywords, auto_escalate_after, updated_by)
          VALUES (${isOnline ?? false}, ${welcomeMessage || null}, ${offlineMessage || null}, ${escalationKeywords || []}, ${autoEscalateAfter || null}, ${decoded.id}::uuid)
        `;
      } else {
        await sql`
          UPDATE livechat_settings
          SET is_online = COALESCE(${isOnline}, is_online),
              welcome_message = COALESCE(${welcomeMessage}, welcome_message),
              offline_message = COALESCE(${offlineMessage}, offline_message),
              escalation_keywords = COALESCE(${escalationKeywords}, escalation_keywords),
              auto_escalate_after = COALESCE(${autoEscalateAfter}, auto_escalate_after),
              updated_by = ${decoded.id}::uuid,
              updated_at = NOW()
          WHERE id = ${existing[0].id}
        `;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Settings updated' }),
      };
    }

    // PUT /livechat/admin/online - Quick toggle online status
    if (method === 'PUT' && path === '/admin/online') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const data = JSON.parse(event.body || '{}');
      const { isOnline } = data;

      await sql`
        UPDATE livechat_settings
        SET is_online = ${isOnline}, updated_by = ${decoded.id}::uuid, updated_at = NOW()
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, isOnline }),
      };
    }

    // GET /livechat/admin/stats - Get chat statistics
    if (method === 'GET' && path === '/admin/stats') {
      if (!decoded) {
        return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'Authentication required' }) };
      }

      const stats = await sql`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('active', 'waiting_for_admin', 'admin_joined')) as active_sessions,
          COUNT(*) FILTER (WHERE status = 'waiting_for_admin') as waiting_for_admin,
          SUM(unread_count) as total_unread
        FROM chat_sessions
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, stats: stats[0] }),
      };
    }

    // 404 for unmatched routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('LiveChat API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
}

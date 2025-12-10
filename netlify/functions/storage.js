// Cloudflare R2 Storage API - Handles image uploads via presigned URLs
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// R2 Configuration from environment variables
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'outpost-assets';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g., https://pub-xxx.r2.dev or custom domain

// Initialize S3 client for R2
function getR2Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Generate a unique filename
function generateFilename(originalName, folder) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace non-alphanumeric with dashes
    .substring(0, 50); // Limit length

  return `${folder}/${timestamp}-${randomStr}-${sanitizedName}.${ext}`;
}

// Get content type from filename
function getContentType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/storage', '');
  const method = event.httpMethod;

  try {
    // POST /storage/presign - Get a presigned URL for upload
    if (method === 'POST' && (path === '/presign' || path === '/presign/')) {
      const body = JSON.parse(event.body || '{}');
      const { filename, folder = 'uploads', contentType } = body;

      if (!filename) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Filename is required' }),
        };
      }

      // Validate folder
      const allowedFolders = ['slides', 'tiles', 'hero', 'accordion', 'logos', 'uploads'];
      const safeFolder = allowedFolders.includes(folder) ? folder : 'uploads';

      // Generate unique key
      const key = generateFilename(filename, safeFolder);
      const detectedContentType = contentType || getContentType(filename);

      const client = getR2Client();

      // Create presigned PUT URL (valid for 5 minutes)
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: detectedContentType,
      });

      const presignedUrl = await getSignedUrl(client, command, { expiresIn: 300 });

      // Construct the public URL for the uploaded file
      let publicUrl;
      if (R2_PUBLIC_URL) {
        publicUrl = `${R2_PUBLIC_URL}/${key}`;
      } else {
        // If no public URL configured, return the key (user will need to configure public access)
        publicUrl = key;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          presignedUrl,
          key,
          publicUrl,
          contentType: detectedContentType,
          expiresIn: 300,
        }),
      };
    }

    // POST /storage/upload - Direct upload (for smaller files, handled server-side)
    if (method === 'POST' && (path === '/upload' || path === '/upload/')) {
      const body = JSON.parse(event.body || '{}');
      const { filename, folder = 'uploads', data, contentType } = body;

      if (!filename || !data) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Filename and data are required' }),
        };
      }

      // Validate folder
      const allowedFolders = ['slides', 'tiles', 'hero', 'accordion', 'logos', 'uploads'];
      const safeFolder = allowedFolders.includes(folder) ? folder : 'uploads';

      // Generate unique key
      const key = generateFilename(filename, safeFolder);
      const detectedContentType = contentType || getContentType(filename);

      // Decode base64 data
      const buffer = Buffer.from(data, 'base64');

      const client = getR2Client();

      // Upload to R2
      await client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: detectedContentType,
      }));

      // Construct the public URL
      let publicUrl;
      if (R2_PUBLIC_URL) {
        publicUrl = `${R2_PUBLIC_URL}/${key}`;
      } else {
        publicUrl = key;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          key,
          publicUrl,
          contentType: detectedContentType,
          size: buffer.length,
        }),
      };
    }

    // DELETE /storage/delete - Delete a file from R2
    if (method === 'DELETE' || (method === 'POST' && path === '/delete')) {
      const body = JSON.parse(event.body || '{}');
      let { key, url } = body;

      // Extract key from URL if provided
      if (!key && url) {
        if (R2_PUBLIC_URL && url.startsWith(R2_PUBLIC_URL)) {
          key = url.replace(R2_PUBLIC_URL + '/', '');
        } else if (url.includes('.r2.dev/')) {
          key = url.split('.r2.dev/')[1];
        } else {
          // Assume it's already a key
          key = url;
        }
      }

      if (!key) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: 'Key or URL is required' }),
        };
      }

      const client = getR2Client();

      await client.send(new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, deletedKey: key }),
      };
    }

    // GET /storage/info - Get storage configuration info
    if (method === 'GET' && (path === '/info' || path === '/info/' || path === '' || path === '/')) {
      const configured = !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          configured,
          bucket: configured ? R2_BUCKET_NAME : null,
          publicUrl: configured ? R2_PUBLIC_URL : null,
          message: configured
            ? 'R2 storage is configured and ready'
            : 'R2 storage is not configured. Please set environment variables.',
        }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, error: 'Not found' }),
    };

  } catch (error) {
    console.error('Storage function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
    };
  }
}

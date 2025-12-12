// Enquiry Service - connects to Neon via Netlify Functions
// No longer uses Supabase

const ENQUIRY_API_BASE = '/.netlify/functions/enquiries';

// Types matching the database schema
export interface ClothingEnquiry {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  assigned_to?: string;

  // Contact info
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string;

  // Product info
  product_id?: string;
  product_name?: string;
  product_style_code?: string;
  product_color?: string;
  product_color_code?: string;
  product_image_url?: string;

  // Logo info
  logo_file_name?: string;
  logo_file_url?: string;
  logo_url?: string;
  logo_file_size?: number;
  logo_format?: string;
  logo_width?: number;
  logo_height?: number;
  logo_quality_tier?: string;
  logo_quality_notes?: string[];
  logo_has_transparency?: boolean;
  logo_dimensions?: { width: number; height: number };
  logo_placement?: string;

  // Placement preferences
  logo_position_x?: number;
  logo_position_y?: number;
  logo_size_percent?: number;

  // Order details
  estimated_quantity?: string;
  quantity?: number;
  sizes?: Record<string, number>;
  additional_notes?: string;
  notes?: string;
  enquiry_type: 'upload' | 'design_help' | 'consultation';

  // Quote info
  quote_amount?: number;
  quote_notes?: string;
  quote_sent_at?: string;

  // Logo preview captures
  logo_preview_captures?: LogoPreviewCapture[];

  // Metadata
  source: string;
}

export interface EnquiryNote {
  id: string;
  enquiry_id: string;
  created_at: string;
  created_by?: string;
  created_by_name?: string;
  note_type: 'note' | 'status_change' | 'quote_sent' | 'customer_reply' | 'system';
  content: string;
}

export interface LogoAnalysis {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  format: string;
  width: number;
  height: number;
  hasTransparency: boolean;
  qualityTier: 'excellent' | 'good' | 'acceptable' | 'low';
  qualityNotes: string[];
}

export interface LogoPreviewData {
  logoSrc: string;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
  analysis?: LogoAnalysis;
}

export interface LogoPreviewCapture {
  cartItemId: string;
  productName: string;
  selectedColor: string;
  colorChanged: boolean;
  originalColor: string;
  logoPosition: { x: number; y: number; scale: number };
  previewImageUrl: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
}

export interface SubmitEnquiryRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId?: string;
  productName: string;
  productStyleCode?: string;
  productColor?: string;
  productColorCode?: string;
  productImageUrl?: string;
  logoData?: string;
  logoAnalysis?: LogoAnalysis;
  logoPositionX?: number;
  logoPositionY?: number;
  logoSizePercent?: number;
  estimatedQuantity?: string;
  additionalNotes?: string;
  enquiryType: 'upload' | 'design_help' | 'consultation';
  // Logo preview captures (optional)
  logoPreviewCaptures?: LogoPreviewCapture[];
}

export interface SubmitEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  enquiryRef?: string;
  error?: string;
}

// Helper for API calls
async function enquiryApiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${ENQUIRY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Generate a short reference number for customer communications
function generateEnquiryRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'ENQ-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// Submit a new clothing enquiry (public endpoint)
export async function submitClothingEnquiry(
  request: SubmitEnquiryRequest
): Promise<SubmitEnquiryResponse> {
  try {
    const enquiryRef = generateEnquiryRef();

    // Build the request body for the API
    const requestBody = {
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      productId: request.productId,
      productName: request.productName,
      productStyleCode: request.productStyleCode,
      productColor: request.productColor,
      productColorCode: request.productColorCode,
      productImageUrl: request.productImageUrl,
      logoFileUrl: request.logoData, // TODO: Handle file upload to Cloudflare R2
      logoAnalysis: request.logoAnalysis,
      logoPositionX: request.logoPositionX,
      logoPositionY: request.logoPositionY,
      logoSizePercent: request.logoSizePercent,
      estimatedQuantity: request.estimatedQuantity,
      additionalNotes: request.additionalNotes,
      enquiryType: request.enquiryType,
      // Logo preview captures with R2 URLs
      logoPreviewCaptures: request.logoPreviewCaptures,
    };

    const response = await enquiryApiFetch<{ success: boolean; enquiryId: string }>(
      '/submit',
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );

    return {
      success: true,
      enquiryId: response.enquiryId,
      enquiryRef,
    };
  } catch (error) {
    console.error('Error in submitClothingEnquiry:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

// Get all enquiries (requires auth token)
export async function getEnquiries(
  options?: {
    status?: string;
    limit?: number;
    offset?: number;
  },
  token?: string
): Promise<ClothingEnquiry[]> {
  try {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';

    const response = await enquiryApiFetch<{ success: boolean; enquiries: any[] }>(
      endpoint,
      { method: 'GET' },
      token
    );

    // Map from camelCase API response to snake_case used in frontend
    return (response.enquiries || []).map(mapEnquiryFromApi);
  } catch (error) {
    console.error('Error in getEnquiries:', error);
    return [];
  }
}

// Get a single enquiry by ID (requires auth token)
export async function getEnquiryById(id: string, token?: string): Promise<ClothingEnquiry | null> {
  try {
    const response = await enquiryApiFetch<{ success: boolean; enquiry: any }>(
      `/${id}`,
      { method: 'GET' },
      token
    );

    return response.enquiry ? mapEnquiryFromApi(response.enquiry) : null;
  } catch (error) {
    console.error('Error in getEnquiryById:', error);
    return null;
  }
}

// Get notes for an enquiry (requires auth token)
export async function getEnquiryNotes(enquiryId: string, token?: string): Promise<EnquiryNote[]> {
  try {
    const response = await enquiryApiFetch<{ success: boolean; notes: any[] }>(
      `/${enquiryId}/notes`,
      { method: 'GET' },
      token
    );

    return (response.notes || []).map(note => ({
      id: note.id,
      enquiry_id: note.enquiryId,
      created_at: note.createdAt,
      created_by: note.createdBy,
      created_by_name: note.author?.name || null,
      note_type: note.noteType,
      content: note.content,
    }));
  } catch (error) {
    console.error('Error in getEnquiryNotes:', error);
    return [];
  }
}

// Add a note to an enquiry (requires auth token)
export async function addEnquiryNote(
  enquiryId: string,
  content: string,
  createdBy?: string,
  noteType: EnquiryNote['note_type'] = 'note',
  token?: string
): Promise<boolean> {
  try {
    await enquiryApiFetch<{ success: boolean }>(
      `/${enquiryId}/notes`,
      {
        method: 'POST',
        body: JSON.stringify({ content, noteType }),
      },
      token
    );
    return true;
  } catch (error) {
    console.error('Error in addEnquiryNote:', error);
    return false;
  }
}

// Update enquiry status (requires auth token)
export async function updateEnquiryStatus(
  id: string,
  status: string,
  updatedBy?: string,
  token?: string
): Promise<boolean> {
  try {
    await enquiryApiFetch<{ success: boolean }>(
      `/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      },
      token
    );
    return true;
  } catch (error) {
    console.error('Error in updateEnquiryStatus:', error);
    return false;
  }
}

// Update enquiry with quote information (requires auth token)
export async function updateEnquiryQuote(
  id: string,
  quoteAmount: number,
  quoteNotes?: string,
  token?: string
): Promise<boolean> {
  try {
    await enquiryApiFetch<{ success: boolean }>(
      `/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          status: 'quoted',
          quoteAmount,
          quoteNotes,
          quoteSentAt: new Date().toISOString(),
        }),
      },
      token
    );
    return true;
  } catch (error) {
    console.error('Error in updateEnquiryQuote:', error);
    return false;
  }
}

// Get enquiry counts by status (requires auth token)
export async function getEnquiryCounts(token?: string): Promise<Record<string, number>> {
  try {
    const response = await enquiryApiFetch<{ success: boolean; counts: Record<string, number> }>(
      '/counts',
      { method: 'GET' },
      token
    );
    return response.counts || {};
  } catch (error) {
    console.error('Error in getEnquiryCounts:', error);
    return {};
  }
}

// Helper to map API response (camelCase) to frontend format (snake_case)
function mapEnquiryFromApi(apiEnquiry: any): ClothingEnquiry {
  return {
    id: apiEnquiry.id,
    created_at: apiEnquiry.createdAt,
    updated_at: apiEnquiry.updatedAt,
    status: apiEnquiry.status,
    assigned_to: apiEnquiry.assignedTo,
    customer_name: apiEnquiry.customerName,
    customer_email: apiEnquiry.customerEmail,
    customer_phone: apiEnquiry.customerPhone,
    company_name: apiEnquiry.companyName,
    product_id: apiEnquiry.productId,
    product_name: apiEnquiry.productName,
    product_style_code: apiEnquiry.productStyleCode,
    product_color: apiEnquiry.productColor,
    product_color_code: apiEnquiry.productColorCode,
    product_image_url: apiEnquiry.productImageUrl,
    logo_file_name: apiEnquiry.logoFileName,
    logo_file_url: apiEnquiry.logoFileUrl,
    logo_url: apiEnquiry.logoFileUrl,
    logo_file_size: apiEnquiry.logoFileSize,
    logo_format: apiEnquiry.logoFormat,
    logo_width: apiEnquiry.logoWidth,
    logo_height: apiEnquiry.logoHeight,
    logo_quality_tier: apiEnquiry.logoQualityTier,
    logo_quality_notes: apiEnquiry.logoQualityNotes,
    logo_has_transparency: apiEnquiry.logoHasTransparency,
    logo_position_x: apiEnquiry.logoPositionX,
    logo_position_y: apiEnquiry.logoPositionY,
    logo_size_percent: apiEnquiry.logoSizePercent,
    estimated_quantity: apiEnquiry.estimatedQuantity,
    additional_notes: apiEnquiry.additionalNotes,
    enquiry_type: apiEnquiry.enquiryType,
    quote_amount: apiEnquiry.quoteAmount,
    quote_notes: apiEnquiry.quoteNotes,
    quote_sent_at: apiEnquiry.quoteSentAt,
    logo_preview_captures: apiEnquiry.logoPreviewCaptures,
    source: apiEnquiry.source || 'website',
  };
}

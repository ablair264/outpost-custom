import { supabase } from './supabase';

// Types matching the database schema
export interface ClothingEnquiry {
  id: string;
  created_at: string;
  updated_at: string;
  status: string; // 'new' | 'in_progress' | 'quoted' | 'approved' | 'in_production' | 'completed' | 'cancelled'
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
  logo_url?: string; // Alias for logo_file_url for convenience
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
  notes?: string; // Alias for additional_notes
  enquiry_type: 'upload' | 'design_help' | 'consultation';

  // Quote info
  quote_amount?: number;
  quote_notes?: string;
  quote_sent_at?: string;

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

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
}

export interface SubmitEnquiryRequest {
  // Contact
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Product
  productId?: string;
  productName: string;
  productStyleCode?: string;
  productColor?: string;
  productColorCode?: string;
  productImageUrl?: string;

  // Logo data
  logoData?: string; // Base64 data URL
  logoAnalysis?: LogoAnalysis;

  // Placement
  logoPositionX?: number;
  logoPositionY?: number;
  logoSizePercent?: number;

  // Details
  estimatedQuantity?: string;
  additionalNotes?: string;
  enquiryType: 'upload' | 'design_help' | 'consultation';
}

export interface SubmitEnquiryResponse {
  success: boolean;
  enquiryId?: string;
  enquiryRef?: string;
  error?: string;
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

// Upload logo file to Supabase Storage
async function uploadLogoFile(
  logoDataUrl: string,
  enquiryId: string
): Promise<{ url: string; fileName: string } | null> {
  try {
    // Extract file type and data from data URL
    const matches = logoDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.error('Invalid data URL format');
      return null;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Determine file extension
    const extMap: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/svg+xml': 'svg',
    };
    const extension = extMap[mimeType] || 'png';

    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    const blob = new Blob(byteArrays, { type: mimeType });

    // Generate unique filename
    const fileName = `enquiries/${enquiryId}/logo-${Date.now()}.${extension}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('logo-uploads')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType,
      });

    if (error) {
      console.error('Error uploading logo:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logo-uploads')
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      fileName: `logo.${extension}`,
    };
  } catch (error) {
    console.error('Error in uploadLogoFile:', error);
    return null;
  }
}

// Submit a new clothing enquiry
export async function submitClothingEnquiry(
  request: SubmitEnquiryRequest
): Promise<SubmitEnquiryResponse> {
  try {
    // Generate enquiry reference
    const enquiryRef = generateEnquiryRef();

    // Create the enquiry record first (without logo URL)
    const enquiryData: Partial<ClothingEnquiry> = {
      status: 'new',
      customer_name: request.customerName,
      customer_email: request.customerEmail,
      customer_phone: request.customerPhone,
      product_id: request.productId,
      product_name: request.productName,
      product_style_code: request.productStyleCode,
      product_color: request.productColor,
      product_color_code: request.productColorCode,
      product_image_url: request.productImageUrl,
      logo_position_x: request.logoPositionX,
      logo_position_y: request.logoPositionY,
      logo_size_percent: request.logoSizePercent,
      estimated_quantity: request.estimatedQuantity,
      additional_notes: request.additionalNotes,
      enquiry_type: request.enquiryType,
      source: 'website',
    };

    // Add logo analysis if available
    if (request.logoAnalysis) {
      enquiryData.logo_file_name = request.logoAnalysis.fileName;
      enquiryData.logo_file_size = request.logoAnalysis.fileSize;
      enquiryData.logo_format = request.logoAnalysis.format;
      enquiryData.logo_width = request.logoAnalysis.width;
      enquiryData.logo_height = request.logoAnalysis.height;
      enquiryData.logo_quality_tier = request.logoAnalysis.qualityTier;
      enquiryData.logo_quality_notes = request.logoAnalysis.qualityNotes;
      enquiryData.logo_has_transparency = request.logoAnalysis.hasTransparency;
    }

    // Insert the enquiry
    const { data: enquiry, error: insertError } = await supabase
      .from('clothing_enquiries')
      .insert([enquiryData])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting enquiry:', insertError);
      return {
        success: false,
        error: 'Failed to submit enquiry. Please try again.',
      };
    }

    // Upload logo file if provided
    if (request.logoData) {
      const uploadResult = await uploadLogoFile(request.logoData, enquiry.id);

      if (uploadResult) {
        // Update enquiry with logo URL
        const { error: updateError } = await supabase
          .from('clothing_enquiries')
          .update({ logo_file_url: uploadResult.url })
          .eq('id', enquiry.id);

        if (updateError) {
          console.error('Error updating logo URL:', updateError);
          // Don't fail the whole submission, logo was uploaded
        }
      }
    }

    // Add initial note
    await addEnquiryNote(enquiry.id, `Enquiry ${enquiryRef} submitted via website`, undefined, 'system');

    return {
      success: true,
      enquiryId: enquiry.id,
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

// Add a note to an enquiry
export async function addEnquiryNote(
  enquiryId: string,
  content: string,
  createdBy?: string,
  noteType: EnquiryNote['note_type'] = 'note'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('enquiry_notes')
      .insert([{
        enquiry_id: enquiryId,
        note_type: noteType,
        content,
        created_by: createdBy,
      }]);

    if (error) {
      console.error('Error adding note:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addEnquiryNote:', error);
    return false;
  }
}

// Get all enquiries (for admin)
export async function getEnquiries(
  options?: {
    status?: ClothingEnquiry['status'];
    limit?: number;
    offset?: number;
  }
): Promise<ClothingEnquiry[]> {
  try {
    let query = supabase
      .from('clothing_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching enquiries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEnquiries:', error);
    return [];
  }
}

// Get a single enquiry by ID
export async function getEnquiryById(id: string): Promise<ClothingEnquiry | null> {
  try {
    const { data, error } = await supabase
      .from('clothing_enquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching enquiry:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getEnquiryById:', error);
    return null;
  }
}

// Get notes for an enquiry
export async function getEnquiryNotes(enquiryId: string): Promise<EnquiryNote[]> {
  try {
    const { data, error } = await supabase
      .from('enquiry_notes')
      .select(`
        *,
        admin_users:created_by (name)
      `)
      .eq('enquiry_id', enquiryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return [];
    }

    // Map the joined data to include created_by_name
    return (data || []).map(note => ({
      ...note,
      created_by_name: note.admin_users?.name || null,
      admin_users: undefined,
    }));
  } catch (error) {
    console.error('Error in getEnquiryNotes:', error);
    return [];
  }
}

// Update enquiry status
export async function updateEnquiryStatus(
  id: string,
  status: string,
  updatedBy?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clothing_enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      return false;
    }

    // Add status change note
    await addEnquiryNote(id, `Status changed to ${status}`, updatedBy, 'status_change');

    return true;
  } catch (error) {
    console.error('Error in updateEnquiryStatus:', error);
    return false;
  }
}

// Update enquiry with quote information
export async function updateEnquiryQuote(
  id: string,
  quoteAmount: number,
  quoteNotes?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('clothing_enquiries')
      .update({
        quote_amount: quoteAmount,
        quote_notes: quoteNotes,
        quote_sent_at: new Date().toISOString(),
        status: 'quoted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating quote:', error);
      return false;
    }

    await addEnquiryNote(id, `Quote sent: £${quoteAmount.toFixed(2)}${quoteNotes ? ` - ${quoteNotes}` : ''}`, undefined, 'quote_sent');

    return true;
  } catch (error) {
    console.error('Error in updateEnquiryQuote:', error);
    return false;
  }
}

// Get enquiry counts by status (for dashboard)
export async function getEnquiryCounts(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from('clothing_enquiries')
      .select('status');

    if (error) {
      console.error('Error fetching counts:', error);
      return {};
    }

    const counts: Record<string, number> = {
      new: 0,
      in_progress: 0,
      quoted: 0,
      approved: 0,
      in_production: 0,
      completed: 0,
      cancelled: 0,
      total: 0,
    };

    data?.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
      counts.total++;
    });

    return counts;
  } catch (error) {
    console.error('Error in getEnquiryCounts:', error);
    return {};
  }
}

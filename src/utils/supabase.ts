// Shop Content API - Uses Netlify Functions to connect to Neon PostgreSQL
// No longer uses Supabase directly

const SHOP_API_BASE = '/.netlify/functions/shop';

// Types
export interface BentoTile {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  grid_section: 'left' | 'right';
  grid_position: number;
  span_rows: number;
  span_cols: number;
  font_size: string;
  font_position: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdSlide {
  id: string;
  image_url: string;
  alt_text: string;
  link_url?: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroGridImage {
  id: string;
  image_url: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccordionItem {
  id: string;
  image_url: string;
  title: string;
  description: string;
  link_url?: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function for API calls
async function shopApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${SHOP_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

// ============ BENTO TILES ============

export async function fetchBentoTiles(section: 'left' | 'right'): Promise<BentoTile[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; tiles: BentoTile[] }>(
      `/bento-tiles?section=${section}&activeOnly=true`
    );
    return response.tiles || [];
  } catch (error) {
    console.error('Error fetching bento tiles:', error);
    return [];
  }
}

export async function fetchAllBentoTiles(): Promise<BentoTile[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; tiles: BentoTile[] }>(
      '/bento-tiles'
    );
    return response.tiles || [];
  } catch (error) {
    console.error('Error fetching all bento tiles:', error);
    return [];
  }
}

export async function createBentoTile(tile: Omit<BentoTile, 'id' | 'created_at' | 'updated_at'>): Promise<BentoTile | null> {
  try {
    const response = await shopApiFetch<{ success: boolean; tile: BentoTile }>(
      '/bento-tiles',
      {
        method: 'POST',
        body: JSON.stringify(tile),
      }
    );
    return response.tile || null;
  } catch (error) {
    console.error('Error creating bento tile:', error);
    return null;
  }
}

export async function updateBentoTile(id: string, updates: Partial<BentoTile>): Promise<BentoTile | null> {
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  try {
    const response = await shopApiFetch<{ success: boolean; tile: BentoTile }>(
      `/bento-tiles/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(cleanUpdates),
      }
    );
    return response.tile || null;
  } catch (error) {
    console.error('Error updating bento tile:', error);
    return null;
  }
}

export async function deleteBentoTile(id: string): Promise<boolean> {
  try {
    await shopApiFetch<{ success: boolean }>(`/bento-tiles/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting bento tile:', error);
    return false;
  }
}

// ============ ADVERTISEMENT SLIDES ============

export async function fetchAdvertisementSlides(): Promise<AdSlide[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; slides: AdSlide[] }>(
      '/slides?activeOnly=true'
    );
    return response.slides || [];
  } catch (error) {
    console.error('Error fetching advertisement slides:', error);
    return [];
  }
}

export async function fetchAllAdvertisementSlides(): Promise<AdSlide[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; slides: AdSlide[] }>(
      '/slides'
    );
    return response.slides || [];
  } catch (error) {
    console.error('Error fetching all advertisement slides:', error);
    return [];
  }
}

export async function createAdvertisementSlide(slide: Omit<AdSlide, 'id' | 'created_at' | 'updated_at'>): Promise<AdSlide | null> {
  try {
    const response = await shopApiFetch<{ success: boolean; slide: AdSlide }>(
      '/slides',
      {
        method: 'POST',
        body: JSON.stringify(slide),
      }
    );
    return response.slide || null;
  } catch (error) {
    console.error('Error creating advertisement slide:', error);
    return null;
  }
}

export async function updateAdvertisementSlide(id: string, updates: Partial<AdSlide>): Promise<AdSlide | null> {
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  try {
    const response = await shopApiFetch<{ success: boolean; slide: AdSlide }>(
      `/slides/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(cleanUpdates),
      }
    );
    return response.slide || null;
  } catch (error) {
    console.error('Error updating advertisement slide:', error);
    return null;
  }
}

export async function deleteAdvertisementSlide(id: string): Promise<boolean> {
  try {
    await shopApiFetch<{ success: boolean }>(`/slides/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting advertisement slide:', error);
    return false;
  }
}

// ============ HERO GRID IMAGES ============

export async function fetchHeroGridImages(): Promise<HeroGridImage[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; images: HeroGridImage[] }>(
      '/hero-images?activeOnly=true'
    );
    return response.images || [];
  } catch (error) {
    console.error('Error fetching hero grid images:', error);
    return [];
  }
}

export async function fetchAllHeroGridImages(): Promise<HeroGridImage[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; images: HeroGridImage[] }>(
      '/hero-images'
    );
    return response.images || [];
  } catch (error) {
    console.error('Error fetching all hero grid images:', error);
    return [];
  }
}

export async function createHeroGridImage(image: Omit<HeroGridImage, 'id' | 'created_at' | 'updated_at'>): Promise<HeroGridImage | null> {
  try {
    const response = await shopApiFetch<{ success: boolean; image: HeroGridImage }>(
      '/hero-images',
      {
        method: 'POST',
        body: JSON.stringify(image),
      }
    );
    return response.image || null;
  } catch (error) {
    console.error('Error creating hero grid image:', error);
    return null;
  }
}

export async function updateHeroGridImage(id: string, updates: Partial<HeroGridImage>): Promise<HeroGridImage | null> {
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  try {
    const response = await shopApiFetch<{ success: boolean; image: HeroGridImage }>(
      `/hero-images/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(cleanUpdates),
      }
    );
    return response.image || null;
  } catch (error) {
    console.error('Error updating hero grid image:', error);
    return null;
  }
}

export async function deleteHeroGridImage(id: string): Promise<boolean> {
  try {
    await shopApiFetch<{ success: boolean }>(`/hero-images/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting hero grid image:', error);
    return false;
  }
}

// ============ ACCORDION ITEMS ============

export async function fetchAccordionItems(): Promise<AccordionItem[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; items: AccordionItem[] }>(
      '/accordion?activeOnly=true'
    );
    return response.items || [];
  } catch (error) {
    console.error('Error fetching accordion items:', error);
    return [];
  }
}

export async function fetchAllAccordionItems(): Promise<AccordionItem[]> {
  try {
    const response = await shopApiFetch<{ success: boolean; items: AccordionItem[] }>(
      '/accordion'
    );
    return response.items || [];
  } catch (error) {
    console.error('Error fetching all accordion items:', error);
    return [];
  }
}

export async function createAccordionItem(item: Omit<AccordionItem, 'id' | 'created_at' | 'updated_at'>): Promise<AccordionItem | null> {
  try {
    const response = await shopApiFetch<{ success: boolean; item: AccordionItem }>(
      '/accordion',
      {
        method: 'POST',
        body: JSON.stringify(item),
      }
    );
    return response.item || null;
  } catch (error) {
    console.error('Error creating accordion item:', error);
    return null;
  }
}

export async function updateAccordionItem(id: string, updates: Partial<AccordionItem>): Promise<AccordionItem | null> {
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  try {
    const response = await shopApiFetch<{ success: boolean; item: AccordionItem }>(
      `/accordion/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(cleanUpdates),
      }
    );
    return response.item || null;
  } catch (error) {
    console.error('Error updating accordion item:', error);
    return null;
  }
}

export async function deleteAccordionItem(id: string): Promise<boolean> {
  try {
    await shopApiFetch<{ success: boolean }>(`/accordion/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting accordion item:', error);
    return false;
  }
}

// ============ IMAGE UPLOAD FUNCTIONS ============
// Uses Cloudflare R2 via the storage Netlify function

const STORAGE_API_BASE = '/.netlify/functions/storage';

export type ImageFolder = 'slides' | 'tiles' | 'hero' | 'accordion' | 'logos' | 'uploads';

interface PresignResponse {
  success: boolean;
  presignedUrl: string;
  key: string;
  publicUrl: string;
  contentType: string;
  expiresIn: number;
  error?: string;
}

interface DirectUploadResponse {
  success: boolean;
  key: string;
  publicUrl: string;
  contentType: string;
  size: number;
  error?: string;
}

interface DeleteResponse {
  success: boolean;
  deletedKey?: string;
  error?: string;
}

interface StorageInfoResponse {
  success: boolean;
  configured: boolean;
  bucket: string | null;
  publicUrl: string | null;
  message: string;
}

/**
 * Check if R2 storage is configured
 */
export async function checkStorageConfigured(): Promise<boolean> {
  try {
    const response = await fetch(`${STORAGE_API_BASE}/info`);
    const data: StorageInfoResponse = await response.json();
    return data.configured;
  } catch (error) {
    console.error('Error checking storage configuration:', error);
    return false;
  }
}

/**
 * Upload an image to Cloudflare R2
 * Uses presigned URLs for direct client-to-R2 upload (more efficient for large files)
 *
 * @param file - The file to upload
 * @param folder - The folder/category for organization
 * @returns The public URL of the uploaded image, or null on failure
 */
export async function uploadImage(file: File, folder: ImageFolder = 'uploads'): Promise<string | null> {
  try {
    // Step 1: Get a presigned URL from our backend
    const presignResponse = await fetch(`${STORAGE_API_BASE}/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        folder,
        contentType: file.type,
      }),
    });

    if (!presignResponse.ok) {
      const errorData = await presignResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to get presigned URL: ${presignResponse.status}`);
    }

    const presignData: PresignResponse = await presignResponse.json();

    if (!presignData.success || !presignData.presignedUrl) {
      throw new Error(presignData.error || 'Failed to get presigned URL');
    }

    // Step 2: Upload directly to R2 using the presigned URL
    const uploadResponse = await fetch(presignData.presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': presignData.contentType,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload to R2: ${uploadResponse.status}`);
    }

    console.log('Image uploaded successfully:', presignData.publicUrl);
    return presignData.publicUrl;

  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Upload an image using base64 data (for smaller images or when File API isn't available)
 * This uploads through our server rather than directly to R2
 *
 * @param base64Data - Base64 encoded image data (without data: prefix)
 * @param filename - Original filename
 * @param folder - The folder/category for organization
 * @param contentType - MIME type of the image
 * @returns The public URL of the uploaded image, or null on failure
 */
export async function uploadImageBase64(
  base64Data: string,
  filename: string,
  folder: ImageFolder = 'uploads',
  contentType?: string
): Promise<string | null> {
  try {
    // Remove data URL prefix if present
    const cleanData = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch(`${STORAGE_API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        folder,
        data: cleanData,
        contentType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }

    const data: DirectUploadResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Upload failed');
    }

    console.log('Image uploaded successfully:', data.publicUrl);
    return data.publicUrl;

  } catch (error) {
    console.error('Error uploading image (base64):', error);
    return null;
  }
}

/**
 * Delete an image from Cloudflare R2
 *
 * @param url - The public URL or key of the image to delete
 * @returns true if deletion was successful, false otherwise
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Skip deletion for local/public folder images
    if (url.startsWith('/') && !url.includes('.r2.dev') && !url.includes('r2.cloudflarestorage.com')) {
      console.log('Skipping deletion for local image:', url);
      return true; // Consider it successful - local images aren't in R2
    }

    const response = await fetch(`${STORAGE_API_BASE}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Delete failed: ${response.status}`);
    }

    const data: DeleteResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Delete failed');
    }

    console.log('Image deleted successfully:', data.deletedKey);
    return true;

  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

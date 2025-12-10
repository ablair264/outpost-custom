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
// TODO: These will be migrated to use Cloudflare R2
// For now, images should be uploaded manually and URLs stored in the database

export async function uploadImage(file: File, folder: 'slides' | 'tiles'): Promise<string | null> {
  // TODO: Implement Cloudflare R2 upload
  console.warn('Image upload not yet implemented - please upload images manually and provide URLs');
  return null;
}

export async function deleteImage(url: string): Promise<boolean> {
  // TODO: Implement Cloudflare R2 delete
  console.warn('Image delete not yet implemented');
  return false;
}

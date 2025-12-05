import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Fetch functions
export async function fetchBentoTiles(section: 'left' | 'right'): Promise<BentoTile[]> {
  const { data, error } = await supabase
    .from('bento_tiles')
    .select('*')
    .eq('grid_section', section)
    .eq('is_active', true)
    .order('grid_position', { ascending: true });

  if (error) {
    console.error('Error fetching bento tiles:', error);
    return [];
  }

  return data || [];
}

export async function fetchAdvertisementSlides(): Promise<AdSlide[]> {
  const { data, error } = await supabase
    .from('advertisement_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching advertisement slides:', error);
    return [];
  }

  return data || [];
}

export async function fetchAllAdvertisementSlides(): Promise<AdSlide[]> {
  const { data, error } = await supabase
    .from('advertisement_slides')
    .select('*')
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching all advertisement slides:', error);
    return [];
  }

  return data || [];
}

export async function fetchAllBentoTiles(): Promise<BentoTile[]> {
  const { data, error } = await supabase
    .from('bento_tiles')
    .select('*')
    .order('grid_section', { ascending: true })
    .order('grid_position', { ascending: true });

  if (error) {
    console.error('Error fetching all bento tiles:', error);
    return [];
  }

  return data || [];
}

// CRUD functions for Advertisement Slides
export async function createAdvertisementSlide(slide: Omit<AdSlide, 'id' | 'created_at' | 'updated_at'>): Promise<AdSlide | null> {
  const { data, error } = await supabase
    .from('advertisement_slides')
    .insert([slide])
    .select()
    .single();

  if (error) {
    console.error('Error creating advertisement slide:', error);
    return null;
  }

  return data;
}

export async function updateAdvertisementSlide(id: string, updates: Partial<AdSlide>): Promise<AdSlide | null> {
  // Remove updated_at from updates as it's handled by database trigger
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  console.log('updateAdvertisementSlide called with:', { id, updates, cleanUpdates });

  // Check if cleanUpdates is empty
  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  const { data, error } = await supabase
    .from('advertisement_slides')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating advertisement slide:', error);
    return null;
  }

  console.log('Update successful:', data);
  return data;
}

export async function deleteAdvertisementSlide(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('advertisement_slides')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting advertisement slide:', error);
    return false;
  }

  return true;
}

// CRUD functions for Bento Tiles
export async function createBentoTile(tile: Omit<BentoTile, 'id' | 'created_at' | 'updated_at'>): Promise<BentoTile | null> {
  const { data, error } = await supabase
    .from('bento_tiles')
    .insert([tile])
    .select()
    .single();

  if (error) {
    console.error('Error creating bento tile:', error);
    return null;
  }

  return data;
}

export async function updateBentoTile(id: string, updates: Partial<BentoTile>): Promise<BentoTile | null> {
  // Remove updated_at from updates as it's handled by database trigger
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  console.log('updateBentoTile called with:', { id, updates, cleanUpdates });

  // Check if cleanUpdates is empty
  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  const { data, error } = await supabase
    .from('bento_tiles')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bento tile:', error);
    return null;
  }

  console.log('Update successful:', data);
  return data;
}

export async function deleteBentoTile(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('bento_tiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting bento tile:', error);
    return false;
  }

  return true;
}

// Image Upload Functions
export async function uploadImage(file: File, folder: 'slides' | 'tiles'): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('shop-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('shop-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Extract path from URL
    const urlParts = url.split('/shop-images/');
    if (urlParts.length < 2) return false;

    const path = urlParts[1];

    const { error } = await supabase.storage
      .from('shop-images')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

// Hero Grid Image Functions
export async function fetchHeroGridImages(): Promise<HeroGridImage[]> {
  const { data, error } = await supabase
    .from('hero_grid_images')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching hero grid images:', error);
    return [];
  }

  return data || [];
}

export async function fetchAllHeroGridImages(): Promise<HeroGridImage[]> {
  const { data, error } = await supabase
    .from('hero_grid_images')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching all hero grid images:', error);
    return [];
  }

  return data || [];
}

export async function createHeroGridImage(image: Omit<HeroGridImage, 'id' | 'created_at' | 'updated_at'>): Promise<HeroGridImage | null> {
  const { data, error } = await supabase
    .from('hero_grid_images')
    .insert([image])
    .select()
    .single();

  if (error) {
    console.error('Error creating hero grid image:', error);
    return null;
  }

  return data;
}

export async function updateHeroGridImage(id: string, updates: Partial<HeroGridImage>): Promise<HeroGridImage | null> {
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  const { data, error } = await supabase
    .from('hero_grid_images')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating hero grid image:', error);
    return null;
  }

  return data;
}

export async function deleteHeroGridImage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('hero_grid_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting hero grid image:', error);
    return false;
  }

  return true;
}

// Accordion Item Functions
export async function fetchAccordionItems(): Promise<AccordionItem[]> {
  const { data, error } = await supabase
    .from('accordion_items')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching accordion items:', error);
    return [];
  }

  return data || [];
}

export async function fetchAllAccordionItems(): Promise<AccordionItem[]> {
  const { data, error } = await supabase
    .from('accordion_items')
    .select('*')
    .order('order_position', { ascending: true });

  if (error) {
    console.error('Error fetching all accordion items:', error);
    return [];
  }

  return data || [];
}

export async function createAccordionItem(item: Omit<AccordionItem, 'id' | 'created_at' | 'updated_at'>): Promise<AccordionItem | null> {
  const { data, error } = await supabase
    .from('accordion_items')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error('Error creating accordion item:', error);
    return null;
  }

  return data;
}

export async function updateAccordionItem(id: string, updates: Partial<AccordionItem>): Promise<AccordionItem | null> {
  const { updated_at, created_at, ...cleanUpdates } = updates as any;

  if (Object.keys(cleanUpdates).length === 0) {
    console.error('No valid fields to update after filtering');
    return null;
  }

  const { data, error } = await supabase
    .from('accordion_items')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating accordion item:', error);
    return null;
  }

  return data;
}

export async function deleteAccordionItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('accordion_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting accordion item:', error);
    return false;
  }

  return true;
}

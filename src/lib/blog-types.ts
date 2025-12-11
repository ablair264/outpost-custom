// Blog & Case Study Types for Outpost Custom

export type BlogCategory =
  | 'design-tips'
  | 'print-guides'
  | 'case-studies'
  | 'news'
  | 'signage'
  | 'clothing';

export type ContentBlockType =
  | 'text'
  | 'heading'
  | 'image'
  | 'quote'
  | 'info-box'
  | 'table'
  | 'list'
  | 'two-column'
  | 'gallery'
  | 'cta';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string; // JSON string for complex content
}

export interface TextBlock extends ContentBlock {
  type: 'text';
  content: string; // HTML content
}

export interface HeadingBlock extends ContentBlock {
  type: 'heading';
  content: string;
  level?: 2 | 3 | 4;
}

export interface ImageBlock extends ContentBlock {
  type: 'image';
  content: string; // JSON: { src, alt, caption? }
}

export interface QuoteBlock extends ContentBlock {
  type: 'quote';
  content: string; // JSON: { text, author?, role? }
}

export interface InfoBoxBlock extends ContentBlock {
  type: 'info-box';
  content: string; // JSON: { title, text, icon? }
}

export interface TableBlock extends ContentBlock {
  type: 'table';
  content: string; // JSON: { headers: string[], rows: string[][] }
}

export interface ListBlock extends ContentBlock {
  type: 'list';
  content: string; // JSON: { items: string[], ordered?: boolean }
}

export interface TwoColumnBlock extends ContentBlock {
  type: 'two-column';
  content: string; // JSON: { left: string, right: string }
}

export interface GalleryBlock extends ContentBlock {
  type: 'gallery';
  content: string; // JSON: { images: { src, alt, label }[] }
}

export interface CTABlock extends ContentBlock {
  type: 'cta';
  content: string; // JSON: { title, text, buttonText, buttonLink }
}

export interface Author {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  featuredImage?: string;
  iconName?: string; // Lucide icon name for placeholder
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: number; // minutes
  featured?: boolean;
  blocks: ContentBlock[];
  relatedPosts?: string[]; // Array of post slugs
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  clientName: string;
  clientLocation?: string;
  industry: string;
  tags: string[];
  featuredImage?: string;
  iconName?: string;
  publishedAt: string;
  stats: CaseStudyStats[];
  challenge: string;
  solution: string;
  deliverables: string[];
  processSteps: ProcessStep[];
  results: CaseStudyResult[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  gallery: GalleryItem[];
  relatedCaseStudies?: string[]; // Array of case study slugs
}

export interface CaseStudyStats {
  value: string;
  label: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface CaseStudyResult {
  title: string;
  description: string;
  iconName?: string;
}

export interface GalleryItem {
  iconName: string;
  label: string;
  large?: boolean;
}

// Category info for filtering
export const blogCategories: { value: BlogCategory; label: string }[] = [
  { value: 'design-tips', label: 'Design Tips' },
  { value: 'print-guides', label: 'Print Guides' },
  { value: 'case-studies', label: 'Case Studies' },
  { value: 'news', label: 'News' },
  { value: 'signage', label: 'Signage' },
  { value: 'clothing', label: 'Clothing' },
];

// Color theme matching printing section
export const blogColors = {
  dark: '#183028',
  accent: '#64a70b',
  accentLight: '#7ab82e',
  white: '#ffffff',
  offWhite: '#f8f9fa',
  textDark: '#2d2d2d',
  textMuted: '#6b7280',
  borderLight: '#e5e7eb',
} as const;

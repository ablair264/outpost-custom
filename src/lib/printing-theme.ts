// Printing Section Theme Configuration
// Green theme colors and utilities for the printing pages

export const printingColors = {
  // Primary accent - used for buttons, highlights, active states
  accent: '#64a70b',
  accentHover: '#578f09',
  accentLight: '#7ab82e',

  // Dark background - hero sections, dark panels
  dark: '#183028',
  darkHover: '#1f4038',
  darkLight: '#234a3a',

  // Neutral - borders, muted backgrounds, secondary text
  neutral: '#c1c6c8',
  neutralLight: '#e8eaeb',
  neutralDark: '#9a9fa1',

  // Text colors
  textPrimary: 'rgba(51, 51, 51, 0.8)', // #333333 at 80%
  textDark: '#333333',
  textLight: '#ffffff',
  textMuted: '#666666',

  // Background
  white: '#ffffff',
  offWhite: '#f8f8f8',
  lightGray: '#f5f5f5',
} as const;

// Gradient configurations
export const printingGradients = {
  heroOverlay: 'linear-gradient(180deg, rgba(24,48,40,0.95) 0%, rgba(24,48,40,0.7) 50%, rgba(24,48,40,0.95) 100%)',
  cardOverlay: 'linear-gradient(180deg, rgba(24,48,40,1) 0%, rgba(0,0,0,0.07) 100%)',
  ctaButton: 'linear-gradient(135deg, #7ab82e 0%, #64a70b 50%, #4a7d08 100%)',
} as const;

// Font family definitions
export const printingFonts = {
  hearns: "'Hearns', Georgia, serif",
  embossing: "'Embossing Tape', monospace",
  smilecake: "'Smilecake', cursive",
  neuzeit: "'Neuzeit Grotesk', 'Helvetica Neue', sans-serif",
  neuzeitLight: "'Neuzeit Grotesk Light', 'Helvetica Neue', sans-serif",
} as const;

// CSS classes for fonts (to use with className)
export const fontClasses = {
  hearns: 'hearns-font',
  embossing: 'embossing-font',
  smilecake: 'smilecake-font',
  neuzeit: 'neuzeit-font',
  neuzeitLight: 'neuzeit-light-font',
} as const;

// Category definitions for the printing section
export const printingCategories = [
  {
    slug: 'promotional-marketing',
    title: 'Promotional Marketing',
    description: 'Flyers, posters, booklets, and event materials',
    jsonCategories: ['Printing', 'Promotional Marketing + Events'],
    hoverItems: ['Flyers', 'Posters', 'Booklets', 'Table Talkers'],
  },
  {
    slug: 'business-stationery',
    title: 'Business Stationery',
    description: 'Business cards, letterheads, and appointment cards',
    jsonCategories: ['Business Stationery'],
    hoverItems: ['Business Cards', 'Letterheads', 'Compliment Slips'],
  },
  {
    slug: 'resale-gifting',
    title: 'Resale & Gifting',
    description: 'Cards, calendars, art prints, and gift vouchers',
    jsonCategories: ['Resale Product'],
    hoverItems: ['Greetings Cards', 'Calendars', 'Art Prints'],
  },
  {
    slug: 'packaging',
    title: 'Packaging',
    description: 'Labels, swing tags, backing cards, and stickers',
    jsonCategories: ['Packaging'],
    hoverItems: ['Swing Tags', 'Stickers', 'Belly Bands'],
  },
  {
    slug: 'funerals',
    title: 'Funerals',
    description: 'Order of service booklets and memorial signs',
    jsonCategories: ['Funerals'],
    hoverItems: ['Order of Service', 'Memorial Signs'],
  },
] as const;

// Finish types for filtering
export const finishTypes = [
  { value: 'matt-lamination', label: 'Matt Lamination' },
  { value: 'gloss-lamination', label: 'Gloss Lamination' },
  { value: 'uncoated', label: 'Uncoated' },
  { value: 'coated-silk', label: 'Coated Silk' },
  { value: 'wire-binding', label: 'Wire Binding' },
  { value: 'saddle-stitched', label: 'Saddle Stitched' },
  { value: 'rounded-corners', label: 'Rounded Corners' },
  { value: 'drilled-holes', label: 'Drilled Holes' },
  { value: 'foil', label: 'Foil Finish' },
] as const;

// How it works steps for printing
export const printingProcessSteps = [
  {
    title: 'Chat & Quote',
    description: 'Chat to our team who can advise on the best print solution. Get a FREE quote from our set price list or request a quote for bespoke options.',
    icon: 'MessageCircle',
  },
  {
    title: 'Submit Artwork',
    description: 'Email us your PDF artwork for a FREE artwork check. Share from Canva or let our design team help create your design.',
    icon: 'Palette',
  },
  {
    title: 'Approve Order',
    description: "We'll send you a digital proof to approve. Once confirmed, we'll get it into production - usually 4-7 working days.",
    icon: 'CheckCircle2',
  },
  {
    title: 'Order Up!',
    description: "We'll let you know when your order is ready to collect from our Kidderminster shop, or we can arrange delivery.",
    icon: 'Package',
  },
] as const;

// Feature highlights for printing section
export const printingFeatures = [
  {
    title: 'QUALITY',
    description: 'Stand out from the crowd with the best finish. Vivid Colour. Shiniest Glosses or Silkiest Matt.',
    icon: 'Award',
  },
  {
    title: 'SPEED',
    description: 'Need your printing in a hurry? It can be delivered to your doorstep the very next day.',
    icon: 'Zap',
  },
  {
    title: 'QUANTITY',
    description: 'The beauty of digital printing is there are no minimum or maximum quantities, we can handle it all.',
    icon: 'Layers',
  },
  {
    title: 'KNOWLEDGE',
    description: 'Our in-house print team have been trained by Industry experts with over 50 years of print experience.',
    icon: 'GraduationCap',
  },
] as const;

// Type exports
export type PrintingCategory = typeof printingCategories[number];
export type FinishType = typeof finishTypes[number];
export type ProcessStep = typeof printingProcessSteps[number];
export type PrintingFeature = typeof printingFeatures[number];

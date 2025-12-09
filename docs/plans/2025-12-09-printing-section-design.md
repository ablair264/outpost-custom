# Printing Section Design

**Date:** 2025-12-09
**Status:** Approved

## Overview

A new printing products section for Outpost Custom, providing easy navigation through 36+ printing products. Uses the green theme and follows the existing design language established in the signage pages.

## Page Structure

```
/printing                    → Main landing page (feature-rich)
/printing/[category]         → Category collection pages (5 categories)
/printing/all                → Browse all products with filters
/printing/[category]/[slug]  → Individual product pages
```

### Categories (6 total)

| Route | Category | Products |
|-------|----------|----------|
| `/printing/promotional-marketing` | Promotional Marketing & Events | Flyers, posters, booklets, table talkers, scratch cards, etc. |
| `/printing/business-stationery` | Business Stationery | Business cards, letterheads, appointment cards, loyalty cards, etc. |
| `/printing/resale-gifting` | Products for Resale/Gifting | Greetings cards, calendars, art prints, gift vouchers, notebooks, etc. |
| `/printing/packaging` | Packaging | Swing tags, backing cards, stickers, belly bands, product labels, etc. |
| `/printing/funerals` | Funerals | Order of service booklets, memorial signs |
| `/printing/all` | Browse All | All products with filters |

---

## Page Designs

### 1. Landing Page (`/printing`)

**Sections (top to bottom):**

1. **Hero Section**
   - Dark background (#183028) with `BlackTextureBackground.webp`
   - `ConcreteTexture.jpg` overlay at 10-20% opacity
   - "Printing" headline (Hearns font)
   - Tagline describing services
   - CTA buttons: "Browse Products" / "Get a Quote"
   - SlimGridMotion with printing images (when available)

2. **How It Works**
   - 4 steps with BrushStrokeCircle icons (green stroke)
   - Steps:
     1. Chat to our team / Get a FREE quote
     2. Submit your artwork (PDF, Canva, or use our design service)
     3. Approve your order (digital proof)
     4. Order up! (collect or delivery)
   - Uses adapted HowItWorksSection component

3. **Category Cards**
   - 6 cards in responsive grid (3x2 desktop, 2x3 tablet, 1x6 mobile)
   - Uses new `PrintingExpandableCard` component (green theme)
   - Shows category name + sample product names on hover
   - Links to collection page

4. **Features Section**
   - 4-column grid on dark background with texture
   - Quality / Speed / Quantity / Knowledge
   - Icons + Embossing Tape font titles
   - Body text in Neuzeit Grotesk Light

5. **Design Help CTA**
   - "Need help with the design first?" (Hearns font)
   - Green scribble underline (`Scribble_Green.png`)
   - Designer experience description
   - "Book a Free Design Consultation" button

---

### 2. Category Collection Pages (`/printing/[category]`)

**Sections:**

1. **Compact Hero**
   - Category name (Hearns font)
   - Breadcrumb navigation
   - Short description
   - Product count badge
   - Light texture background

2. **Toolbar**
   - View toggle: Grid / List (Framer Motion animated indicator)
   - Filters (only on `/printing/all`):
     - Category filter (checkbox pills)
     - Finish type filter (Matt, Gloss, Lamination, etc.)

3. **Product Grid View** (default)
   - 4 columns desktop, 2 tablet, 1 mobile
   - Card shows: Image, Title, Tagline
   - Hover: lift + shadow + "View Details" overlay
   - AnimatePresence for smooth transitions

4. **Product List View** (toggle)
   - Horizontal cards
   - Image left, info right
   - Shows: Title, short description, key specs
   - Badges: "From X units", "Matt/Gloss available"

**Animations:**
- View toggle: `layoutId` sliding indicator
- Grid↔List: `AnimatePresence` with `mode="wait"`, crossfade
- Cards: Staggered fade-in on load

---

### 3. Product Pages (`/printing/[category]/[slug]`)

**Sections:**

1. **Breadcrumb**
   - Printing > Category > Product Name

2. **Hero Section** (two-column)
   - Left: Product image (zoom on hover/click)
   - Right:
     - Title (Hearns font) with green scribble underline
     - "Perfect for..." use-case bullets
     - Key badges: [From X units] [Matt/Gloss] [Sizes available]

3. **CTA Bar** (sticky on mobile)
   - Three buttons:
     - "Submit Artwork" (opens tabbed section)
     - "Request Price List" (mailto or form)
     - "Book Design Consultation" (link to booking)

4. **Artwork Submission Tabs** (Framer Motion)
   - Tab 1: "I have artwork ready"
     - Submit PDF via email to info@outpostcustom.co.uk
     - Share from Canva directly
     - Download FREE InDesign Template
   - Tab 2: "I need help"
     - Template design service (from £25+VAT)
     - Bespoke design quote
   - Animated tab indicator + content crossfade

5. **Specifications Accordion**
   - Uses existing animated Accordion component
   - Sections:
     - Sizes & Dimensions
     - Paper Options
     - Finishing Options
     - Quantities Available
   - Content parsed from product JSON

6. **How It Works** (condensed)
   - 4 icons inline with labels
   - [Chat] → [Design] → [Approve] → [Collect]
   - Horizontal compact version

7. **Design Consultation CTA**
   - "Need help with your design?"
   - Description of designer experience
   - "Book a Free Design Consultation" button

8. **Related Products**
   - "You may also like..."
   - 4 product cards from same category or complementary products

---

## Visual Styling

### Color Palette (Green Theme)

```css
--primary-accent:    #64a70b;  /* Buttons, highlights, active states */
--dark-background:   #183028;  /* Hero sections, dark panels */
--neutral:           #c1c6c8;  /* Borders, muted backgrounds */
--text-primary:      rgba(51, 51, 51, 0.8);  /* Body text */
--text-light:        #ffffff;  /* Text on dark backgrounds */
```

### Typography

| Element | Font | CSS Class | Usage |
|---------|------|-----------|-------|
| Page titles | Hearns | `.hearns-font` | Large headers, product names |
| Section titles | Embossing Tape | `.embossing-font` | Uppercase labels, features |
| Subheaders | Smilecake | `.smilecake-font` | Friendly accents, categories |
| Body text | Neuzeit Grotesk Light | `.neuzeit-font` | Descriptions, specs |

### Texture Backgrounds

- `BlackTextureBackground.webp` - Dark sections at full opacity
- `ConcreteTexture.jpg` - Overlay at 10-20% opacity for depth

### Decorative Elements

- `Scribble_Green.png` - Underline for key headers
- Green accent lines and dot patterns (matching HowItWorksSection style)

---

## Components to Create

### New Components

| Component | Description |
|-----------|-------------|
| `PrintingExpandableCard` | Green-themed version of ExpandableCard for category cards |
| `PrintingHowItWorks` | Adapted HowItWorksSection with printing-specific steps |
| `ProductGrid` | Grid view for products with hover effects |
| `ProductList` | List view for products with more detail |
| `ViewToggle` | Animated grid/list toggle with Framer Motion |
| `ArtworkSubmissionTabs` | Tabbed interface for artwork options |
| `ProductSpecsAccordion` | Accordion using existing animated component |
| `FilterBar` | Category + finish type filters for browse all |
| `ProductCard` | Reusable card for grid/list views |
| `PrintingProductPage` | Individual product page template |
| `PrintingCategoryPage` | Category collection page template |
| `PrintingLandingPage` | Main /printing landing page |

### Existing Components to Reuse

| Component | Adaptation |
|-----------|------------|
| `SlimGridMotion` | Use with printing images |
| `BrushStrokeCircle` | Change stroke color to green |
| `Accordion` (animate-ui) | Use for product specs |
| `Card` (ui) | Base for product cards |

---

## Data Structure

Products loaded from `/sql/outpost_printing_products.json`.

### Category Mapping

```typescript
const categoryMapping = {
  'promotional-marketing': ['Printing', 'Promotional Marketing + Events'],
  'business-stationery': ['Business Stationery'],
  'resale-gifting': ['Resale Product'],
  'packaging': ['Packaging'],
  'funerals': ['Funerals'],
};
```

### Finish Types for Filtering

```typescript
const finishTypes = [
  'Matt Lamination',
  'Gloss Lamination',
  'Uncoated',
  'Coated Silk',
  'Wire Binding',
  'Saddle Stitched',
  'Rounded Corners',
  'Drilled Holes',
];
```

---

## Animations (Framer Motion)

### View Toggle
```typescript
// Sliding indicator with layoutId
<motion.div layoutId="view-indicator" />

// Grid/List transition
<AnimatePresence mode="wait">
  {view === 'grid' ? <ProductGrid /> : <ProductList />}
</AnimatePresence>
```

### Tab Navigation
```typescript
// Tab indicator slides
<motion.div layoutId="tab-indicator" />

// Content crossfade
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  />
</AnimatePresence>
```

### Card Stagger
```typescript
// Staggered entry
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

---

## Routes to Add (App.tsx)

```typescript
<Route path="/printing" element={<PrintingLandingPage />} />
<Route path="/printing/:category" element={<PrintingCategoryPage />} />
<Route path="/printing/:category/:slug" element={<PrintingProductPage />} />
```

---

## Implementation Order

1. Create green theme utilities and PrintingExpandableCard
2. Build PrintingLandingPage with all sections
3. Create ProductCard, ProductGrid, ProductList components
4. Build ViewToggle and FilterBar components
5. Create PrintingCategoryPage template
6. Build ArtworkSubmissionTabs component
7. Create ProductSpecsAccordion component
8. Build PrintingProductPage template
9. Add routes and test navigation
10. Add images to /public/printing when available

---

## Notes

- Product images currently use external URLs from existing site
- Local images should be added to `/public/printing/` when available
- Price lists are requested via email (no e-commerce checkout)
- Design consultation booking method TBD (form, Calendly, etc.)

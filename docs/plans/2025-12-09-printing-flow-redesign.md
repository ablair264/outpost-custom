# Printing Flow Redesign

## Overview

Redesign the printing product browsing and submission flow to be less e-commerce focused, more user-friendly, with progressive disclosure and streamlined artwork submission.

## Goals

- **Information & trust building** - Educate customers, show quality, guide to contact
- **SEO & discovery** - Help people find via search, move to contact
- **Reduce friction** - Progressive disclosure, no page-hopping
- **Capture quality issues early** - Gentle guidance, not blocking

---

## Flow Architecture

### User Journey
```
Homepage → /printing (Landing) → /printing/all (Browser) → Product interaction
```

### Desktop/Tablet
1. Product browser with sidebar filters
2. Click card → row expands inline (30/70 split)
3. Click "Get Started" → modal with full product info + artwork flow
4. Complete artwork path → customer details → submission

### Mobile
1. Product browser (filters in drawer)
2. Tap card → navigates to full page `/printing/[product-slug]`
3. Same content as desktop modal, but as scrollable page
4. Artwork submission flows naturally within page

### SEO Strategy
- `/printing/[product-slug]` pages exist for direct links and indexing
- Desktop: URL opens browser with modal pre-opened
- Mobile: Shows full product page directly

---

## Product Browser Layout

### Header
- Dark green with breadcrumb
- Title "ALL PRODUCTS" (Hearns font)
- Search bar on right
- Product count below title

### Sidebar (Left, ~280px)
```
PRODUCT TYPE (single select)
├── All
├── Cards
├── Flyers & Leaflets
├── Booklets & Brochures
├── Posters & Prints
├── Stationery
├── Stickers & Labels
├── Calendars
├── Packaging & Tags
└── Specialty

USE CASE (multi-select)
├── Business & Corporate
├── Events & Marketing
├── Retail & Resale
├── Weddings & Celebrations
├── Hospitality & Cafes
├── Funerals & Memorials
└── Seasonal

FINISH (multi-select)
├── Matt Lamination
├── Gloss Lamination
├── Uncoated
└── Silk
```

Mobile: Sidebar becomes slide-out drawer

### Product Grid
- 3 columns desktop, 2 tablet, 1-2 mobile
- Cards: Image, title, short tagline
- Hover: subtle lift, green border hint

---

## Expanded Card (Row Takeover)

### Layout
```
┌────────────────────────────────────────────────────────────────────┐
│┌──────────┐                                                   [X] │
││          │   BUSINESS CARDS                                      │
││  Product │                                                       │
││  Image   │   Perfect for...                                      │
││  (30%)   │   ✓ Networking   ✓ Client meetings   ✓ Professional   │
││          │                                                       │
││  Flush   │   ─────────────────────────────────────────────────   │
││  to top, │   SIZES          PAPER           FINISH               │
││  bottom, │   85 x 55mm      350gsm          Matt                 │
││  left    │                  400gsm          Gloss                │
││          │                  Uncoated        Silk                 │
││          │                                                       │
││          │   [Get Started →]                                     │
│└──────────┘                                                       │
└────────────────────────────────────────────────────────────────────┘
```

### Styling
- Card: `rounded-[10px]`, `overflow: hidden`
- Image: 30% width, flush to top/bottom/left edges, `object-fit: cover`
- Content: 70% width, `padding: 32px`
- "Perfect for..." in Smilecake font (green), items with green check icons

---

## Product Modal / Full Page

### Content Sections
1. **Product Info** - Title, image, use cases, specs (same as expanded card)
2. **Artwork Flow** - PathSelector loads in same container after "Get Started"
3. **Customer Details** - Collected at end before submission
4. **Success State** - Confirmation with next steps

### Artwork Submission Paths
- "I have artwork ready" → SimpleUploader
- "I need design help" → HelpRequestForm
- "Let's discuss my project" → ConsultationBooker

---

## Customer Details Form

### Fields
| Field | Required | Purpose |
|-------|----------|---------|
| Name | Yes | Personalise communication |
| Email | Yes | Send quote |
| Phone | No | Faster response if urgent |
| Company | No | B2B context |
| Notes | No | Special requirements |
| Marketing opt-in | No | GDPR compliant |

### Layout
- 2-column grid for name/email, phone/company
- Full-width notes textarea
- Checkbox for marketing opt-in
- Full-width green submit button
- Privacy reassurance text

---

## Success State

### Content
- Animated green checkmark
- "REQUEST SENT!" (Hearns) + "We're on it" (Smilecake green)
- Personalised message with product name
- "What happens next" steps (numbered with checks)
- Contact info for questions
- Navigation: "Browse More Products" / "Back to Home"

---

## Quality Guidance

### Pre-Upload
- Tip card: "Export at 300 DPI or 'PDF Print' for sharpest results"
- Hover tooltips on source buttons:
  - Canva: "Use 'PDF Print' for best quality"
  - ChatGPT: "AI images may need enhancement"

### Post-Upload Detection
| Quality | User Message | Action |
|---------|--------------|--------|
| Good (>250 DPI) | "Looking good!" | Proceed |
| Acceptable (150-250) | "Looking good!" | Flag for review |
| Low (<150) | Friendly enhancement offer | Options shown |
| AI-detected | Explain polish needed | Auto-flag |

### AI Detection Heuristics
- Dimensions: 1024x1024, 1792x1024, 1024x1792
- PNG with no EXIF data
- Filename patterns: `DALL-E`, `image_`, `generated`

---

## Technical Implementation

### New Components Needed
1. `PrintingBrowser` - Main browser with sidebar
2. `ProductCard` - Grid card with expand trigger
3. `ExpandedProductCard` - Row takeover component
4. `ProductModal` - Full modal with artwork flow
5. `CustomerDetailsForm` - Details collection
6. `SubmissionSuccess` - Confirmation state

### Modified Components
- `SimpleUploader` - Already updated with ChatGPT, quality tips
- `PathSelector` - Already exists (removed "Most Popular" badge)
- Product data - Add use-case tags, type categories

### Routes
- `/printing` - Landing page (existing)
- `/printing/all` - Browser (update PrintingCategoryPage)
- `/printing/[slug]` - Product detail (triggers modal/page)

---

## Design Tokens

### Colors
- Accent: `#64a70b`
- Dark: `#183028`
- Neutral: `#c1c6c8`

### Fonts
- Headers: Hearns
- Subheaders: Smilecake
- Body: Neuzeit Grotesk (Light for body, Regular for emphasis)

### Border Radius
- Cards, buttons, inputs: `10px`
- Large containers: `15px`

---

## Open Questions

1. Should we keep individual category pages (`/printing/business-stationery`) or redirect to browser with filter?
2. Email/notification system for submissions - what backend?
3. File storage for uploaded artwork?

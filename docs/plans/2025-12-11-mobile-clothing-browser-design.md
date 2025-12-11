# Mobile Clothing Browser UI Redesign

**Date:** 2025-12-11
**Scope:** Mobile-only changes to ClothingBrowser and product card interactions

## Overview

Redesign the mobile experience for the clothing browser with a sticky filter bar, grid/row view toggle, and bottom sheet product details modal.

## Design Decisions

### 1. Mobile Sticky Header Bar

**Layout (left to right):**
- Filter dropdown button - Shows filter icon + "Filters" text
- Grid/Row toggle - Two icons in pill container
- Search icon - Magnifying glass on right

**Search expansion:**
- Tapping search icon expands input full-width from right to left
- Covers filter button and toggle (hidden behind)
- X button inside input to clear/close
- Tap outside also collapses search

**Sticky behavior:**
- `position: sticky` below main site header
- Background: `#183028`

### 2. Grid/Row View Toggle

**Toggle component:**
- Pill-shaped container with grid + list icons
- Active state: accent green (`#64a70b`)
- Inactive state: muted color

**Grid view (default):**
- 2 columns on mobile
- Current collapsed ClothingCard design
- Tap opens bottom sheet

**Row view:**
- Single column, full-width cards
- Styled like expanded card (image left, info right)
- More compact for mobile
- Tap opens bottom sheet

### 3. Bottom Sheet Product Details Modal

**Appearance:**
- ~85% screen height
- 10px top border radius
- Green drag handle pill with shadow at top center
- Dark background (`#183028` or `#1e3a2f`)

**Dismissal:**
- Swipe down gesture only (no X button)
- ~100px drag threshold triggers dismiss
- Semi-transparent dark backdrop

**Content:**
- Full ProductDetailsNew page content embedded
- Scrollable within sheet
- Image carousel, color/size selectors, product tabs
- "Start Order" button triggers ClothingOrderWizard within sheet
- "How does it work" button loads ClothingHowItWorks within sheet
- All wizard steps (logo upload, help, consultation) stay in sheet

**Implementation:**
- framer-motion for slide animation and drag gesture
- Body scroll locked when open

### 4. Desktop Behavior

- No changes to desktop
- In-place card expand remains for desktop
- Mobile uses bottom sheet instead of in-place expand

## Component Architecture

### New Components

1. **`MobileProductSheet.tsx`**
   - Bottom sheet modal with drag-to-dismiss
   - Renders ProductDetailsNew content
   - Manages sheet open/close state

2. **`MobileFilterBar.tsx`**
   - Sticky header bar
   - Filter button, view toggle, expandable search
   - Mobile-only (hidden on `sm:` and above)

3. **`MobileRowCard.tsx`**
   - Full-width row card for list view
   - Compact version of expanded card design

### Modified Components

1. **`ClothingBrowser.tsx`**
   - Add `viewMode: 'grid' | 'row'` state
   - Add `selectedProduct: ProductGroup | null` state
   - Render MobileFilterBar on mobile
   - Render MobileProductSheet when product selected

2. **`ClothingCard.tsx`**
   - On mobile: tap triggers `onMobileSelect` callback instead of expand
   - Desktop behavior unchanged

## State Management

```typescript
// ClothingBrowser state additions
const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
const [selectedProduct, setSelectedProduct] = useState<ProductGroup | null>(null);
const [isSearchExpanded, setIsSearchExpanded] = useState(false);
```

## Tailwind Breakpoints

- Mobile: default (< 640px)
- Desktop: `sm:` and above (>= 640px)
- Use `block sm:hidden` for mobile-only
- Use `hidden sm:block` for desktop-only

## File Locations

```
src/components/clothing/
├── ClothingBrowser.tsx (modified)
├── ClothingCard.tsx (modified)
├── MobileProductSheet.tsx (new)
├── MobileFilterBar.tsx (new)
└── MobileRowCard.tsx (new)
```

# Smart Artwork Upload Wizard - Implementation Plan

## Overview

An intelligent artwork upload system embedded on product pages that validates, previews, and enhances customer files before order - eliminating quality-related delays.

---

## Design System Compliance

### Colors (from `printing-theme.ts`)
```typescript
accent: '#64a70b'      // Primary buttons, success states
accentHover: '#578f09' // Button hover
dark: '#183028'        // Dark sections, overlays
neutral: '#c1c6c8'     // Borders, muted elements
offWhite: '#f8f8f8'    // Light backgrounds
```

### Typography
- **Headers**: `hearns-font` (Hearns)
- **Subheaders/Taglines**: `smilecake-font` (Smilecake)
- **Body**: `neuzeit-light-font` (Neuzeit Grotesk Light)
- **UI Labels**: `neuzeit-font` (Neuzeit Grotesk)

### Border Radius
- Small elements (badges, pills): `rounded-[10px]`
- Buttons, cards, modals: `rounded-[15px]`

### Icons
- Lucide React only (no emojis)
- Size: `w-4 h-4` (small), `w-5 h-5` (medium), `w-6 h-6` (large)

---

## Component Architecture

```
src/
  components/
    printing/
      artwork-wizard/
        ArtworkUploadWizard.tsx       # Main wizard container
        ArtworkDropzone.tsx           # File upload area
        ArtworkAnalyzer.tsx           # Quality analysis display
        ArtworkPreview.tsx            # Preview tabs (mockup, zoom, compare)
        ArtworkEnhancer.tsx           # Enhancement before/after view
        ArtworkHelpPanel.tsx          # Help options (form, chat, call)
        ImportSourcePicker.tsx        # Canva, Drive, Dropbox buttons
        QualityScoreRing.tsx          # Circular quality indicator
        index.ts                      # Exports

  lib/
    artwork-analysis.ts               # Client-side file analysis utilities
    artwork-types.ts                  # TypeScript interfaces
    artwork-constants.ts              # Quality thresholds, messages
```

---

## User Flow Wireframes (Lucide Icons)

### Step 1: Upload Interface

```
+------------------------------------------------------------------+
|                                                                    |
|  hearns-font: "Add Your Artwork"                                  |
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |      [Upload]  Drag & drop or click to upload             |  |
|  |               JPG, PNG, PDF, SVG, AI, EPS                 |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  ----------------------- or import from -----------------------   |
|                                                                    |
|  +----------------+  +----------------+  +----------------+       |
|  | [Palette]      |  | [Cloud]        |  | [HardDrive]    |       |
|  | Canva          |  | Google Drive   |  | Dropbox        |       |
|  +----------------+  +----------------+  +----------------+       |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 2: Analysis Results (Issues Found)

```
+------------------------------------------------------------------+
|  [X]                                                              |
|                                                                    |
|  hearns-font: "Your artwork needs attention"                      |
|  neuzeit-light: "We found some issues that may affect print"      |
|                                                                    |
|  +------------------------+  +-------------------------------+    |
|  |                        |  |                               |    |
|  |  [Image Preview]       |  |  Quality Score                |    |
|  |                        |  |      ___                      |    |
|  |                        |  |     /   \                     |    |
|  |                        |  |    | 42  |  out of 100        |    |
|  |                        |  |     \___/                     |    |
|  |                        |  |                               |    |
|  +------------------------+  |  [AlertTriangle] Low Resolution|    |
|                              |  150 DPI (300 recommended)     |    |
|  [Mockup] [Zoom] [Compare]   |                               |    |
|                              |  [AlertTriangle] RGB Colour    |    |
|                              |  May shift when printed        |    |
|                              +-------------------------------+    |
|                                                                    |
|  +------------------------+  +------------------------+           |
|  | [Sparkles]             |  | [Upload]               |           |
|  | Enhance Image          |  | Upload Different       |           |
|  | FREE                   |  | File                   |           |
|  +------------------------+  +------------------------+           |
|                                                                    |
|  +------------------------------------------------------------+  |
|  | [HelpCircle] Need help with your artwork?                  |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 3: Enhancement Result

```
+------------------------------------------------------------------+
|  [X]                                                              |
|                                                                    |
|  hearns-font: "Enhancement Complete"                              |
|  smilecake-font: "Looking much better!"                           |
|                                                                    |
|  +------------------------+     +------------------------+        |
|  |                        |     |                        |        |
|  |  Before                | --> |  After                 |        |
|  |  [Original Image]      |     |  [Enhanced Image]      |        |
|  |                        |     |                        |        |
|  +------------------------+     +------------------------+        |
|                                                                    |
|  Quality: 42  [ArrowRight]  87/100  [CheckCircle]                |
|                                                                    |
|  +------------------------------------------------------------+  |
|  | [Check] Use Enhanced Version                               |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  neuzeit-light: "Not quite right? Our team can help."             |
|                                                                    |
|  +------------+  +-------------+  +------------+                  |
|  | [FileText] |  | [MessageCircle] | [Phone]  |                  |
|  | Enquiry    |  | WhatsApp    |  | Call      |                  |
|  +------------+  +-------------+  +------------+                  |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 4: Success State

```
+------------------------------------------------------------------+
|                                                                    |
|  [CheckCircle] (large, green)                                     |
|                                                                    |
|  hearns-font: "Looking Great!"                                    |
|  neuzeit-light: "Your artwork is ready for print"                 |
|                                                                    |
|  +------------------------+                                       |
|  |                        |                                       |
|  |  [Final Preview]       |     Quality Score: 94/100             |
|  |                        |     Resolution: 300 DPI [Check]       |
|  |                        |     Dimensions: Correct [Check]       |
|  +------------------------+                                       |
|                                                                    |
|  +------------------------------------------------------------+  |
|  | [Check] Continue to Order                                  |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Component Specifications

### 1. ArtworkUploadWizard.tsx

Main container managing wizard state and flow.

```typescript
interface ArtworkUploadWizardProps {
  productSlug: string;
  productTitle: string;
  printDimensions: {
    width: number;  // mm
    height: number; // mm
  };
  onArtworkApproved: (artwork: ApprovedArtwork) => void;
  onClose?: () => void;
}

type WizardStep =
  | 'upload'
  | 'analyzing'
  | 'results'
  | 'enhancing'
  | 'enhanced-preview'
  | 'success';

interface WizardState {
  step: WizardStep;
  originalFile: File | null;
  analysis: ArtworkAnalysis | null;
  enhancedUrl: string | null;
  selectedVersion: 'original' | 'enhanced';
}
```

### 2. ArtworkDropzone.tsx

File upload area with import source options.

```typescript
interface ArtworkDropzoneProps {
  onFileSelect: (file: File) => void;
  onCanvaImport: () => void;
  onGoogleDriveImport: () => void;
  onDropboxImport: () => void;
  acceptedFormats: string[];
  maxSizeMB: number;
}
```

**Styling:**
- Border: `border-2 border-dashed` with `border-[#c1c6c8]`
- Hover: `border-[#64a70b]` with subtle green background
- Rounded: `rounded-[15px]`
- Import buttons: `rounded-[10px]` with icon + label

### 3. ArtworkAnalyzer.tsx

Displays analysis results with quality issues.

```typescript
interface ArtworkAnalyzerProps {
  analysis: ArtworkAnalysis;
  previewUrl: string;
  onEnhance: () => void;
  onUploadNew: () => void;
  onRequestHelp: () => void;
  onProceedAnyway?: () => void; // Only for borderline quality
}

interface ArtworkAnalysis {
  qualityScore: number; // 0-100
  qualityTier: 'good' | 'borderline' | 'severe';
  dpiAtPrint: number;
  requiredDpi: number;
  width: number;
  height: number;
  colorMode: 'rgb' | 'cmyk' | 'grayscale';
  fileFormat: string;
  fileSizeBytes: number;
  issues: AnalysisIssue[];
}

interface AnalysisIssue {
  type: 'resolution' | 'dimensions' | 'color' | 'format';
  severity: 'warning' | 'error';
  message: string;
  recommendation: string;
}
```

### 4. ArtworkPreview.tsx

Tabbed preview with mockup, zoom, and comparison views.

```typescript
interface ArtworkPreviewProps {
  imageUrl: string;
  productSlug: string;
  analysis: ArtworkAnalysis;
  activeTab: 'mockup' | 'zoom' | 'compare';
  onTabChange: (tab: 'mockup' | 'zoom' | 'compare') => void;
}
```

**Tabs styling:**
- Use customised `Tabs` from shadcn
- Active tab: `bg-[#64a70b] text-white rounded-[10px]`
- Inactive: `bg-[#f8f8f8] text-[#333] rounded-[10px]`

### 5. QualityScoreRing.tsx

Circular progress indicator for quality score.

```typescript
interface QualityScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}
```

**Colors by score:**
- 0-49: `#dc2626` (red)
- 50-74: `#f59e0b` (amber)
- 75-100: `#64a70b` (green)

### 6. ArtworkHelpPanel.tsx

Expandable help options.

```typescript
interface ArtworkHelpPanelProps {
  productSlug: string;
  originalFileUrl?: string;
  issuesSummary: string;
}
```

**Contact options:**
- Primary: Enquiry form (opens modal)
- Secondary row: WhatsApp, Live Chat, Phone (icon buttons)

---

## Quality Thresholds

```typescript
// artwork-constants.ts

export const QUALITY_THRESHOLDS = {
  RECOMMENDED_DPI: 300,
  MINIMUM_DPI: 150,
  SEVERE_DPI: 100,

  SCORE_GOOD: 75,
  SCORE_BORDERLINE: 50,
} as const;

export const QUALITY_MESSAGES = {
  good: {
    title: "Looking Great!",
    subtitle: "Your artwork is ready for print",
  },
  borderline: {
    title: "Your artwork needs attention",
    subtitle: "We found some issues that may affect print quality",
  },
  severe: {
    title: "Your artwork can't be printed",
    subtitle: "Please enhance or upload a higher quality file",
  },
} as const;
```

---

## Backend Requirements

### Supabase Edge Functions

#### 1. `analyze-artwork`
```typescript
// Input
{
  fileUrl: string;
  printWidth: number;  // mm
  printHeight: number; // mm
}

// Output
{
  qualityScore: number;
  qualityTier: 'good' | 'borderline' | 'severe';
  dpiAtPrint: number;
  width: number;
  height: number;
  colorMode: string;
  issues: AnalysisIssue[];
}
```

#### 2. `enhance-artwork`
```typescript
// Input
{
  fileUrl: string;
  targetDpi: number;
}

// Output
{
  enhancedUrl: string;
  newQualityScore: number;
  processingTimeMs: number;
}
```

### Supabase Storage

Buckets:
- `artwork-uploads` - Original customer files
- `artwork-enhanced` - Enhanced versions

### Database Schema

```sql
CREATE TABLE artwork_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Product context
  product_slug TEXT NOT NULL,
  print_width_mm INT,
  print_height_mm INT,

  -- Original file
  original_url TEXT NOT NULL,
  original_filename TEXT,
  original_width INT,
  original_height INT,
  original_dpi_at_print DECIMAL(6,2),
  original_quality_score INT,
  original_color_mode TEXT,
  original_file_format TEXT,
  original_file_size_bytes BIGINT,

  -- Analysis
  quality_tier TEXT CHECK (quality_tier IN ('good', 'borderline', 'severe')),
  issues JSONB DEFAULT '[]',

  -- Enhanced file (if applicable)
  enhanced_url TEXT,
  enhanced_quality_score INT,
  enhancement_requested_at TIMESTAMPTZ,
  enhancement_completed_at TIMESTAMPTZ,

  -- User decision
  final_version TEXT CHECK (final_version IN ('original', 'enhanced')),
  user_accepted_warning BOOLEAN DEFAULT FALSE,

  -- Help request
  help_requested BOOLEAN DEFAULT FALSE,
  help_request_note TEXT,
  help_request_method TEXT,

  -- Metadata
  source TEXT DEFAULT 'upload', -- 'upload', 'canva', 'google_drive', 'dropbox'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX idx_artwork_submissions_product ON artwork_submissions(product_slug);
```

---

## External Service Integration

### Image Enhancement (Replicate API)

Using Real-ESRGAN model for upscaling:

```typescript
// Example API call
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
    input: {
      image: fileUrl,
      scale: 4,
      face_enhance: false,
    },
  }),
});
```

**Cost**: ~$0.002 per image

### Canva Connect API

```typescript
// Canva SDK integration
import { CanvaConnect } from '@canva/connect-api';

const canva = new CanvaConnect({
  clientId: process.env.CANVA_CLIENT_ID,
});

// Open design picker
const design = await canva.designs.pick({
  exportFormats: ['png', 'pdf'],
  exportQuality: 'high',
});
```

---

## File Structure Summary

```
src/
  components/
    printing/
      artwork-wizard/
        ArtworkUploadWizard.tsx
        ArtworkDropzone.tsx
        ArtworkAnalyzer.tsx
        ArtworkPreview.tsx
        ArtworkEnhancer.tsx
        ArtworkHelpPanel.tsx
        ImportSourcePicker.tsx
        QualityScoreRing.tsx
        EnquiryFormModal.tsx
        index.ts

  lib/
    artwork-analysis.ts
    artwork-types.ts
    artwork-constants.ts

supabase/
  functions/
    analyze-artwork/
      index.ts
    enhance-artwork/
      index.ts

  migrations/
    YYYYMMDD_create_artwork_submissions.sql
```

---

## Implementation Order

### Phase 1: Core Upload Flow
1. ArtworkDropzone component
2. Client-side file analysis (dimensions, basic validation)
3. ArtworkUploadWizard state management
4. Basic preview display

### Phase 2: Quality Analysis
5. Supabase storage setup
6. `analyze-artwork` edge function
7. ArtworkAnalyzer component
8. QualityScoreRing component
9. Quality tier logic and messaging

### Phase 3: Enhancement
10. Replicate API integration
11. `enhance-artwork` edge function
12. ArtworkEnhancer before/after view
13. Enhancement flow in wizard

### Phase 4: Help & Support
14. ArtworkHelpPanel component
15. EnquiryFormModal
16. WhatsApp/phone integration

### Phase 5: Import Sources
17. Canva Connect integration
18. Google Drive Picker
19. Dropbox Chooser

### Phase 6: Polish
20. Preview tabs (mockup, zoom, compare)
21. Product mockup generation
22. Database logging
23. Error handling and edge cases

---

## Button Styling Reference

```tsx
// Primary action (green)
<button
  className="inline-flex items-center gap-2 px-5 py-3 rounded-[15px] text-white neuzeit-font text-sm font-medium transition-colors"
  style={{ backgroundColor: '#64a70b' }}
>
  <Sparkles className="w-4 h-4" />
  Enhance Image
</button>

// Secondary action (outline)
<button
  className="inline-flex items-center gap-2 px-5 py-3 rounded-[15px] border-2 neuzeit-font text-sm font-medium transition-colors"
  style={{ borderColor: '#c1c6c8', color: '#333' }}
>
  <Upload className="w-4 h-4" />
  Upload Different File
</button>

// Small icon button
<button
  className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] neuzeit-font text-sm transition-colors"
  style={{ backgroundColor: '#f8f8f8', color: '#333' }}
>
  <MessageCircle className="w-4 h-4" />
  WhatsApp
</button>
```

---

## Ready to Build?

This plan covers:
- Full component architecture
- Design system compliance (colors, fonts, radii, icons)
- User flow wireframes
- Backend requirements
- External service integration
- Implementation phases

Confirm to proceed with Phase 1 implementation.

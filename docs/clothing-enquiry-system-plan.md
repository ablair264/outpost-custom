# Clothing Enquiry System - Integration & Backend Plan

## Overview
This document outlines the plan for implementing cloud file imports (Canva, Google Drive, Dropbox) and building an admin backend to manage clothing enquiries.

---

## Part 1: Cloud File Import Integrations

### 1.1 Canva Integration

**Approach**: Canva Connect API (OAuth 2.0)

**Setup Required**:
1. Register app at [Canva Developers](https://www.canva.com/developers/)
2. Obtain Client ID and Client Secret
3. Configure redirect URI (e.g., `https://yoursite.com/auth/canva/callback`)

**Implementation Flow**:
```
User clicks Canva → OAuth popup opens → User selects design →
Canva returns design ID → Fetch PNG export → Process as uploaded file
```

**Key Endpoints**:
- `GET /v1/designs` - List user's designs
- `GET /v1/designs/{design_id}/export` - Export design as image

**Files to Create**:
- `src/lib/canva-integration.ts` - Canva API wrapper
- `src/components/clothing/CanvaPickerModal.tsx` - Design selection UI

**Environment Variables**:
```env
REACT_APP_CANVA_CLIENT_ID=xxx
CANVA_CLIENT_SECRET=xxx (server-side only)
```

---

### 1.2 Google Drive Integration

**Approach**: Google Picker API + Drive API

**Setup Required**:
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Drive API and Google Picker API
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials

**Implementation Flow**:
```
User clicks Drive → Google Picker opens → User selects file →
Get file ID → Download file content → Process as uploaded file
```

**Key APIs**:
- Google Picker API (client-side file selection)
- Drive API v3 for file download

**Files to Create**:
- `src/lib/google-drive-integration.ts` - Drive API wrapper
- `src/hooks/useGooglePicker.ts` - Picker hook

**Environment Variables**:
```env
REACT_APP_GOOGLE_CLIENT_ID=xxx
REACT_APP_GOOGLE_API_KEY=xxx
REACT_APP_GOOGLE_APP_ID=xxx
```

---

### 1.3 Dropbox Integration

**Approach**: Dropbox Chooser (simplest) or full OAuth

**Setup Required**:
1. Create app at [Dropbox Developer Console](https://www.dropbox.com/developers/apps)
2. Get App Key
3. Configure allowed domains

**Implementation Flow** (Chooser - Recommended):
```
User clicks Dropbox → Dropbox Chooser opens → User selects file →
Receive direct link → Fetch file → Process as uploaded file
```

**Dropbox Chooser** (Simplest):
- No server-side code needed
- Returns direct download link
- Limited to 500MB files

**Files to Create**:
- `src/lib/dropbox-integration.ts` - Dropbox wrapper
- Include Dropbox Chooser script in index.html

**Environment Variables**:
```env
REACT_APP_DROPBOX_APP_KEY=xxx
```

---

### 1.4 Unified Import Interface

Create a unified interface for all imports:

```typescript
// src/lib/cloud-import.ts

export interface CloudFile {
  name: string;
  size: number;
  type: string;
  url: string;  // Direct download URL or data URL
  source: 'canva' | 'google-drive' | 'dropbox' | 'local';
}

export interface CloudImportConfig {
  acceptedTypes: string[];
  maxSizeMB: number;
  onFileSelected: (file: CloudFile) => void;
  onError: (error: string) => void;
}
```

---

## Part 2: Admin Backend

### 2.1 Database Schema (Supabase)

**Tables Required**:

```sql
-- Clothing enquiries table
CREATE TABLE clothing_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Status tracking
  status VARCHAR(50) DEFAULT 'new',  -- new, in_progress, quoted, approved, completed, cancelled
  assigned_to UUID REFERENCES auth.users(id),

  -- Contact info
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,

  -- Product info
  product_id VARCHAR(100),
  product_name VARCHAR(255),
  product_style_code VARCHAR(50),
  product_color VARCHAR(100),
  product_color_code VARCHAR(20),
  product_image_url TEXT,

  -- Logo info
  logo_file_name VARCHAR(255),
  logo_file_url TEXT,  -- Supabase Storage URL
  logo_file_size INTEGER,
  logo_format VARCHAR(20),
  logo_width INTEGER,
  logo_height INTEGER,
  logo_quality_tier VARCHAR(20),
  logo_quality_notes JSONB,
  logo_has_transparency BOOLEAN,

  -- Placement preferences (from preview)
  logo_position_x DECIMAL(5,2),
  logo_position_y DECIMAL(5,2),
  logo_size_percent DECIMAL(5,2),

  -- Order details
  estimated_quantity VARCHAR(100),
  additional_notes TEXT,

  -- Quote info (filled by staff)
  quote_amount DECIMAL(10,2),
  quote_notes TEXT,
  quote_sent_at TIMESTAMPTZ,

  -- Metadata
  source VARCHAR(50) DEFAULT 'website',  -- website, phone, email, walk-in
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Index for common queries
CREATE INDEX idx_enquiries_status ON clothing_enquiries(status);
CREATE INDEX idx_enquiries_created ON clothing_enquiries(created_at DESC);
CREATE INDEX idx_enquiries_email ON clothing_enquiries(customer_email);

-- Enquiry notes/activity log
CREATE TABLE enquiry_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES clothing_enquiries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  note_type VARCHAR(50),  -- note, status_change, quote_sent, customer_reply
  content TEXT
);

-- Enable Row Level Security
ALTER TABLE clothing_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_notes ENABLE ROW LEVEL SECURITY;

-- Policies (staff can view all, customers can only view their own)
CREATE POLICY "Staff can view all enquiries" ON clothing_enquiries
  FOR SELECT USING (
    auth.jwt() ->> 'role' IN ('admin', 'staff')
  );

CREATE POLICY "Staff can update enquiries" ON clothing_enquiries
  FOR UPDATE USING (
    auth.jwt() ->> 'role' IN ('admin', 'staff')
  );
```

---

### 2.2 File Storage (Supabase Storage)

**Bucket Setup**:
```sql
-- Create storage bucket for logo files
INSERT INTO storage.buckets (id, name, public)
VALUES ('logo-uploads', 'logo-uploads', false);

-- Policy: Anyone can upload (with size limits handled in app)
CREATE POLICY "Anyone can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logo-uploads' AND
    (storage.foldername(name))[1] = 'enquiries'
  );

-- Policy: Staff can view all, public can view their own (by enquiry ID)
CREATE POLICY "Staff can view all logos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'logo-uploads' AND
    auth.jwt() ->> 'role' IN ('admin', 'staff')
  );
```

---

### 2.3 API Endpoints (Edge Functions or API Routes)

**Submit Enquiry**:
```typescript
// POST /api/clothing-enquiry

interface SubmitEnquiryRequest {
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

  // Logo (base64 or pre-uploaded URL)
  logoData?: string;  // Base64
  logoUrl?: string;   // If already uploaded to storage
  logoAnalysis?: LogoAnalysis;

  // Placement
  logoPositionX?: number;
  logoPositionY?: number;
  logoSizePercent?: number;

  // Details
  estimatedQuantity?: string;
  additionalNotes?: string;
}
```

---

### 2.4 Admin Dashboard Pages

**Pages to Build**:

1. **`/admin/enquiries`** - Enquiries List
   - Filterable by status, date range
   - Search by customer name/email
   - Bulk actions (assign, update status)

2. **`/admin/enquiries/[id]`** - Enquiry Detail
   - Customer info
   - Product details with image
   - Logo preview with analysis
   - Placement preview mockup
   - Notes/activity timeline
   - Quote builder
   - Status management

3. **`/admin/enquiries/analytics`** - Dashboard
   - Enquiries by status (pie chart)
   - Enquiries over time (line chart)
   - Conversion rate (quoted → approved)
   - Average response time

---

### 2.5 EmailJS Integration

**Email Templates Needed**:

1. **Customer Confirmation** (on submit)
   - Thank you message
   - Enquiry reference number
   - Expected response time
   - Contact details

2. **Staff Notification** (on new enquiry)
   - Customer details
   - Product info
   - Logo thumbnail
   - Link to admin panel

3. **Quote Sent** (when staff sends quote)
   - Quote details
   - Mockup image
   - Accept/decline links

**EmailJS Setup**:
```typescript
// src/lib/email-service.ts

import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

// Template IDs
const TEMPLATES = {
  customerConfirmation: 'template_xxx',
  staffNotification: 'template_yyy',
  quoteSent: 'template_zzz',
};

export async function sendCustomerConfirmation(data: {
  to_email: string;
  customer_name: string;
  enquiry_ref: string;
  product_name: string;
}) {
  return emailjs.send(SERVICE_ID, TEMPLATES.customerConfirmation, data, PUBLIC_KEY);
}

export async function sendStaffNotification(data: {
  customer_name: string;
  customer_email: string;
  product_name: string;
  enquiry_id: string;
  admin_link: string;
}) {
  return emailjs.send(SERVICE_ID, TEMPLATES.staffNotification, data, PUBLIC_KEY);
}
```

---

## Part 3: Implementation Priority

### Phase 1: Core Backend (Week 1)
1. ✅ Create Supabase tables and storage bucket
2. ✅ Build enquiry submission API
3. ✅ Connect wizard form to API
4. ✅ Set up EmailJS templates
5. ✅ Send confirmation emails on submit

### Phase 2: Admin Dashboard (Week 2)
1. Build enquiries list page
2. Build enquiry detail page
3. Add status management
4. Add notes/activity log
5. Build simple quote builder

### Phase 3: Cloud Imports (Week 3)
1. Implement Dropbox Chooser (easiest)
2. Implement Google Drive Picker
3. Implement Canva integration (most complex)
4. Unified import handling

### Phase 4: Polish & Analytics (Week 4)
1. Analytics dashboard
2. Email template refinements
3. Bulk operations
4. Export functionality

---

## Environment Variables Summary

```env
# Supabase
REACT_APP_SUPABASE_URL=xxx
REACT_APP_SUPABASE_ANON_KEY=xxx

# EmailJS
REACT_APP_EMAILJS_SERVICE_ID=xxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxx
REACT_APP_EMAILJS_TEMPLATE_CUSTOMER=xxx
REACT_APP_EMAILJS_TEMPLATE_STAFF=xxx

# Cloud Imports (Phase 3)
REACT_APP_DROPBOX_APP_KEY=xxx
REACT_APP_GOOGLE_CLIENT_ID=xxx
REACT_APP_GOOGLE_API_KEY=xxx
REACT_APP_CANVA_CLIENT_ID=xxx
```

---

## File Structure

```
src/
├── lib/
│   ├── enquiry-service.ts      # Submit/fetch enquiries
│   ├── email-service.ts        # EmailJS wrapper
│   ├── cloud-import.ts         # Unified import interface
│   ├── dropbox-integration.ts
│   ├── google-drive-integration.ts
│   └── canva-integration.ts
├── components/
│   └── clothing/
│       ├── CloudImportModal.tsx  # Unified import picker
│       └── ...existing components
├── pages/
│   └── admin/
│       ├── ClothingEnquiries.tsx
│       ├── ClothingEnquiryDetail.tsx
│       └── ClothingAnalytics.tsx
└── types/
    └── enquiry.ts              # TypeScript interfaces
```

---

## Notes

- **Dropbox Chooser** is the simplest to implement - no server-side code, just a client SDK
- **Google Drive** requires more setup but offers good UX with the Picker
- **Canva** is most complex as it requires OAuth and may need a backend proxy for token refresh
- Consider starting with just local upload + Dropbox, then adding others incrementally
- All cloud imports should ultimately produce the same `CloudFile` interface for unified handling

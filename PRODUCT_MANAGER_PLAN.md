# Product Manager Implementation Plan

## Overview

A split-view product management interface with a powerful margin rule builder for ~100k products. The left panel handles rule creation and filtering, while the right panel shows a live preview of products with their calculated prices.

---

## Purple Admin Theme Colors

```typescript
// Admin purple theme colors (used consistently across admin)
const adminColors = {
  // Backgrounds
  bgDark: '#1a1625',           // Main background
  bgCard: '#2a2440',           // Card/panel background
  bgCardHover: '#3d3456',      // Card hover state
  bgInput: '#1e1a2e',          // Input field background

  // Purple accents
  purple: {
    50: 'rgba(139, 92, 246, 0.05)',
    100: 'rgba(139, 92, 246, 0.1)',
    200: 'rgba(139, 92, 246, 0.15)',
    300: 'rgba(139, 92, 246, 0.2)',
    400: '#a78bfa',             // Light purple
    500: '#8b5cf6',             // Primary purple
    600: '#7c3aed',             // Darker purple
    700: '#6d28d9',             // Even darker
  },

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#9ca3af',
  textDim: '#6b7280',

  // Borders
  borderLight: 'rgba(139, 92, 246, 0.1)',
  borderMedium: 'rgba(139, 92, 246, 0.2)',
  borderFocus: 'rgba(139, 92, 246, 0.5)',

  // Status colors (used for badges/indicators)
  status: {
    success: '#c084fc',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#a78bfa',
  }
};
```

---

## Phase 1: Database Schema

### 1.1 Create Migration for Margin Rules

**File:** `prisma/migrations/YYYYMMDD_margin_rules/migration.sql`

```sql
-- Margin rules with explicit hierarchy
CREATE TABLE margin_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  priority INT NOT NULL DEFAULT 6,
  rule_type VARCHAR(50) NOT NULL,

  -- Rule conditions (nullable based on rule_type)
  product_type VARCHAR(255),
  category VARCHAR(255),
  brand VARCHAR(255),
  sku_code VARCHAR(100),

  margin_percentage DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,

  CONSTRAINT valid_rule_type CHECK (rule_type IN (
    'default',
    'category',
    'brand',
    'product_type',
    'product_type_category',
    'product_override'
  )),
  CONSTRAINT valid_priority CHECK (priority BETWEEN 1 AND 6)
);

-- Indexes for margin rules
CREATE INDEX idx_margin_rules_type ON margin_rules(rule_type);
CREATE INDEX idx_margin_rules_active ON margin_rules(is_active);
CREATE INDEX idx_margin_rules_brand ON margin_rules(brand) WHERE brand IS NOT NULL;
CREATE INDEX idx_margin_rules_product_type ON margin_rules(product_type) WHERE product_type IS NOT NULL;
CREATE INDEX idx_margin_rules_category ON margin_rules(category) WHERE category IS NOT NULL;

-- Special offers table
CREATE TABLE special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL,

  rule_type VARCHAR(50) NOT NULL,
  product_type VARCHAR(255),
  category VARCHAR(255),
  brand VARCHAR(255),
  sku_code VARCHAR(100),

  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX idx_special_offers_active ON special_offers(is_active);
CREATE INDEX idx_special_offers_dates ON special_offers(start_date, end_date);

-- Audit log for margin changes
CREATE TABLE margin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL,
  rule_id UUID,
  rule_snapshot JSONB,
  affected_product_count INT,
  performed_by UUID,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rollback_data JSONB
);

CREATE INDEX idx_margin_audit_date ON margin_audit_log(performed_at DESC);
CREATE INDEX idx_margin_audit_rule ON margin_audit_log(rule_id);

-- Add calculated fields to product_data
ALTER TABLE product_data ADD COLUMN IF NOT EXISTS margin_percentage DECIMAL(5,2) DEFAULT 30;
ALTER TABLE product_data ADD COLUMN IF NOT EXISTS calculated_price DECIMAL(10,2);
ALTER TABLE product_data ADD COLUMN IF NOT EXISTS applied_rule_id UUID;
ALTER TABLE product_data ADD COLUMN IF NOT EXISTS is_special_offer BOOLEAN DEFAULT false;
ALTER TABLE product_data ADD COLUMN IF NOT EXISTS offer_discount_percentage DECIMAL(5,2);
ALTER TABLE product_data ADD COLUMN IF NOT EXISTS final_price DECIMAL(10,2);

-- Index for price lookups
CREATE INDEX idx_product_margin ON product_data(margin_percentage);
CREATE INDEX idx_product_final_price ON product_data(final_price);

-- Insert default margin rule
INSERT INTO margin_rules (name, priority, rule_type, margin_percentage, is_active)
VALUES ('Default Margin', 6, 'default', 30.00, true);
```

### 1.2 Update Prisma Schema

**File:** `prisma/schema.prisma` (additions)

```prisma
model MarginRule {
  id                 String    @id @default(uuid())
  name               String    @db.VarChar(100)
  priority           Int       @default(6)
  ruleType           String    @map("rule_type") @db.VarChar(50)
  productType        String?   @map("product_type") @db.VarChar(255)
  category           String?   @db.VarChar(255)
  brand              String?   @db.VarChar(255)
  skuCode            String?   @map("sku_code") @db.VarChar(100)
  marginPercentage   Decimal   @map("margin_percentage") @db.Decimal(5, 2)
  isActive           Boolean   @default(true) @map("is_active")
  createdAt          DateTime  @default(now()) @map("created_at")
  updatedAt          DateTime  @updatedAt @map("updated_at")
  createdBy          String?   @map("created_by")

  @@map("margin_rules")
  @@index([ruleType], name: "idx_margin_rules_type")
  @@index([isActive], name: "idx_margin_rules_active")
}

model SpecialOffer {
  id                  String    @id @default(uuid())
  name                String    @db.VarChar(100)
  discountPercentage  Decimal   @map("discount_percentage") @db.Decimal(5, 2)
  ruleType            String    @map("rule_type") @db.VarChar(50)
  productType         String?   @map("product_type") @db.VarChar(255)
  category            String?   @db.VarChar(255)
  brand               String?   @db.VarChar(255)
  skuCode             String?   @map("sku_code") @db.VarChar(100)
  startDate           DateTime? @map("start_date")
  endDate             DateTime? @map("end_date")
  isActive            Boolean   @default(true) @map("is_active")
  createdAt           DateTime  @default(now()) @map("created_at")
  createdBy           String?   @map("created_by")

  @@map("special_offers")
}

model MarginAuditLog {
  id                   String   @id @default(uuid())
  action               String   @db.VarChar(50)
  ruleId               String?  @map("rule_id")
  ruleSnapshot         Json?    @map("rule_snapshot")
  affectedProductCount Int?     @map("affected_product_count")
  performedBy          String?  @map("performed_by")
  performedAt          DateTime @default(now()) @map("performed_at")
  rollbackData         Json?    @map("rollback_data")

  @@map("margin_audit_log")
  @@index([performedAt(sort: Desc)], name: "idx_margin_audit_date")
}
```

---

## Phase 2: Backend API (Netlify Functions)

### 2.1 Margin Rules API

**File:** `netlify/functions/margin-rules.js`

```javascript
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Rule type priority mapping
const RULE_PRIORITIES = {
  'product_override': 1,
  'product_type_category': 2,
  'product_type': 3,
  'brand': 4,
  'category': 5,
  'default': 6,
};

// Verify JWT token
function verifyAuth(event) {
  const authHeader = event.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  try {
    return jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const user = verifyAuth(event);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const path = event.path.replace('/.netlify/functions/margin-rules', '');
  const method = event.httpMethod;

  try {
    // GET /margin-rules - List all rules
    if (method === 'GET' && (path === '' || path === '/')) {
      const rules = await sql`
        SELECT * FROM margin_rules
        ORDER BY priority ASC, created_at DESC
      `;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ rules }),
      };
    }

    // POST /margin-rules - Create new rule
    if (method === 'POST' && (path === '' || path === '/')) {
      const body = JSON.parse(event.body);
      const { name, ruleType, productType, category, brand, skuCode, marginPercentage } = body;

      const priority = RULE_PRIORITIES[ruleType] || 6;

      const [rule] = await sql`
        INSERT INTO margin_rules (name, priority, rule_type, product_type, category, brand, sku_code, margin_percentage, created_by)
        VALUES (${name}, ${priority}, ${ruleType}, ${productType}, ${category}, ${brand}, ${skuCode}, ${marginPercentage}, ${user.userId})
        RETURNING *
      `;

      // Log the creation
      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, performed_by)
        VALUES ('rule_created', ${rule.id}, ${JSON.stringify(rule)}, ${user.userId})
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ rule }),
      };
    }

    // GET /margin-rules/preview - Preview rule impact
    if (method === 'POST' && path === '/preview') {
      const body = JSON.parse(event.body);
      const { ruleType, productType, category, brand, skuCode } = body;

      let whereClause = "WHERE sku_status != 'Discontinued'";
      const params = [];

      switch (ruleType) {
        case 'product_override':
          whereClause += ` AND sku_code = $1`;
          params.push(skuCode);
          break;
        case 'product_type_category':
          whereClause += ` AND product_type = $1 AND categorisation = $2`;
          params.push(productType, category);
          break;
        case 'product_type':
          whereClause += ` AND product_type = $1`;
          params.push(productType);
          break;
        case 'brand':
          whereClause += ` AND brand = $1`;
          params.push(brand);
          break;
        case 'category':
          whereClause += ` AND categorisation = $1`;
          params.push(category);
          break;
        case 'default':
          // Affects all products
          break;
      }

      const countQuery = `SELECT COUNT(*) as count FROM product_data ${whereClause}`;
      const marginQuery = `
        SELECT
          MIN(margin_percentage) as min_margin,
          MAX(margin_percentage) as max_margin,
          AVG(margin_percentage) as avg_margin
        FROM product_data ${whereClause}
      `;

      const [countResult] = await sql.query(countQuery, params);
      const [marginResult] = await sql.query(marginQuery, params);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          affectedCount: parseInt(countResult.count),
          currentMargins: {
            min: parseFloat(marginResult.min_margin) || 0,
            max: parseFloat(marginResult.max_margin) || 0,
            avg: parseFloat(marginResult.avg_margin) || 0,
          },
        }),
      };
    }

    // POST /margin-rules/:id/apply - Apply rule to products
    if (method === 'POST' && path.match(/^\/[^/]+\/apply$/)) {
      const ruleId = path.split('/')[1];

      const [rule] = await sql`SELECT * FROM margin_rules WHERE id = ${ruleId}`;
      if (!rule) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Rule not found' }),
        };
      }

      // Build update query based on rule type
      let whereClause = '';
      const params = [rule.margin_percentage, ruleId];

      switch (rule.rule_type) {
        case 'product_override':
          whereClause = `WHERE sku_code = $3`;
          params.push(rule.sku_code);
          break;
        case 'product_type_category':
          whereClause = `WHERE product_type = $3 AND categorisation = $4`;
          params.push(rule.product_type, rule.category);
          break;
        case 'product_type':
          whereClause = `WHERE product_type = $3`;
          params.push(rule.product_type);
          break;
        case 'brand':
          whereClause = `WHERE brand = $3`;
          params.push(rule.brand);
          break;
        case 'category':
          whereClause = `WHERE categorisation = $3`;
          params.push(rule.category);
          break;
        case 'default':
          whereClause = `WHERE applied_rule_id IS NULL OR applied_rule_id = $3`;
          params.push(ruleId);
          break;
      }

      // Store previous state for rollback
      const previousState = await sql.query(
        `SELECT id, margin_percentage, applied_rule_id FROM product_data ${whereClause}`,
        params.slice(2)
      );

      // Apply the rule
      const updateQuery = `
        UPDATE product_data
        SET
          margin_percentage = $1,
          applied_rule_id = $2,
          calculated_price = single_price * (1 + $1 / 100),
          final_price = CASE
            WHEN is_special_offer THEN single_price * (1 + $1 / 100) * (1 - COALESCE(offer_discount_percentage, 0) / 100)
            ELSE single_price * (1 + $1 / 100)
          END,
          updated_at = NOW()
        ${whereClause}
      `;

      const result = await sql.query(updateQuery, params);

      // Log the bulk update
      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, affected_product_count, performed_by, rollback_data)
        VALUES ('bulk_apply', ${ruleId}, ${JSON.stringify(rule)}, ${result.rowCount}, ${user.userId}, ${JSON.stringify(previousState)})
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          affectedCount: result.rowCount,
        }),
      };
    }

    // PUT /margin-rules/:id - Update rule
    if (method === 'PUT' && path.match(/^\/[^/]+$/)) {
      const ruleId = path.slice(1);
      const body = JSON.parse(event.body);
      const { name, marginPercentage, isActive } = body;

      const [rule] = await sql`
        UPDATE margin_rules
        SET name = ${name}, margin_percentage = ${marginPercentage}, is_active = ${isActive}, updated_at = NOW()
        WHERE id = ${ruleId}
        RETURNING *
      `;

      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, performed_by)
        VALUES ('rule_updated', ${ruleId}, ${JSON.stringify(rule)}, ${user.userId})
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ rule }),
      };
    }

    // DELETE /margin-rules/:id - Delete rule
    if (method === 'DELETE' && path.match(/^\/[^/]+$/)) {
      const ruleId = path.slice(1);

      const [rule] = await sql`SELECT * FROM margin_rules WHERE id = ${ruleId}`;

      await sql`DELETE FROM margin_rules WHERE id = ${ruleId}`;

      await sql`
        INSERT INTO margin_audit_log (action, rule_id, rule_snapshot, performed_by)
        VALUES ('rule_deleted', ${ruleId}, ${JSON.stringify(rule)}, ${user.userId})
      `;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };

  } catch (error) {
    console.error('Margin rules error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
```

### 2.2 Products Admin API

**File:** `netlify/functions/products-admin.js`

```javascript
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Content-Type': 'application/json',
};

function verifyAuth(event) {
  const authHeader = event.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const user = verifyAuth(event);
  if (!user) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const path = event.path.replace('/.netlify/functions/products-admin', '');
  const method = event.httpMethod;
  const params = event.queryStringParameters || {};

  try {
    // GET /products-admin/brands - Get brands with aggregated stats
    if (method === 'GET' && path === '/brands') {
      const brands = await sql`
        SELECT
          brand,
          COUNT(*) as product_count,
          COUNT(DISTINCT style_code) as style_count,
          COUNT(DISTINCT product_type) as type_count,
          ROUND(AVG(margin_percentage), 2) as avg_margin,
          ROUND(AVG(final_price), 2) as avg_price
        FROM product_data
        WHERE brand IS NOT NULL AND brand != ''
          AND sku_status != 'Discontinued'
        GROUP BY brand
        ORDER BY brand ASC
      `;
      return { statusCode: 200, headers, body: JSON.stringify({ brands }) };
    }

    // GET /products-admin/product-types - Get product types with stats
    if (method === 'GET' && path === '/product-types') {
      const { brand } = params;

      let query;
      if (brand) {
        query = sql`
          SELECT
            product_type,
            COUNT(*) as product_count,
            COUNT(DISTINCT style_code) as style_count,
            COUNT(DISTINCT brand) as brand_count,
            ROUND(AVG(margin_percentage), 2) as avg_margin,
            ROUND(AVG(final_price), 2) as avg_price
          FROM product_data
          WHERE product_type IS NOT NULL AND product_type != ''
            AND sku_status != 'Discontinued'
            AND brand = ${brand}
          GROUP BY product_type
          ORDER BY product_type ASC
        `;
      } else {
        query = sql`
          SELECT
            product_type,
            COUNT(*) as product_count,
            COUNT(DISTINCT style_code) as style_count,
            COUNT(DISTINCT brand) as brand_count,
            ROUND(AVG(margin_percentage), 2) as avg_margin,
            ROUND(AVG(final_price), 2) as avg_price
          FROM product_data
          WHERE product_type IS NOT NULL AND product_type != ''
            AND sku_status != 'Discontinued'
          GROUP BY product_type
          ORDER BY product_type ASC
        `;
      }

      const productTypes = await query;
      return { statusCode: 200, headers, body: JSON.stringify({ productTypes }) };
    }

    // GET /products-admin/styles - Get styles with stats
    if (method === 'GET' && path === '/styles') {
      const { brand, productType, cursor, limit = 50 } = params;

      let whereClause = "WHERE style_code IS NOT NULL AND sku_status != 'Discontinued'";
      const queryParams = [];
      let paramIndex = 1;

      if (brand) {
        whereClause += ` AND brand = $${paramIndex++}`;
        queryParams.push(brand);
      }
      if (productType) {
        whereClause += ` AND product_type = $${paramIndex++}`;
        queryParams.push(productType);
      }
      if (cursor) {
        whereClause += ` AND style_code > $${paramIndex++}`;
        queryParams.push(cursor);
      }

      const stylesQuery = `
        SELECT
          style_code,
          MIN(style_name) as style_name,
          MIN(brand) as brand,
          MIN(product_type) as product_type,
          COUNT(*) as variant_count,
          COUNT(DISTINCT colour_code) as colour_count,
          COUNT(DISTINCT size_code) as size_count,
          ROUND(AVG(margin_percentage), 2) as avg_margin,
          MIN(final_price) as min_price,
          MAX(final_price) as max_price
        FROM product_data
        ${whereClause}
        GROUP BY style_code
        ORDER BY style_code ASC
        LIMIT $${paramIndex}
      `;
      queryParams.push(parseInt(limit));

      const styles = await sql.query(stylesQuery, queryParams);

      const nextCursor = styles.length === parseInt(limit)
        ? styles[styles.length - 1].style_code
        : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ styles, nextCursor }),
      };
    }

    // GET /products-admin/variants/:styleCode - Get variants for a style
    if (method === 'GET' && path.match(/^\/variants\/[^/]+$/)) {
      const styleCode = decodeURIComponent(path.split('/')[2]);

      const variants = await sql`
        SELECT
          id, sku_code, style_name, brand, product_type,
          colour_code, colour_name, size_code, size_name,
          single_price, margin_percentage, calculated_price, final_price,
          applied_rule_id, is_special_offer, offer_discount_percentage,
          sku_status
        FROM product_data
        WHERE style_code = ${styleCode}
        ORDER BY colour_code, size_code
      `;

      return { statusCode: 200, headers, body: JSON.stringify({ variants }) };
    }

    // GET /products-admin/all - Get all products (paginated)
    if (method === 'GET' && path === '/all') {
      const { brand, productType, category, search, cursor, limit = 50 } = params;

      let whereClause = "WHERE sku_status != 'Discontinued'";
      const queryParams = [];
      let paramIndex = 1;

      if (brand) {
        whereClause += ` AND brand = $${paramIndex++}`;
        queryParams.push(brand);
      }
      if (productType) {
        whereClause += ` AND product_type = $${paramIndex++}`;
        queryParams.push(productType);
      }
      if (category) {
        whereClause += ` AND categorisation = $${paramIndex++}`;
        queryParams.push(category);
      }
      if (search) {
        whereClause += ` AND (sku_code ILIKE $${paramIndex} OR style_name ILIKE $${paramIndex} OR brand ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }
      if (cursor) {
        whereClause += ` AND sku_code > $${paramIndex++}`;
        queryParams.push(cursor);
      }

      const productsQuery = `
        SELECT
          id, sku_code, style_code, style_name, brand, product_type,
          colour_code, colour_name, size_code, size_name,
          single_price, margin_percentage, calculated_price, final_price,
          applied_rule_id, is_special_offer, offer_discount_percentage,
          sku_status, categorisation
        FROM product_data
        ${whereClause}
        ORDER BY sku_code ASC
        LIMIT $${paramIndex}
      `;
      queryParams.push(parseInt(limit));

      const products = await sql.query(productsQuery, queryParams);

      const nextCursor = products.length === parseInt(limit)
        ? products[products.length - 1].sku_code
        : null;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ products, nextCursor }),
      };
    }

    // GET /products-admin/filter-options - Get unique filter values
    if (method === 'GET' && path === '/filter-options') {
      const [brands, productTypes, categories] = await Promise.all([
        sql`SELECT DISTINCT brand FROM product_data WHERE brand IS NOT NULL AND brand != '' ORDER BY brand`,
        sql`SELECT DISTINCT product_type FROM product_data WHERE product_type IS NOT NULL AND product_type != '' ORDER BY product_type`,
        sql`SELECT DISTINCT categorisation FROM product_data WHERE categorisation IS NOT NULL AND categorisation != '' ORDER BY categorisation`,
      ]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          brands: brands.map(b => b.brand),
          productTypes: productTypes.map(p => p.product_type),
          categories: categories.map(c => c.categorisation),
        }),
      };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

  } catch (error) {
    console.error('Products admin error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
}
```

---

## Phase 3: Frontend Components

### 3.1 File Structure

```
src/
├── pages/admin/
│   └── ProductManager.tsx              # Main page
│
├── components/admin/products/
│   ├── index.ts                        # Exports
│   │
│   ├── ProductManager/
│   │   ├── ProductManagerLayout.tsx    # Split panel layout
│   │   ├── ViewSwitcher.tsx            # [By Brand][By Type][By Style][All]
│   │   ├── Breadcrumbs.tsx             # Navigation path
│   │   └── DrillDownContext.tsx        # State management
│   │
│   ├── RulesPanel/
│   │   ├── RulesPanel.tsx              # Left panel container
│   │   ├── RuleCard.tsx                # Individual rule display
│   │   ├── RuleCreateModal.tsx         # Create/edit modal
│   │   ├── RulePreviewStats.tsx        # Impact preview
│   │   └── FilterSection.tsx           # Context-aware filters
│   │
│   ├── ProductsPanel/
│   │   ├── ProductsPanel.tsx           # Right panel container
│   │   ├── SearchBar.tsx               # Product search
│   │   └── BulkActionsBar.tsx          # Bottom sticky actions
│   │
│   ├── views/
│   │   ├── BrandsView.tsx              # Brand list table
│   │   ├── ProductTypesView.tsx        # Product types table
│   │   ├── StylesView.tsx              # Styles table
│   │   ├── VariantsView.tsx            # SKU variants table
│   │   └── AllProductsView.tsx         # Flat product list
│   │
│   ├── tables/
│   │   ├── DataTable.tsx               # Reusable TanStack table wrapper
│   │   ├── columns/
│   │   │   ├── brandsColumns.tsx
│   │   │   ├── productTypesColumns.tsx
│   │   │   ├── stylesColumns.tsx
│   │   │   ├── variantsColumns.tsx
│   │   │   └── allProductsColumns.tsx
│   │   └── TablePagination.tsx         # Cursor pagination
│   │
│   ├── modals/
│   │   ├── ApplyRuleModal.tsx          # Confirm rule application
│   │   ├── SpecialOfferModal.tsx       # Create special offer
│   │   └── ProgressModal.tsx           # Bulk operation progress
│   │
│   └── shared/
│       ├── MarginBadge.tsx             # Shows margin % with source
│       ├── PriceDisplay.tsx            # Cost → Margin → Final
│       ├── SpecialOfferBadge.tsx       # Offer indicator
│       └── AdminColors.ts              # Theme constants
│
├── hooks/
│   ├── useMarginRules.ts               # Rules CRUD
│   ├── useProductsAdmin.ts             # Product queries
│   └── useDrillDown.ts                 # Navigation state
│
└── lib/
    ├── api.ts                          # Add admin endpoints
    └── margin-calculator.ts            # Price calculations
```

### 3.2 Admin Color Constants

**File:** `src/components/admin/products/shared/AdminColors.ts`

```typescript
export const adminColors = {
  // Backgrounds
  bgDark: '#1a1625',
  bgCard: '#2a2440',
  bgCardHover: '#3d3456',
  bgInput: '#1e1a2e',

  // Purple accents
  purple50: 'rgba(139, 92, 246, 0.05)',
  purple100: 'rgba(139, 92, 246, 0.1)',
  purple200: 'rgba(139, 92, 246, 0.15)',
  purple300: 'rgba(139, 92, 246, 0.2)',
  purple400: '#a78bfa',
  purple500: '#8b5cf6',
  purple600: '#7c3aed',
  purple700: '#6d28d9',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#9ca3af',
  textDim: '#6b7280',

  // Borders
  borderLight: 'rgba(139, 92, 246, 0.1)',
  borderMedium: 'rgba(139, 92, 246, 0.2)',
  borderFocus: 'rgba(139, 92, 246, 0.5)',
};

// Tailwind class helpers
export const adminTw = {
  // Cards
  card: 'bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10',
  cardHover: 'hover:border-purple-500/30 transition-all',

  // Inputs
  input: 'bg-[#1e1a2e] border border-purple-500/20 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50',

  // Buttons
  btnPrimary: 'bg-purple-600 text-white hover:bg-purple-700 transition-colors',
  btnSecondary: 'bg-[#2a2440] border border-purple-500/20 text-gray-300 hover:bg-[#3d3456] transition-colors',
  btnGhost: 'text-gray-400 hover:text-white hover:bg-purple-500/20 transition-colors',

  // Tables
  tableHeader: 'bg-[#1e1a2e]/50 border-b border-purple-500/10',
  tableRow: 'hover:bg-purple-500/5 border-b border-purple-500/10 transition-colors',
  tableRowSelected: 'bg-purple-500/10 border-purple-500/20',
};
```

### 3.3 Main ProductManager Page

**File:** `src/pages/admin/ProductManager.tsx`

```tsx
import React, { useState } from 'react';
import { ProductManagerLayout } from '../../components/admin/products/ProductManager/ProductManagerLayout';
import { DrillDownProvider } from '../../components/admin/products/ProductManager/DrillDownContext';

export type ViewMode = 'brands' | 'product-types' | 'styles' | 'all';

const ProductManager: React.FC = () => {
  return (
    <DrillDownProvider>
      <div className="min-h-screen bg-[#1a1625] p-6">
        <ProductManagerLayout />
      </div>
    </DrillDownProvider>
  );
};

export default ProductManager;
```

### 3.4 DrillDown Context

**File:** `src/components/admin/products/ProductManager/DrillDownContext.tsx`

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

export type ViewMode = 'brands' | 'product-types' | 'styles' | 'all';

interface DrillDownState {
  viewMode: ViewMode;
  path: { type: string; value: string; label: string }[];
  filters: {
    brand?: string;
    productType?: string;
    category?: string;
    search?: string;
  };
}

interface DrillDownContextType {
  state: DrillDownState;
  setViewMode: (mode: ViewMode) => void;
  drillDown: (type: string, value: string, label: string) => void;
  navigateTo: (index: number) => void;
  setFilter: (key: string, value: string | undefined) => void;
  clearFilters: () => void;
  reset: () => void;
}

const DrillDownContext = createContext<DrillDownContextType | null>(null);

export const DrillDownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DrillDownState>({
    viewMode: 'brands',
    path: [],
    filters: {},
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => ({
      ...prev,
      viewMode: mode,
      path: [],
      filters: {},
    }));
  }, []);

  const drillDown = useCallback((type: string, value: string, label: string) => {
    setState(prev => ({
      ...prev,
      path: [...prev.path, { type, value, label }],
      filters: {
        ...prev.filters,
        [type]: value,
      },
    }));
  }, []);

  const navigateTo = useCallback((index: number) => {
    setState(prev => {
      const newPath = prev.path.slice(0, index + 1);
      const newFilters: Record<string, string> = {};
      newPath.forEach(p => {
        newFilters[p.type] = p.value;
      });
      return {
        ...prev,
        path: newPath,
        filters: newFilters,
      };
    });
  }, []);

  const setFilter = useCallback((key: string, value: string | undefined) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {},
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      viewMode: 'brands',
      path: [],
      filters: {},
    });
  }, []);

  return (
    <DrillDownContext.Provider
      value={{ state, setViewMode, drillDown, navigateTo, setFilter, clearFilters, reset }}
    >
      {children}
    </DrillDownContext.Provider>
  );
};

export const useDrillDown = () => {
  const context = useContext(DrillDownContext);
  if (!context) {
    throw new Error('useDrillDown must be used within DrillDownProvider');
  }
  return context;
};
```

### 3.5 ViewSwitcher Component

**File:** `src/components/admin/products/ProductManager/ViewSwitcher.tsx`

```tsx
import React from 'react';
import { Building2, Layers, Grid3X3, List } from 'lucide-react';
import { useDrillDown, ViewMode } from './DrillDownContext';
import { cn } from '@/lib/utils';

const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'brands', label: 'By Brand', icon: <Building2 className="w-4 h-4" /> },
  { id: 'product-types', label: 'By Type', icon: <Layers className="w-4 h-4" /> },
  { id: 'styles', label: 'By Style', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'all', label: 'All Products', icon: <List className="w-4 h-4" /> },
];

export const ViewSwitcher: React.FC = () => {
  const { state, setViewMode } = useDrillDown();

  return (
    <div className="flex items-center border border-purple-500/20 rounded-lg overflow-hidden">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => setViewMode(view.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            state.viewMode === view.id
              ? 'bg-purple-600 text-white'
              : 'bg-[#1e1a2e] text-gray-400 hover:bg-[#2a2440] hover:text-gray-200'
          )}
        >
          {view.icon}
          {view.label}
        </button>
      ))}
    </div>
  );
};
```

### 3.6 RuleCard Component

**File:** `src/components/admin/products/RulesPanel/RuleCard.tsx`

```tsx
import React from 'react';
import {
  Target, Layers, Building2, Grid3X3, Package, MoreVertical,
  Pencil, Trash2, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MarginRule {
  id: string;
  name: string;
  ruleType: string;
  marginPercentage: number;
  productType?: string;
  category?: string;
  brand?: string;
  isActive: boolean;
}

interface RuleCardProps {
  rule: MarginRule;
  onEdit: (rule: MarginRule) => void;
  onDelete: (rule: MarginRule) => void;
  onApply: (rule: MarginRule) => void;
}

const ruleTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  default: { icon: <Target className="w-4 h-4" />, color: '#a78bfa', label: 'Default' },
  category: { icon: <Layers className="w-4 h-4" />, color: '#c084fc', label: 'Category' },
  brand: { icon: <Building2 className="w-4 h-4" />, color: '#f59e0b', label: 'Brand' },
  product_type: { icon: <Grid3X3 className="w-4 h-4" />, color: '#8b5cf6', label: 'Product Type' },
  product_type_category: { icon: <Package className="w-4 h-4" />, color: '#7c3aed', label: 'Type + Category' },
  product_override: { icon: <Package className="w-4 h-4" />, color: '#ef4444', label: 'Product Override' },
};

export const RuleCard: React.FC<RuleCardProps> = ({ rule, onEdit, onDelete, onApply }) => {
  const config = ruleTypeConfig[rule.ruleType] || ruleTypeConfig.default;

  return (
    <div
      className={cn(
        'bg-[#2a2440]/50 rounded-lg border border-purple-500/10 p-4 transition-all',
        rule.isActive ? 'hover:border-purple-500/30' : 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium truncate">{rule.name}</h4>
            <p className="text-gray-500 text-xs mt-0.5">{config.label}</p>
            {rule.brand && <p className="text-gray-400 text-xs mt-1">Brand: {rule.brand}</p>}
            {rule.productType && <p className="text-gray-400 text-xs">Type: {rule.productType}</p>}
            {rule.category && <p className="text-gray-400 text-xs">Category: {rule.category}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="px-2.5 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {rule.marginPercentage}%
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg hover:bg-purple-500/20 transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#2a2440] border-purple-500/20 text-gray-200"
            >
              <DropdownMenuItem
                onClick={() => onApply(rule)}
                className="hover:bg-purple-500/20 cursor-pointer"
              >
                <Play className="w-4 h-4 mr-2" />
                Apply to Products
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(rule)}
                className="hover:bg-purple-500/20 cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Rule
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(rule)}
                className="hover:bg-red-500/20 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Rule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
```

---

## Phase 4: Implementation Order

### Step 1: Database (Day 1)
1. Create migration SQL file
2. Run migration on Neon database
3. Update Prisma schema
4. Run `npx prisma generate`
5. Insert default margin rule

### Step 2: Backend APIs (Day 1-2)
1. Create `margin-rules.js` function
2. Create `products-admin.js` function
3. Test endpoints with curl/Postman
4. Add API functions to `src/lib/api.ts`

### Step 3: Core Frontend (Day 2-3)
1. Create admin color constants
2. Create DrillDownContext
3. Create ProductManager page
4. Create ViewSwitcher component
5. Create Breadcrumbs component
6. Wire up routing in App.tsx

### Step 4: Rules Panel (Day 3-4)
1. Create RulesPanel container
2. Create RuleCard component
3. Create RuleCreateModal
4. Create FilterSection
5. Connect to useMarginRules hook

### Step 5: Data Views (Day 4-5)
1. Install TanStack Table: `npm install @tanstack/react-table`
2. Create DataTable wrapper
3. Create BrandsView + columns
4. Create ProductTypesView + columns
5. Create StylesView + columns
6. Create VariantsView + columns
7. Create AllProductsView + columns

### Step 6: Bulk Actions (Day 5-6)
1. Create BulkActionsBar
2. Create ApplyRuleModal
3. Create SpecialOfferModal
4. Create ProgressModal
5. Implement selection state
6. Connect bulk operations to API

### Step 7: Polish (Day 6-7)
1. Add loading states
2. Add error handling
3. Add empty states
4. Test drill-down navigation
5. Test rule creation flow
6. Test bulk operations
7. Performance optimization

---

## Dependencies to Install

```bash
npm install @tanstack/react-table @tanstack/react-query
```

---

## Route Addition

**File:** `src/App.tsx` (add to admin routes)

```tsx
import ProductManager from './pages/admin/ProductManager';

// In the admin routes section:
<Route path="products" element={<ProductManager />} />
```

---

## Notes

1. **Purple Theme Consistency**: All components use the admin purple color scheme from `AdminColors.ts`
2. **No White/Green**: Backgrounds are dark purples, text is gray/white, accents are purple
3. **TanStack Table**: Provides server-side pagination, sorting, and row selection
4. **Cursor Pagination**: Better performance than offset for 100k products
5. **Drill-Down Navigation**: Row click drills down, checkbox selects for bulk
6. **Rule Hierarchy**: Explicit priority 1-6, most specific wins

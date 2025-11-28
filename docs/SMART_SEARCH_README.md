# Smart Search Implementation

## Overview

The Smart Search feature uses AI to help customers find products by describing what they need in natural language. Instead of sending all product data to OpenAI (which would be slow and expensive), we use a **pre-generated product summary** that's optimized for AI search.

## How It Works

### 1. Product Summary Generation

```bash
npm run generate-product-summary
```

This script:
- Fetches all products from Supabase
- Groups variants by style_code (reducing 1000+ variants to ~121 unique products)
- Extracts only essential searchable fields:
  - Product name, brand, type
  - Price range
  - Key features (brushed fabric, moisture wicking, etc.)
  - Materials (Cotton, Polyester, Recycled, etc.)
  - Categories (Workwear, Corporate, Sports, etc.)
  - Sustainable flag
- Creates a 127KB JSON file instead of sending 60+ fields per product

**File Location:** `public/product-summary.json`

### 2. Smart Search Flow

1. User enters query: *"I need branded polo shirts for a team of 20 office workers"*
2. Frontend sends query to Netlify function
3. Function loads product summary (cached in memory)
4. Creates compact context with ~20-30 sample products
5. Sends to OpenAI with actual product data
6. OpenAI returns filters based on **real products** you have in stock
7. Filters are validated against actual inventory
8. Results returned to frontend

## Benefits

### Before (Old System)
- ❌ OpenAI had no knowledge of actual products
- ❌ Just guessed filter categories
- ❌ Could suggest products you don't have
- ❌ Slow and inefficient

### After (New System)
- ✅ OpenAI sees your actual product catalog
- ✅ Suggests only products you have in stock
- ✅ Much faster (127KB vs sending all data)
- ✅ More accurate results
- ✅ Can mention specific matching products

## Usage

### Generating Product Summary

Run this whenever your product catalog changes:

```bash
npm run generate-product-summary
```

**When to regenerate:**
- After adding new products to Supabase
- After updating product descriptions
- After changing prices or brands
- Recommended: Weekly or when deploying updates

### Netlify Deployment

The product summary file (`public/product-summary.json`) needs to be deployed with your Netlify site:

1. **Automatic:** The file is in the `public/` folder, so it deploys automatically
2. **Manual:** Run `npm run generate-product-summary` before deploying
3. **CI/CD:** Add to your build script:

```json
{
  "scripts": {
    "build": "npm run generate-product-summary && react-scripts build"
  }
}
```

### Environment Variables

Make sure these are set in Netlify:

```
OPENAI_API_KEY=sk-proj-...
AI_MODEL=gpt-3.5-turbo
AI_TEMPERATURE=0.2
SMART_SEARCH_MODE=ai
```

## Example Queries

The new system handles these intelligently:

```
"Corporate gifts for clients"
→ Returns: Polos, T-Shirts, Bags (products suitable for corporate gifting)

"High-vis safety gear for construction workers"
→ Returns: Safety Vests, Jackets (actual safety products in stock)

"Sustainable workwear with company logo"
→ Returns: Only products marked as sustainable

"Warm winter jackets for outdoor staff"
→ Returns: Jackets, Fleece (with "warm" features)

"Promotional tote bags for trade show under £10"
→ Returns: Bags with priceMax: 10
```

## Fallback Mode

If OpenAI API is unavailable or product summary is missing, the system automatically falls back to keyword-based filter generation (no AI needed).

## Monitoring

Check Netlify function logs to see:
```
[smart-search] Product summary loaded from /var/task/public/product-summary.json
[smart-search] 121 products, 1000 variants
[smart-search] Processing query: I need polo shirts for my team
[smart-search] OpenAI response: {"filters": {...}, "explanation": "..."}
```

## File Structure

```
outpost-custom/
├── public/
│   └── product-summary.json          # Generated product summary (127KB)
├── scripts/
│   └── generate-product-summary.js   # Generator script
├── netlify/
│   └── functions/
│       └── smart-search.js           # AI-powered search function
└── src/
    └── components/
        └── SmartSearchModal.tsx      # Search UI component
```

## Performance

- **Old system:** ~2-3 seconds per search, could timeout
- **New system:** ~1 second per search, reliable
- **Product summary:** Loads once, cached in memory
- **Token usage:** Reduced by ~70% (only send 20-30 products instead of full catalog)

## Troubleshooting

### "Product summary not found"
- Run `npm run generate-product-summary`
- Check that `public/product-summary.json` exists
- Ensure file is deployed to Netlify

### "Using fallback filters"
- Check OpenAI API key is set in Netlify environment variables
- Check Netlify function logs for errors
- Verify product summary file is accessible

### Search returns no results
- Check the filter validation in function logs
- Product summary might need regeneration
- Try a more generic query

## Future Improvements

- [ ] Add caching layer to reduce OpenAI calls
- [ ] Generate product embeddings for semantic search
- [ ] Add search analytics to improve results
- [ ] Support for vector similarity search
- [ ] Automatic summary regeneration on product updates

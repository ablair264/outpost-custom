# Smart Search Implementation

## Overview

The Smart Search feature uses AI to help customers find products by describing what they need in natural language. The Netlify function now grounds the LLM with **live Supabase metadata** (product_types table, brand/price ranges, sampled products) and then runs a Supabase query to return concrete suggestions alongside filters. A pre-generated product-summary JSON is still supported as a fallback if Supabase is unreachable.

## How It Works

1. User enters a query in the Smart Search modal.
2. Netlify function loads reference data:
   - Product types from `product_types` table (authoritative list)
   - Price min/max and a sample of brands
   - 60 sampled products for grounding
3. OpenAI is prompted with the reference data and returns structured filters (product types, price bands, sustainability, etc.).
4. Filters are validated against the real catalog.
5. Supabase is queried for matching products; results are grouped by `style_code` and returned to the UI together with the filters.
6. If OpenAI or Supabase fails, a heuristic fallback generates filters from keywords.

## Product Summary (Optional Fallback)

`npm run generate-product-summary`

This script still generates `public/product-summary.json`. The file is **only used as a fallback** when Supabase metadata cannot be read (e.g., offline dev). You do not need it for production as long as Supabase is reachable.

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

### Environment Variables

Make sure these are set in Netlify:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...   # preferred for server-side filtering
SUPABASE_ANON_KEY=...           # fallback for local dev
OPENAI_API_KEY=sk-proj-...
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.2
SMART_SEARCH_MODE=ai
SMART_SEARCH_CACHE_MS=900000    # optional cache TTL for reference metadata
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

If OpenAI API is unavailable or Supabase metadata cannot be loaded, the function falls back to keyword-based filters (still validated against whatever metadata is available). If both Supabase and metadata are missing, it returns minimal filters and an empty result list.

## Monitoring

Check Netlify function logs to see:
```
[smart-search] Loaded fallback summary from /var/task/public/product-summary.json
[smart-search] Processing query: I need polo shirts for my team
```

## File Structure

```
outpost-custom/
├── public/
│   └── product-summary.json          # Optional fallback summary
├── scripts/
│   └── generate-product-summary.js   # Fallback generator
├── netlify/
│   └── functions/
│       └── smart-search.js           # AI-powered search function (Supabase + OpenAI)
└── src/
    └── components/
        └── SmartSearchModal.tsx      # Search UI component
```

## Troubleshooting

### "Using fallback filters"
- Ensure Supabase env vars are set and reachable from Netlify/Railway
- Confirm `OPENAI_API_KEY` is configured
- Check Netlify function logs for Supabase/OpenAI errors

### Search returns no results
- Try a broader query
- Confirm `product_types` table is populated
- Verify price ranges on the catalog (extreme price filters will be clamped)

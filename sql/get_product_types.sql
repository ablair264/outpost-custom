-- Get unique product types with product counts
-- This query returns distinct product_type values along with how many unique products (grouped by style_code) exist in each category

SELECT
  product_type,
  COUNT(DISTINCT style_code) as product_count,
  COUNT(*) as total_variants
FROM product_data
WHERE product_type IS NOT NULL
GROUP BY product_type
ORDER BY product_count DESC;

-- Alternative: Simple distinct product types only
-- SELECT DISTINCT product_type
-- FROM product_data
-- WHERE product_type IS NOT NULL
-- ORDER BY product_type;

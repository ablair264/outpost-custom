import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProductsByCategory, getCategoriesWithCounts } from '../lib/supabase';
import { Product, CategoryData } from '../lib/supabase';
import './ProductListing.css';

interface ProductGroup {
  style_code: string;
  style_name: string;
  brand: string;
  variants: Product[];
  colors: Array<{
    code: string;
    name: string;
    rgb: string;
    image: string;
  }>;
  size_range: string;
}

interface ProductCardProps {
  productGroup: ProductGroup;
}

const formatSizeRange = (sizeRange: string): string => {
  if (!sizeRange) return '';
  
  // Convert "Sto3XL" to "S to 3XL"
  return sizeRange
    .replace(/to/gi, ' to ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1$2')
    .trim();
};

const ProductCard: React.FC<ProductCardProps> = ({ productGroup }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  
  const currentVariant = productGroup.variants.find(v => 
    v.colour_code === productGroup.colors[selectedColor]?.code
  ) || productGroup.variants[0];
  
  const currentImage = productGroup.colors[selectedColor]?.image || 
    currentVariant?.colour_image || 
    currentVariant?.primary_product_image_url;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={currentImage !== 'Not available' 
            ? currentImage 
            : 'https://via.placeholder.com/400x400/1a1a1a/78BE20?text=' + encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P')
          }
          alt={productGroup.style_name}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400/1a1a1a/78BE20?text=' + encodeURIComponent(productGroup.style_name?.slice(0, 2) || 'P');
          }}
        />
        <div className="product-overlay">
          <img src="/images/green-arrow.png" alt="View product" className="product-arrow-icon" />
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{productGroup.style_name}</h3>
        <p className="product-brand">{productGroup.brand}</p>
        
        {/* Color Swatches */}
        <div className="color-swatches">
          {productGroup.colors.map((color, index) => (
            <button
              key={color.code}
              className={`color-swatch ${selectedColor === index ? 'active' : ''}`}
              style={{ backgroundColor: color.rgb }}
              onClick={() => setSelectedColor(index)}
              title={color.name}
            />
          ))}
        </div>
        
        <div className="product-details">
          <span className="product-sku">SKU: {currentVariant?.sku_code}</span>
          <span className="product-sizes">{formatSizeRange(productGroup.size_range)}</span>
        </div>
      </div>
    </div>
  );
};

const ProductListing: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const productsPerPage = 12; // Reduced since we're showing grouped products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get category info first
        const categories = await getCategoriesWithCounts();
        const currentCategory = categories.find(cat => 
          cat.id === categoryId || 
          cat.category_key === categoryParam ||
          cat.category_key.toLowerCase().replace(/\s+/g, '-') === categoryId
        );
        
        if (currentCategory) {
          setCategory(currentCategory);
          
          // Fetch products for this category
          const categoryKey = currentCategory.category_key;
          const productData = await getProductsByCategory(categoryKey);
          
          // Group products by style_code
          const groupedProducts = productData.reduce((groups: Record<string, Product[]>, product) => {
            const styleCode = product.style_code || 'unknown';
            if (!groups[styleCode]) {
              groups[styleCode] = [];
            }
            groups[styleCode].push(product);
            return groups;
          }, {});
          
          // Convert to ProductGroup format
          const productGroups: ProductGroup[] = Object.entries(groupedProducts).map(([styleCode, variants]) => {
            const firstVariant = variants[0];
            
            // Get unique colors for this style
            const uniqueColors = variants.reduce((colors: Array<{code: string, name: string, rgb: string, image: string}>, variant) => {
              const existingColor = colors.find(c => c.code === variant.colour_code);
              if (!existingColor && variant.colour_code) {
                // Parse RGB values - they can be in format "244 244 244|13 50 19" for multi-color items
                let rgbValue = '#cccccc'; // default fallback
                
                if (variant.rgb) {
                  // Split by | and take the first color for the swatch
                  const rgbParts = variant.rgb.split('|')[0].trim();
                  const rgbNumbers = rgbParts.match(/\d+/g);
                  
                  if (rgbNumbers && rgbNumbers.length >= 3) {
                    const r = parseInt(rgbNumbers[0]);
                    const g = parseInt(rgbNumbers[1]);
                    const b = parseInt(rgbNumbers[2]);
                    rgbValue = `rgb(${r}, ${g}, ${b})`;
                  }
                }
                
                colors.push({
                  code: variant.colour_code,
                  name: variant.colour_name || variant.colour_code,
                  rgb: rgbValue,
                  image: variant.colour_image || variant.primary_product_image_url
                });
              }
              return colors;
            }, []);
            
            return {
              style_code: styleCode,
              style_name: firstVariant.style_name,
              brand: firstVariant.brand,
              variants,
              colors: uniqueColors,
              size_range: firstVariant.size_range || ''
            };
          });
          
          // Calculate pagination
          const total = Math.ceil(productGroups.length / productsPerPage);
          setTotalPages(total);
          
          // Get product groups for current page
          const startIndex = (page - 1) * productsPerPage;
          const endIndex = startIndex + productsPerPage;
          const paginatedGroups = productGroups.slice(startIndex, endIndex);
          
          setProductGroups(paginatedGroups);
        } else {
          console.error('Category not found:', categoryId || categoryParam);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId || categoryParam) {
      fetchProducts();
    }
  }, [categoryId, categoryParam, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="product-listing-page">
        <div className="container">
          <div className="loading-message">Loading products...</div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="product-listing-page">
        <div className="container">
          <div className="error-message">Category not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-listing-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="breadcrumb">
            <a href="/categories">Categories</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{category.display_name}</span>
          </div>
          <h1 className="page-title">{category.display_name}</h1>
          <p className="page-subtitle">{category.product_count} products available</p>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {productGroups.map((productGroup) => (
            <ProductCard key={productGroup.style_code} productGroup={productGroup} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-number ${page === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}

        {productGroups.length === 0 && !loading && (
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing;
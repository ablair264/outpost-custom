import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupedProductsByType, GroupedProduct } from '../lib/supabase';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

const Collection = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');

  const productType = type ? decodeURIComponent(type) : '';

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productType) return;

      try {
        setLoading(true);
        const data = await getGroupedProductsByType(productType);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productType]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.style_name.localeCompare(b.style_name);
      case 'price-low':
        return a.price_range.min - b.price_range.min;
      case 'price-high':
        return b.price_range.max - a.price_range.max;
      default:
        return 0;
    }
  });

  const handleProductClick = (styleCode: string) => {
    navigate(`/products/${styleCode}`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Header Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#000000' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/collections')}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Collections</span>
          </button>

          {/* Title */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3" style={{ background: '#6da71d', color: '#ffffff' }}>
              Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {productType}
            </h1>
            <p className="text-gray-300 text-lg">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="py-6 px-4 md:px-8 lg:px-16 xl:px-24 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 font-medium">Sort by:</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortBy === 'name'
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={sortBy === 'name' ? { background: '#6da71d' } : {}}
            >
              Name
            </button>
            <button
              onClick={() => setSortBy('price-low')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortBy === 'price-low'
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={sortBy === 'price-low' ? { background: '#6da71d' } : {}}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => setSortBy('price-high')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortBy === 'price-high'
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={sortBy === 'price-high' ? { background: '#6da71d' } : {}}
            >
              Price: High to Low
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-96 rounded-2xl animate-pulse"
                  style={{ background: '#f5f5f5' }}
                />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div
                  key={product.style_code}
                  onClick={() => handleProductClick(product.style_code)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  style={{ background: '#f5f5f5' }}
                >
                  {/* Product Image */}
                  <div
                    className="h-72 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${product.primary_product_image_url})`,
                    }}
                  />

                  {/* Product Info */}
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {product.brand}
                    </span>
                    <h3 className="text-lg font-bold mt-1 mb-2 line-clamp-2" style={{ color: '#000000' }}>
                      {product.style_name}
                    </h3>

                    {/* Colors & Sizes */}
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                      <span>{product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colors'}</span>
                      <span>•</span>
                      <span>{product.sizes.length} {product.sizes.length === 1 ? 'Size' : 'Sizes'}</span>
                    </div>

                    {/* Price */}
                    <div className="font-bold text-xl" style={{ color: '#6da71d' }}>
                      {product.price_range.min === product.price_range.max
                        ? `£${product.price_range.min.toFixed(2)}`
                        : `£${product.price_range.min.toFixed(2)} - £${product.price_range.max.toFixed(2)}`}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                    style={{ background: '#6da71d' }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">This collection is currently empty</p>
              <Button
                onClick={() => navigate('/collections')}
                className="rounded-full px-8"
                style={{ background: '#6da71d' }}
              >
                Browse Other Collections
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collection;

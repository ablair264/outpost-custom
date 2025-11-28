import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductTypes, ProductType } from '../lib/supabase';
import { ArrowRight, Package } from 'lucide-react';

const Collections = () => {
  const [collections, setCollections] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const types = await getProductTypes();
        setCollections(types);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCollectionClick = (productType: string) => {
    // URL-encode the product type for safe navigation
    const encodedType = encodeURIComponent(productType);
    navigate(`/collections/${encodedType}`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Header Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#000000' }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: '#6da71d', color: '#ffffff' }}>
            Product Collections
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Browse by Category
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore our wide range of customizable garments organized by type
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="max-w-[1200px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-2xl animate-pulse"
                  style={{ background: '#f5f5f5' }}
                />
              ))}
            </div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <div
                  key={collection.product_type}
                  onClick={() => handleCollectionClick(collection.product_type)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  {/* Content */}
                  <div className="p-8 h-64 flex flex-col justify-between">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: '#6da71d' }}>
                      <Package className="w-8 h-8 text-white" />
                    </div>

                    {/* Text Content */}
                    <div>
                      <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
                        {collection.product_type}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {collection.product_count} {collection.product_count === 1 ? 'Product' : 'Products'} • {collection.total_variants} Variants
                      </p>

                      {/* Arrow */}
                      <div className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3" style={{ color: '#6da71d' }}>
                        <span>Browse Collection</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
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
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Collections Found</h3>
              <p className="text-gray-500">Check back later for new product collections</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Collections;

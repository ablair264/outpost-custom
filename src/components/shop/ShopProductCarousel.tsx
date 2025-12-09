import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShopProductCard from './ShopProductCard';
import { getGroupedProductsForCarousel, GroupedProduct } from '../../lib/supabase';
import { Button } from '../ui/button';

const ShopProductCarousel = () => {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch and group products by style_code and colour_code
        const groupedProducts = await getGroupedProductsForCarousel(12);
        setProducts(groupedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full py-20 md:py-28 px-4 md:px-8 lg:px-16 xl:px-24" style={{ background: '#ffffff' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          {/* Title */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight" style={{ color: '#000000' }}>
              Special Offers
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Curated selection of our best products at unbeatable prices
            </p>
          </div>

          {/* View All Button - Desktop */}
          <Button
            onClick={() => navigate('/clothing')}
            className="hidden md:flex rounded-full px-8 py-6 text-white font-semibold hover:opacity-90 transition-all"
            style={{ background: '#000000' }}
          >
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons - Desktop only */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full shadow-xl items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            style={{ background: '#6da71d' }}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full shadow-xl items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            style={{ background: '#6da71d' }}
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Products Scroll Container */}
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-[280px] h-[400px] rounded-2xl animate-pulse"
                  style={{ background: '#f5f5f5' }}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 md:mx-0 md:px-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {products.map((product, index) => {
                // Use style_code as unique ID since we're grouping by style only
                const productId = product.style_code;

                return (
                  <ShopProductCard
                    key={productId}
                    product={product}
                    isExpanded={expandedCardId === productId}
                    onToggleExpand={(shouldExpand) => {
                      const newExpandedId = shouldExpand ? productId : null;
                      setExpandedCardId(newExpandedId);

                    if (shouldExpand && scrollRef.current) {
                      // Auto-scroll to show expanded card
                      setTimeout(() => {
                        if (scrollRef.current) {
                          const container = scrollRef.current;
                          const cardElement = container.children[index] as HTMLElement;

                          if (cardElement) {
                            const containerRect = container.getBoundingClientRect();
                            const expandedWidth = 800;
                            const cardLeft = cardElement.offsetLeft;
                            const containerWidth = containerRect.width;
                            const currentScroll = container.scrollLeft;

                            // Calculate how much of the card is visible on the right
                            const cardRight = cardLeft + expandedWidth;
                            const visibleRight = currentScroll + containerWidth;

                            // If card extends beyond visible area, scroll to show it
                            if (cardRight > visibleRight) {
                              const targetScroll = cardRight - containerWidth + 60;
                              container.scrollTo({
                                left: Math.max(0, targetScroll),
                                behavior: 'smooth'
                              });
                            } else if (cardLeft < currentScroll) {
                              container.scrollTo({
                                left: Math.max(0, cardLeft - 60),
                                behavior: 'smooth'
                              });
                            }
                          }
                        }
                      }, 100);
                    }
                  }}
                />
              );
            })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No products available at the moment
            </div>
          )}
        </div>

        {/* View All Button - Mobile */}
        <div className="mt-8 md:hidden text-center">
          <Button
            onClick={() => navigate('/clothing')}
            className="rounded-full px-8 py-6 text-white font-semibold hover:opacity-90 transition-all w-full"
            style={{ background: '#000000' }}
          >
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      ` }} />
    </section>
  );
};

export default ShopProductCarousel;

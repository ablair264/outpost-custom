import React, { createContext, useContext, useState, useEffect } from 'react';
import { GroupedProduct } from '../lib/supabase';

interface WishlistItem {
  id: string;
  styleCode: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  productType: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: GroupedProduct) => void;
  removeFromWishlist: (styleCode: string) => void;
  toggleWishlist: (product: GroupedProduct) => void;
  isInWishlist: (styleCode: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const savedWishlist = localStorage.getItem('outpost-wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('outpost-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: GroupedProduct) => {
    setWishlist(prev => {
      // Check if already in wishlist
      if (prev.some(item => item.styleCode === product.style_code)) {
        return prev;
      }

      return [
        ...prev,
        {
          id: product.style_code,
          styleCode: product.style_code,
          name: product.style_name,
          brand: product.brand,
          price: product.price_range.min,
          image: product.primary_product_image_url,
          productType: product.product_type,
        },
      ];
    });
  };

  const removeFromWishlist = (styleCode: string) => {
    setWishlist(prev => prev.filter(item => item.styleCode !== styleCode));
  };

  const toggleWishlist = (product: GroupedProduct) => {
    if (isInWishlist(product.style_code)) {
      removeFromWishlist(product.style_code);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (styleCode: string) => {
    return wishlist.some(item => item.styleCode === styleCode);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

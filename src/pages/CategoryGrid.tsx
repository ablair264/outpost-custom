import React, { useEffect, useState } from 'react';
import { getCategoriesWithCounts, CategoryData } from '../lib/supabase';
import './CategoryGrid.css';

interface Category {
  id: string;
  name: string;
  displayName: string;
  imageUrl: string;
  productCount: number;
  group: string;
}

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get categories from Supabase with product counts
        const categoryData = await getCategoriesWithCounts();
        
        // Transform to match our interface
        const formattedCategories: Category[] = categoryData
          .filter(cat => cat.is_active && cat.product_count > 0) // Only show active categories with products
          .map(cat => ({
            id: cat.id,
            name: cat.category_key,
            displayName: cat.display_name,
            imageUrl: cat.image_url 
              ? cat.image_url.replace(/\s+/g, '').trim() // Clean up whitespace and newlines
              : `https://via.placeholder.com/600x400/1a1a1a/78BE20?text=${encodeURIComponent(cat.display_name)}`,
            productCount: cat.product_count,
            group: cat.category_group
          }))
          .sort((a, b) => b.productCount - a.productCount); // Sort by product count
        
        console.log('Formatted categories for display:', formattedCategories);
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get unique groups for filter
  const groups = ['all', ...Array.from(new Set(categories.map(cat => cat.group)))];
  
  // Filter categories by selected group
  const filteredCategories = selectedGroup === 'all' 
    ? categories 
    : categories.filter(cat => cat.group === selectedGroup);

  if (loading) {
    return (
      <div className="category-grid-page">
        <div className="container">
          <div className="loading-message">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-grid-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shop by Category</h1>
          <p className="page-subtitle">Discover our wide range of customisable clothing</p>
        </div>

        <div className="category-grid-container">
          {/* Sidebar Filter */}
          <div className="sidebar-filter">
            <h3 className="sidebar-title">Categories</h3>
            <div className="group-filter">
              {groups.map(group => (
                <button
                  key={group}
                  className={`group-button ${selectedGroup === group ? 'active' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                >
                  {group === 'all' ? 'All Categories' : group}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="category-main-content">
            <div className="category-grid">
              {filteredCategories.map((category) => (
                <a href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category.id} className="category-card">
                  <div className="category-image-wrapper">
                    <img 
                      src={category.imageUrl} 
                      alt={category.displayName}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x400/1a1a1a/78BE20?text=' + encodeURIComponent(category.displayName);
                      }}
                    />
                  </div>
                  <div className="category-content">
                    <h2 className="category-name">
                      {category.displayName}
                      <img src="/images/green-arrow.png" alt="View more" className="arrow-icon" />
                    </h2>
                  </div>
                </a>
              ))}
            </div>
            
            {filteredCategories.length === 0 && !loading && (
              <div className="no-categories">
                <p>No categories found in this group.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
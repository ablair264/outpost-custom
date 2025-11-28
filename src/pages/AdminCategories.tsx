import React, { useState, useEffect } from 'react';
import { defaultCategoryMappings, CategoryMapping } from '../data/categoryMapping';
import { getProductCategories } from '../lib/supabase';
import './AdminCategories.css';

interface ProductCount {
  name: string;
  productCount: number;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryMapping[]>(defaultCategoryMappings);
  const [productCounts, setProductCounts] = useState<ProductCount[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    // Load product counts from Supabase
    const fetchProductCounts = async () => {
      try {
        const counts = await getProductCategories();
        setProductCounts(counts);
      } catch (error) {
        console.error('Error fetching product counts:', error);
      }
    };

    fetchProductCounts();
  }, []);

  // Get unique groups
  const groups = ['all', ...Array.from(new Set(categories.map(cat => cat.group)))];

  // Filter categories
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cat.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || cat.group === selectedGroup;
    const matchesActive = showInactive || cat.isActive;
    
    return matchesSearch && matchesGroup && matchesActive;
  });

  // Get product count for a category
  const getProductCount = (categoryName: string): number => {
    const productInfo = productCounts.find(p => p.name === categoryName);
    return productInfo?.productCount || 0;
  };

  // Handle category update
  const updateCategory = (id: string, updates: Partial<CategoryMapping>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  // Handle image upload
  const handleImageUpload = (id: string, file: File) => {
    const imageUrl = URL.createObjectURL(file);
    updateCategory(id, { imageUrl });
    
    // In a real app, you'd upload to a server here
    console.log('Image uploaded for category:', id, file);
  };

  // Toggle category active status
  const toggleActive = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      updateCategory(id, { isActive: !category.isActive });
    }
  };

  // Save changes (in a real app, this would save to a database)
  const saveChanges = () => {
    console.log('Saving category changes:', categories);
    alert('Categories saved! (In a real app, this would save to your database)');
  };

  return (
    <div className="admin-categories-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">Category Management</h1>
          <p className="admin-subtitle">Manage category visibility, images, and display settings</p>
          
          <div className="admin-controls">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="group-select"
              >
                {groups.map(group => (
                  <option key={group} value={group}>
                    {group === 'all' ? 'All Groups' : group}
                  </option>
                ))}
              </select>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                />
                Show Inactive
              </label>
            </div>
            
            <button onClick={saveChanges} className="save-button">
              Save All Changes
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Categories</h3>
            <p>{categories.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Categories</h3>
            <p>{categories.filter(cat => cat.isActive).length}</p>
          </div>
          <div className="stat-card">
            <h3>Categories with Products</h3>
            <p>{categories.filter(cat => getProductCount(cat.name) > 0).length}</p>
          </div>
        </div>

        <div className="categories-table">
          <div className="table-header">
            <div className="header-cell">Image</div>
            <div className="header-cell">Category</div>
            <div className="header-cell">Display Name</div>
            <div className="header-cell">Group</div>
            <div className="header-cell">Products</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>

          {filteredCategories.map((category) => (
            <div key={category.id} className={`table-row ${!category.isActive ? 'inactive' : ''}`}>
              <div className="cell image-cell">
                <div className="image-upload-container">
                  <img
                    src={category.imageUrl}
                    alt={category.displayName}
                    className="category-thumbnail"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100x100/1a1a1a/78BE20?text=' + encodeURIComponent(category.displayName.slice(0, 2));
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(category.id, file);
                    }}
                    className="image-upload-input"
                    id={`image-${category.id}`}
                  />
                  <label htmlFor={`image-${category.id}`} className="image-upload-button">
                    📷
                  </label>
                </div>
              </div>

              <div className="cell">
                <strong>{category.name}</strong>
              </div>

              <div className="cell">
                {editingId === category.id ? (
                  <input
                    type="text"
                    value={category.displayName}
                    onChange={(e) => updateCategory(category.id, { displayName: e.target.value })}
                    onBlur={() => setEditingId(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingId(null)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => setEditingId(category.id)} className="editable">
                    {category.displayName}
                  </span>
                )}
              </div>

              <div className="cell">
                <select
                  value={category.group}
                  onChange={(e) => updateCategory(category.id, { group: e.target.value })}
                  className="group-select-small"
                >
                  {groups.filter(g => g !== 'all').map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div className="cell">
                <span className={`product-count ${getProductCount(category.name) === 0 ? 'zero' : ''}`}>
                  {getProductCount(category.name)}
                </span>
              </div>

              <div className="cell">
                <button
                  onClick={() => toggleActive(category.id)}
                  className={`status-button ${category.isActive ? 'active' : 'inactive'}`}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="cell">
                <div className="action-buttons">
                  <button
                    onClick={() => updateCategory(category.id, { sortOrder: category.sortOrder - 1 })}
                    className="action-button"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => updateCategory(category.id, { sortOrder: category.sortOrder + 1 })}
                    className="action-button"
                    title="Move Down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="no-results">
            <p>No categories match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
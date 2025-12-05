import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Image, Edit2, Trash2, Upload, X, Eye, EyeOff, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
// @ts-ignore - Type definitions not available
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  AdSlide,
  BentoTile,
  HeroGridImage,
  AccordionItem,
  fetchAllAdvertisementSlides,
  fetchAllBentoTiles,
  fetchAllHeroGridImages,
  fetchAllAccordionItems,
  createAdvertisementSlide,
  updateAdvertisementSlide,
  deleteAdvertisementSlide,
  createBentoTile,
  updateBentoTile,
  deleteBentoTile,
  createHeroGridImage,
  updateHeroGridImage,
  deleteHeroGridImage,
  createAccordionItem,
  updateAccordionItem,
  deleteAccordionItem,
  uploadImage
} from '../../utils/supabase';

const ShopPageEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // State
  const [adSlides, setAdSlides] = useState<AdSlide[]>([]);
  const [bentoTiles, setBentoTiles] = useState<BentoTile[]>([]);
  const [heroGridImages, setHeroGridImages] = useState<HeroGridImage[]>([]);
  const [accordionItems, setAccordionItems] = useState<AccordionItem[]>([]);

  // Modals
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [showTileModal, setShowTileModal] = useState(false);
  const [showAccordionModal, setShowAccordionModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<AdSlide | null>(null);
  const [editingTile, setEditingTile] = useState<BentoTile | null>(null);
  const [editingAccordionItem, setEditingAccordionItem] = useState<AccordionItem | null>(null);

  // Upload state
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const [uploadingTile, setUploadingTile] = useState(false);
  const [uploadingHeroGrid, setUploadingHeroGrid] = useState(false);
  const [uploadingAccordion, setUploadingAccordion] = useState(false);

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false);

  // Grid layout state
  const [hasLayoutChanges, setHasLayoutChanges] = useState(false);
  const [layoutMode, setLayoutMode] = useState(false); // true = layout editing, false = content editing

  // Form state
  const [slideForm, setSlideForm] = useState({
    image_url: '',
    alt_text: '',
    link_url: '',
    order_position: 1,
    is_active: true
  });

  const [tileForm, setTileForm] = useState({
    title: '',
    image_url: '',
    link_url: '',
    grid_section: 'left' as 'left' | 'right',
    grid_position: 1,
    span_rows: 1,
    span_cols: 1,
    font_size: 'text-lg',
    font_position: 'bottom-left',
    is_active: true
  });

  const [accordionForm, setAccordionForm] = useState({
    image_url: '',
    title: '',
    description: '',
    link_url: '',
    order_position: 1,
    is_active: true
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [slides, tiles, heroImages, accordion] = await Promise.all([
        fetchAllAdvertisementSlides(),
        fetchAllBentoTiles(),
        fetchAllHeroGridImages(),
        fetchAllAccordionItems()
      ]);
      setAdSlides(slides);
      setBentoTiles(tiles);
      setHeroGridImages(heroImages);
      setAccordionItems(accordion);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Slide handlers
  const handleCreateSlide = async () => {
    const newSlide = await createAdvertisementSlide(slideForm);
    if (newSlide) {
      setAdSlides([...adSlides, newSlide]);
      setShowSlideModal(false);
      resetSlideForm();
    }
  };

  const handleUpdateSlide = async () => {
    if (!editingSlide) return;
    const updated = await updateAdvertisementSlide(editingSlide.id, slideForm);
    if (updated) {
      setAdSlides(adSlides.map(s => s.id === updated.id ? updated : s));
      setShowSlideModal(false);
      setEditingSlide(null);
      resetSlideForm();
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (window.confirm('Delete this slide?')) {
      const success = await deleteAdvertisementSlide(id);
      if (success) {
        setAdSlides(adSlides.filter(s => s.id !== id));
      }
    }
  };

  // Tile handlers
  const handleCreateTile = async () => {
    const newTile = await createBentoTile(tileForm);
    if (newTile) {
      setShowTileModal(false);
      resetTileForm();
      // Reload data to refresh the display
      await loadData();
    }
  };

  const handleUpdateTile = async () => {
    if (!editingTile) return;
    const updated = await updateBentoTile(editingTile.id, tileForm);
    if (updated) {
      setShowTileModal(false);
      setEditingTile(null);
      resetTileForm();
      // Reload data to refresh the display
      await loadData();
    }
  };

  const handleDeleteTile = async (id: string) => {
    if (window.confirm('Delete this tile?')) {
      const success = await deleteBentoTile(id);
      if (success) {
        setBentoTiles(bentoTiles.filter(t => t.id !== id));
      }
    }
  };

  const resetSlideForm = () => {
    setSlideForm({
      image_url: '',
      alt_text: '',
      link_url: '',
      order_position: adSlides.length + 1,
      is_active: true
    });
  };

  const resetTileForm = () => {
    setTileForm({
      title: '',
      image_url: '',
      link_url: '',
      grid_section: 'left',
      grid_position: 1,
      span_rows: 1,
      span_cols: 1,
      font_size: 'text-lg',
      font_position: 'bottom-left',
      is_active: true
    });
  };

  const openEditSlide = (slide: AdSlide) => {
    setEditingSlide(slide);
    setSlideForm({
      image_url: slide.image_url,
      alt_text: slide.alt_text,
      link_url: slide.link_url || '',
      order_position: slide.order_position,
      is_active: slide.is_active
    });
    setShowSlideModal(true);
  };

  const openEditTile = (tile: BentoTile) => {
    setEditingTile(tile);
    setTileForm({
      title: tile.title,
      image_url: tile.image_url,
      link_url: tile.link_url,
      grid_section: tile.grid_section,
      grid_position: tile.grid_position,
      span_rows: tile.span_rows || 1,
      span_cols: tile.span_cols || 1,
      font_size: tile.font_size || 'text-lg',
      font_position: tile.font_position || 'bottom-left',
      is_active: tile.is_active
    });
    setShowTileModal(true);
  };

  // Image upload handlers
  const handleSlideImageUpload = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploadingSlide(true);
    const file = acceptedFiles[0];
    const url = await uploadImage(file, 'slides');

    if (url) {
      setSlideForm(prev => ({ ...prev, image_url: url }));
    }
    setUploadingSlide(false);
  }, []);

  const handleTileImageUpload = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploadingTile(true);
    const file = acceptedFiles[0];
    const url = await uploadImage(file, 'tiles');

    if (url) {
      setTileForm(prev => ({ ...prev, image_url: url }));
    }
    setUploadingTile(false);
  }, []);

  // Dropzone configurations
  const slideDropzone = useDropzone({
    onDrop: handleSlideImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const tileDropzone = useDropzone({
    onDrop: handleTileImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  // Hero Grid handlers
  const handleHeroGridImageUpload = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Check if adding these files would exceed the limit
    const remainingSlots = 21 - heroGridImages.length;
    if (remainingSlots <= 0) {
      alert('Maximum 21 images allowed. Please delete some images first.');
      return;
    }

    // Limit files to remaining slots
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);
    if (filesToUpload.length < acceptedFiles.length) {
      alert(`Only uploading ${filesToUpload.length} images to stay within the 21 image limit.`);
    }

    setUploadingHeroGrid(true);
    try {
      for (const file of filesToUpload) {
        const imageUrl = await uploadImage(file, 'tiles');
        if (imageUrl) {
          const newImage = await createHeroGridImage({
            image_url: imageUrl,
            position: heroGridImages.length + 1,
            is_active: true
          });
          if (newImage) {
            setHeroGridImages(prev => [...prev, newImage]);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading hero grid images:', error);
    } finally {
      setUploadingHeroGrid(false);
    }
  }, [heroGridImages.length]);

  const handleToggleHeroGridImage = async (image: HeroGridImage) => {
    const updated = await updateHeroGridImage(image.id, {
      is_active: !image.is_active
    });
    if (updated) {
      setHeroGridImages(heroGridImages.map(img => img.id === updated.id ? updated : img));
    }
  };

  const handleDeleteHeroGridImage = async (id: string) => {
    if (window.confirm('Delete this image?')) {
      const success = await deleteHeroGridImage(id);
      if (success) {
        setHeroGridImages(heroGridImages.filter(img => img.id !== id));
      }
    }
  };

  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const handleHeroGridDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedImageIndex(index);
  };

  const handleHeroGridDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleHeroGridDragEnd = () => {
    setDraggedImageIndex(null);
  };

  const handleHeroGridDrop = async (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (dragIndex === dropIndex) {
      setDraggedImageIndex(null);
      return;
    }

    // Reorder the array
    const sortedImages = [...heroGridImages].sort((a, b) => a.position - b.position);
    const newImages = [...sortedImages];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    // Update positions in database
    for (let i = 0; i < newImages.length; i++) {
      newImages[i].position = i + 1;
      await updateHeroGridImage(newImages[i].id, { position: i + 1 });
    }

    setHeroGridImages(newImages);
    setDraggedImageIndex(null);
  };

  const heroGridDropzone = useDropzone({
    onDrop: handleHeroGridImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    multiple: true
  });

  // Accordion handlers
  const handleCreateAccordionItem = async () => {
    const newItem = await createAccordionItem(accordionForm);
    if (newItem) {
      setAccordionItems([...accordionItems, newItem]);
      setShowAccordionModal(false);
      resetAccordionForm();
    }
  };

  const handleUpdateAccordionItem = async () => {
    if (!editingAccordionItem) return;
    const updated = await updateAccordionItem(editingAccordionItem.id, accordionForm);
    if (updated) {
      setAccordionItems(accordionItems.map(item => item.id === updated.id ? updated : item));
      setShowAccordionModal(false);
      setEditingAccordionItem(null);
      resetAccordionForm();
    }
  };

  const handleDeleteAccordionItem = async (id: string) => {
    if (window.confirm('Delete this accordion item?')) {
      const success = await deleteAccordionItem(id);
      if (success) {
        setAccordionItems(accordionItems.filter(item => item.id !== id));
      }
    }
  };

  const handleToggleAccordionItem = async (item: AccordionItem) => {
    const updated = await updateAccordionItem(item.id, {
      is_active: !item.is_active
    });
    if (updated) {
      setAccordionItems(accordionItems.map(i => i.id === updated.id ? updated : i));
    }
  };

  const openEditAccordionItem = (item: AccordionItem) => {
    setEditingAccordionItem(item);
    setAccordionForm({
      image_url: item.image_url,
      title: item.title,
      description: item.description,
      link_url: item.link_url || '',
      order_position: item.order_position,
      is_active: item.is_active
    });
    setShowAccordionModal(true);
  };

  const resetAccordionForm = () => {
    setAccordionForm({
      image_url: '',
      title: '',
      description: '',
      link_url: '',
      order_position: accordionItems.length + 1,
      is_active: true
    });
  };

  const handleAccordionImageUpload = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploadingAccordion(true);
    try {
      const file = acceptedFiles[0];
      const imageUrl = await uploadImage(file, 'tiles');
      if (imageUrl) {
        setAccordionForm(prev => ({ ...prev, image_url: imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading accordion image:', error);
    } finally {
      setUploadingAccordion(false);
    }
  }, []);

  const accordionDropzone = useDropzone({
    onDrop: handleAccordionImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    multiple: false
  });

  // Convert BentoTiles to GridLayout format
  const tilesToLayout = (tiles: BentoTile[], section: 'left' | 'right') => {
    const cols = 4; // Both grids now use 4 columns
    return tiles.map(tile => {
      // Calculate x and y based on position for the specific grid
      const position = tile.grid_position - 1;
      return {
        i: tile.id,
        x: position % cols,
        y: Math.floor(position / cols),
        w: tile.span_cols || 1,
        h: tile.span_rows || 1,
        minW: 1,
        minH: 1,
        maxW: cols,
        maxH: 3
      };
    });
  };

  // Handle layout changes from drag/resize
  const handleLayoutChange = useCallback((section: 'left' | 'right', newLayout: any[]) => {
    // Check if there's any actual change before updating
    let hasActualChange = false;

    setBentoTiles(prevTiles => {
      const updatedTiles = prevTiles.map(tile => {
        if (tile.grid_section !== section) return tile;

        const layoutItem = newLayout.find(item => item.i === tile.id);
        if (!layoutItem) return tile;

        // Calculate new grid position based on layout (both grids use 4 columns now)
        const newPosition = layoutItem.y * 4 + layoutItem.x + 1;

        // Check if anything actually changed
        if (
          tile.grid_position !== newPosition ||
          tile.span_rows !== layoutItem.h ||
          tile.span_cols !== layoutItem.w
        ) {
          hasActualChange = true;
        }

        return {
          ...tile,
          grid_position: newPosition,
          span_rows: layoutItem.h,
          span_cols: layoutItem.w
        };
      });

      // Only update if there was an actual change
      if (hasActualChange) {
        setHasLayoutChanges(true);
        return updatedTiles;
      }
      return prevTiles;
    });
  }, []);

  // Save layout changes to database
  const handleSaveLayout = async () => {
    try {
      const updates = bentoTiles.map(tile =>
        updateBentoTile(tile.id, {
          grid_position: tile.grid_position,
          span_rows: tile.span_rows,
          span_cols: tile.span_cols
        })
      );

      await Promise.all(updates);
      setHasLayoutChanges(false);
      alert('Layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save layout');
    }
  };

  // Reset layout to reload from database
  const handleResetLayout = () => {
    if (window.confirm('Reset layout to last saved version? Any unsaved changes will be lost.')) {
      loadData();
      setHasLayoutChanges(false);
    }
  };

  const getTileClass = (position: number, section: 'left' | 'right') => {
    if (section === 'left') {
      if (position === 1) return 'col-span-2 row-span-2 min-h-[280px]';
      if (position >= 2 && position <= 5) return 'min-h-[130px]';
      if (position >= 6) return 'col-span-2 min-h-[120px]';
    } else {
      if (position === 1) return 'min-h-[120px]';
      if (position === 2) return 'row-span-2 min-h-[280px]';
      if (position === 3) return 'min-h-[200px]';
      if (position === 4) return 'min-h-[120px]';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const activeSlides = adSlides.filter(s => s.is_active).sort((a, b) => a.order_position - b.order_position);
  const leftTiles = bentoTiles.filter(t => t.grid_section === 'left' && t.is_active).sort((a, b) => a.grid_position - b.grid_position);
  const rightTiles = bentoTiles.filter(t => t.grid_section === 'right' && t.is_active).sort((a, b) => a.grid_position - b.grid_position);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Custom styles for react-grid-layout */}
      <style>{`
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top, width, height;
        }
        .react-grid-item.cssTransforms {
          transition-property: transform, width, height;
        }
        .react-grid-item.resizing {
          transition: none;
          z-index: 100;
          will-change: width, height;
        }
        .react-grid-item.react-draggable-dragging {
          transition: none;
          z-index: 100;
          will-change: transform;
        }
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .react-grid-item > .react-resizable-handle::after {
          content: "";
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 8px;
          height: 8px;
          border-right: 2px solid rgba(255, 255, 255, 0.6);
          border-bottom: 2px solid rgba(255, 255, 255, 0.6);
          cursor: se-resize;
        }
        .react-grid-item:hover > .react-resizable-handle::after {
          border-right: 2px solid rgba(255, 255, 255, 0.9);
          border-bottom: 2px solid rgba(255, 255, 255, 0.9);
        }
        .react-resizable-handle-se {
          bottom: 0;
          right: 0;
          cursor: se-resize;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Shop Page Editor</h1>
              <p className="text-gray-600 mt-1">Edit your shop page layout in real-time</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
              >
                {previewMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Page Preview/Editor */}
      <div className="max-w-[1400px] mx-auto p-6">

        {/* ADVERTISEMENT CAROUSEL SECTION */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Advertisement Carousel</h2>
            {!previewMode && (
              <button
                onClick={() => {
                  resetSlideForm();
                  setEditingSlide(null);
                  setShowSlideModal(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#78BE20] hover:bg-[#6da71d] text-white text-sm font-semibold rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Slide
              </button>
            )}
          </div>

          {/* Carousel Preview */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            {activeSlides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {activeSlides.map((slide) => (
                  <div
                    key={slide.id}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-video"
                  >
                    <img
                      src={slide.image_url}
                      alt={slide.alt_text}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      #{slide.order_position}
                    </div>
                    {!previewMode && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditSlide(slide)}
                          className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg transition-all flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No carousel slides yet</p>
                {!previewMode && (
                  <button
                    onClick={() => {
                      resetSlideForm();
                      setEditingSlide(null);
                      setShowSlideModal(true);
                    }}
                    className="px-4 py-2 bg-[#78BE20] hover:bg-[#6da71d] text-white rounded-lg transition-all"
                  >
                    Add First Slide
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* HERO GRID IMAGES SECTION */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hero Grid Images</h2>
              <p className="text-sm text-gray-500 mt-1">
                Animated background grid on shop hero section (21 slots: 3 rows × 7 columns)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Upload Area */}
            <div
              {...heroGridDropzone.getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 mb-6 text-center cursor-pointer transition-colors ${
                heroGridDropzone.isDragActive
                  ? 'border-[#78BE20] bg-[#78BE20]/10'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...heroGridDropzone.getInputProps()} />
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 font-medium mb-1">
                {uploadingHeroGrid ? 'Uploading...' : 'Drop images here or click to upload'}
              </p>
              <p className="text-gray-400 text-sm">
                Supports: PNG, JPG, WEBP, GIF (multiple files)
              </p>
            </div>

            {/* Drag hint */}
            {heroGridImages.length > 1 && !previewMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                <p className="font-semibold">💡 Tip:</p>
                <p className="text-blue-700">Drag and drop images to reorder them in the grid</p>
              </div>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {heroGridImages
                .sort((a, b) => a.position - b.position)
                .map((image, index) => (
                <div
                  key={image.id}
                  draggable={!previewMode}
                  onDragStart={(e) => handleHeroGridDragStart(e, index)}
                  onDragOver={handleHeroGridDragOver}
                  onDrop={(e) => handleHeroGridDrop(e, index)}
                  onDragEnd={handleHeroGridDragEnd}
                  className={`relative group bg-gray-100 rounded-lg overflow-hidden aspect-square transition-all ${
                    !previewMode ? 'cursor-move' : ''
                  } ${
                    draggedImageIndex === index ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`Grid image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Inactive indicator */}
                  {!image.is_active && (
                    <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center pointer-events-none">
                      <span className="text-white text-xs font-medium">Inactive</span>
                    </div>
                  )}

                  {/* Overlay with controls */}
                  {!previewMode && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 z-10">
                      <button
                        onClick={() => handleToggleHeroGridImage(image)}
                        className={`p-1.5 rounded-full transition-colors ${
                          image.is_active
                            ? 'bg-[#78BE20] text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                        title={image.is_active ? 'Active' : 'Inactive'}
                      >
                        {image.is_active ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteHeroGridImage(image.id)}
                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Position indicator */}
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded z-20">
                    #{index + 1}
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 21 - heroGridImages.length) }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center border-2 border-dashed border-gray-300"
                >
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <div>
                <strong>{heroGridImages.length}</strong> / 21 slots filled
              </div>
              <div>
                <strong>{heroGridImages.filter(img => img.is_active).length}</strong> active
              </div>
            </div>
          </div>
        </div>

        {/* BENTO GRID SECTION - HIDDEN BUT KEEPING LOGIC INTACT */}
        {false && <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Bento Grid Categories</h2>
            <div className="flex gap-2">
              {!previewMode && (
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setLayoutMode(false)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded transition-all ${
                      !layoutMode
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Content Mode
                  </button>
                  <button
                    onClick={() => setLayoutMode(true)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded transition-all ${
                      layoutMode
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Layout Mode
                  </button>
                </div>
              )}
              {hasLayoutChanges && !previewMode && layoutMode && (
                <>
                  <button
                    onClick={handleResetLayout}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={handleSaveLayout}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all animate-pulse"
                  >
                    <Save className="w-4 h-4" />
                    Save Layout
                  </button>
                </>
              )}
              {!previewMode && !layoutMode && (
                <button
                  onClick={() => {
                    resetTileForm();
                    setEditingTile(null);
                    setShowTileModal(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#78BE20] hover:bg-[#6da71d] text-white text-sm font-semibold rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Tile
                </button>
              )}
            </div>
          </div>

          {!previewMode && layoutMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
              <p className="font-semibold">🎨 Layout Mode Active:</p>
              <p className="text-blue-700">Drag tiles to reposition them or use the resize handle in the bottom-right corner to change their size.</p>
            </div>
          )}
          {!previewMode && !layoutMode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-800">
              <p className="font-semibold">✏️ Content Mode Active:</p>
              <p className="text-green-700">Click Edit on any tile to change its image, title, and link. Use Layout Mode to rearrange or resize tiles.</p>
            </div>
          )}

          {/* Bento Grid Layout */}
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* LEFT GRID */}
              <div>
                <h3 className="text-white text-sm font-semibold mb-3 opacity-70">Left Grid (4 columns)</h3>
                {leftTiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    No left grid tiles yet
                  </div>
                ) : (
                  <GridLayout
                    className="layout"
                    layout={tilesToLayout(leftTiles, 'left')}
                    cols={4}
                    rowHeight={100}
                    width={600}
                    isDraggable={layoutMode && !previewMode}
                    isResizable={layoutMode && !previewMode}
                    onLayoutChange={(layout: any) => handleLayoutChange('left', layout)}
                    compactType="vertical"
                    preventCollision={false}
                    allowOverlap={false}
                  >
                    {leftTiles.map((tile) => {
                      // Helper function to get positioning classes
                      const getPositionClasses = (position: string) => {
                        const positionMap: { [key: string]: string } = {
                          'top-left': 'items-start justify-start',
                          'top-center': 'items-start justify-center',
                          'top-right': 'items-start justify-end',
                          'center-left': 'items-center justify-start',
                          'center': 'items-center justify-center',
                          'center-right': 'items-center justify-end',
                          'bottom-left': 'items-end justify-start',
                          'bottom-center': 'items-end justify-center',
                          'bottom-right': 'items-end justify-end'
                        };
                        return positionMap[position] || 'items-center justify-center';
                      };

                      return (
                      <div key={tile.id} className="relative group">
                        <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                          <img
                            src={tile.image_url}
                            alt={tile.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 bg-black/40 flex ${getPositionClasses(tile.font_position || 'bottom-left')} p-4`}>
                            <h3 className={`text-white ${tile.font_size || 'text-lg'} font-black uppercase`}>{tile.title}</h3>
                          </div>
                          {!previewMode && !layoutMode && (
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                              <button
                                onClick={() => openEditTile(tile)}
                                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-900 rounded text-sm transition-all flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTile(tile.id)}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-all flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          )}
                          {layoutMode && (
                            <div className="absolute top-2 left-2 bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded text-xs z-10">
                              {tile.span_cols}×{tile.span_rows}
                            </div>
                          )}
                        </div>
                      </div>
                      )
                    })}
                  </GridLayout>
                )}
              </div>

              {/* RIGHT GRID */}
              <div>
                <h3 className="text-white text-sm font-semibold mb-3 opacity-70">Right Grid (4 columns)</h3>
                {rightTiles.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    No right grid tiles yet
                  </div>
                ) : (
                  <GridLayout
                    className="layout"
                    layout={tilesToLayout(rightTiles, 'right')}
                    cols={4}
                    rowHeight={100}
                    width={600}
                    isDraggable={layoutMode && !previewMode}
                    isResizable={layoutMode && !previewMode}
                    onLayoutChange={(layout: any) => handleLayoutChange('right', layout)}
                    compactType="vertical"
                    preventCollision={false}
                    allowOverlap={false}
                  >
                    {rightTiles.map((tile) => {
                      // Helper function to get positioning classes
                      const getPositionClasses = (position: string) => {
                        const positionMap: { [key: string]: string } = {
                          'top-left': 'items-start justify-start',
                          'top-center': 'items-start justify-center',
                          'top-right': 'items-start justify-end',
                          'center-left': 'items-center justify-start',
                          'center': 'items-center justify-center',
                          'center-right': 'items-center justify-end',
                          'bottom-left': 'items-end justify-start',
                          'bottom-center': 'items-end justify-center',
                          'bottom-right': 'items-end justify-end'
                        };
                        return positionMap[position] || 'items-center justify-center';
                      };

                      return (
                      <div key={tile.id} className="relative group">
                        <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
                          <img
                            src={tile.image_url}
                            alt={tile.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 bg-black/40 flex ${getPositionClasses(tile.font_position || 'bottom-left')} p-4`}>
                            <h3 className={`text-white ${tile.font_size || 'text-lg'} font-black uppercase`}>{tile.title}</h3>
                          </div>
                          {!previewMode && !layoutMode && (
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                              <button
                                onClick={() => openEditTile(tile)}
                                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-900 rounded text-sm transition-all flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTile(tile.id)}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-all flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          )}
                          {layoutMode && (
                            <div className="absolute top-2 left-2 bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded text-xs z-10">
                              {tile.span_cols}×{tile.span_rows}
                            </div>
                          )}
                        </div>
                      </div>
                      )
                    })}
                  </GridLayout>
                )}
              </div>
            </div>
          </div>
        </div>}

        {/* IMAGE ACCORDION SECTION */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Image Accordion</h2>
            <button
              onClick={() => {
                resetAccordionForm();
                setEditingAccordionItem(null);
                setShowAccordionModal(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#78BE20] hover:bg-[#6da71d] text-white text-sm font-semibold rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {accordionItems.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No accordion items yet. Click "Add Item" to create one.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {accordionItems
                  .sort((a, b) => a.order_position - b.order_position)
                  .map((item, index) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Preview Image */}
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{item.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">Position: {item.order_position}</span>
                          {item.link_url && (
                            <span className="text-xs text-blue-600 truncate max-w-xs">
                              → {item.link_url}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleAccordionItem(item)}
                          className={`p-2 rounded transition-colors ${
                            item.is_active
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title={item.is_active ? 'Active' : 'Inactive'}
                        >
                          {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEditAccordionItem(item)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccordionItem(item.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <div>
              Total: <strong>{accordionItems.length}</strong> items
            </div>
            <div>
              <strong>{accordionItems.filter(item => item.is_active).length}</strong> active
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">💡 How to use this editor:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Hover over any element to see edit/delete buttons</li>
            <li>Click "Add Slide" or "Add Tile" to create new content</li>
            <li>Toggle "Preview Mode" to see how it looks without edit buttons</li>
            <li>Changes save immediately to your database</li>
          </ul>
        </div>
      </div>

      {/* SLIDE MODAL */}
      {showSlideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              </h3>
              <button
                onClick={() => {
                  setShowSlideModal(false);
                  setEditingSlide(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload Dropzone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>

                {/* Dropzone */}
                <div
                  {...slideDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    slideDropzone.isDragActive
                      ? 'border-[#78BE20] bg-green-50'
                      : 'border-gray-300 hover:border-[#78BE20] hover:bg-gray-50'
                  }`}
                >
                  <input {...slideDropzone.getInputProps()} />
                  {uploadingSlide ? (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-[#78BE20] mb-2 animate-pulse" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : slideForm.image_url ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={slideForm.image_url}
                        alt="Preview"
                        className="max-h-40 rounded-lg mb-3"
                      />
                      <p className="text-sm text-gray-600">
                        Drag and drop to replace, or click to browse
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop an image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP, or GIF (max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual URL Input */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Or paste image URL:
                  </label>
                  <input
                    type="text"
                    value={slideForm.image_url}
                    onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text *
                </label>
                <input
                  type="text"
                  value={slideForm.alt_text}
                  onChange={(e) => setSlideForm({ ...slideForm, alt_text: e.target.value })}
                  placeholder="Description of the slide"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (optional)
                </label>
                <input
                  type="text"
                  value={slideForm.link_url}
                  onChange={(e) => setSlideForm({ ...slideForm, link_url: e.target.value })}
                  placeholder="/products or https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Position
                </label>
                <input
                  type="number"
                  min="1"
                  value={slideForm.order_position}
                  onChange={(e) => setSlideForm({ ...slideForm, order_position: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="slide-active"
                  checked={slideForm.is_active}
                  onChange={(e) => setSlideForm({ ...slideForm, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#78BE20] rounded focus:ring-[#78BE20]"
                />
                <label htmlFor="slide-active" className="text-sm font-medium text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowSlideModal(false);
                  setEditingSlide(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingSlide ? handleUpdateSlide : handleCreateSlide}
                className="flex-1 px-4 py-2 bg-[#78BE20] hover:bg-[#6da71d] text-white rounded-lg transition-all"
              >
                {editingSlide ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TILE MODAL */}
      {showTileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTile ? 'Edit Tile' : 'Add New Tile'}
              </h3>
              <button
                onClick={() => {
                  setShowTileModal(false);
                  setEditingTile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={tileForm.title}
                  onChange={(e) => setTileForm({ ...tileForm, title: e.target.value })}
                  placeholder="TOPS"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                />
              </div>

              {/* Image Upload Dropzone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>

                {/* Dropzone */}
                <div
                  {...tileDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    tileDropzone.isDragActive
                      ? 'border-[#78BE20] bg-green-50'
                      : 'border-gray-300 hover:border-[#78BE20] hover:bg-gray-50'
                  }`}
                >
                  <input {...tileDropzone.getInputProps()} />
                  {uploadingTile ? (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-[#78BE20] mb-2 animate-pulse" />
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : tileForm.image_url ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={tileForm.image_url}
                        alt="Preview"
                        className="max-h-40 rounded-lg mb-3"
                      />
                      <p className="text-sm text-gray-600">
                        Drag and drop to replace, or click to browse
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop an image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP, or GIF (max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual URL Input */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Or paste image URL:
                  </label>
                  <input
                    type="text"
                    value={tileForm.image_url}
                    onChange={(e) => setTileForm({ ...tileForm, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL *
                </label>
                <input
                  type="text"
                  value={tileForm.link_url}
                  onChange={(e) => setTileForm({ ...tileForm, link_url: e.target.value })}
                  placeholder="/products?type=T-Shirts"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grid Section
                </label>
                <select
                  value={tileForm.grid_section}
                  onChange={(e) => setTileForm({ ...tileForm, grid_section: e.target.value as 'left' | 'right' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                >
                  <option value="left">Left Grid</option>
                  <option value="right">Right Grid</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Use Layout Mode (toggle button above) to drag and arrange tiles on the grid.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Size
                </label>
                <select
                  value={tileForm.font_size}
                  onChange={(e) => setTileForm({ ...tileForm, font_size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Medium</option>
                  <option value="text-lg">Large (Default)</option>
                  <option value="text-xl">Extra Large</option>
                  <option value="text-2xl">2X Large</option>
                  <option value="text-3xl">3X Large</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Size of the tile title text
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Position
                </label>
                <select
                  value={tileForm.font_position}
                  onChange={(e) => setTileForm({ ...tileForm, font_position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="center-left">Center Left</option>
                  <option value="center">Center</option>
                  <option value="center-right">Center Right</option>
                  <option value="bottom-left">Bottom Left (Default)</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Position of the tile title text
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 Tip:</p>
                <p className="text-blue-700">Use <strong>Layout Mode</strong> to drag and resize tiles visually instead of manually entering dimensions.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tile-active"
                  checked={tileForm.is_active}
                  onChange={(e) => setTileForm({ ...tileForm, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#78BE20] rounded focus:ring-[#78BE20]"
                />
                <label htmlFor="tile-active" className="text-sm font-medium text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowTileModal(false);
                  setEditingTile(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingTile ? handleUpdateTile : handleCreateTile}
                className="flex-1 px-4 py-2 bg-[#78BE20] hover:bg-[#6da71d] text-white rounded-lg transition-all"
              >
                {editingTile ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACCORDION MODAL */}
      {showAccordionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAccordionItem ? 'Edit Accordion Item' : 'Add New Accordion Item'}
              </h3>
              <button
                onClick={() => {
                  setShowAccordionModal(false);
                  setEditingAccordionItem(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <div
                  {...accordionDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    accordionDropzone.isDragActive
                      ? 'border-[#78BE20] bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...accordionDropzone.getInputProps()} />
                  {uploadingAccordion ? (
                    <div className="text-gray-400">Uploading...</div>
                  ) : accordionForm.image_url ? (
                    <div className="space-y-2">
                      <img
                        src={accordionForm.image_url}
                        alt="Preview"
                        className="mx-auto h-32 rounded object-cover"
                      />
                      <p className="text-sm text-gray-600">Click or drag to replace</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click or drag image here
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={accordionForm.title}
                  onChange={(e) =>
                    setAccordionForm({ ...accordionForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                  placeholder="e.g., Custom T-Shirts"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={accordionForm.description}
                  onChange={(e) =>
                    setAccordionForm({ ...accordionForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                  placeholder="e.g., Personalized designs for every occasion"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (optional)
                </label>
                <input
                  type="text"
                  value={accordionForm.link_url}
                  onChange={(e) =>
                    setAccordionForm({ ...accordionForm, link_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                  placeholder="/products or https://example.com"
                />
              </div>

              {/* Order Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Position
                </label>
                <input
                  type="number"
                  min="1"
                  value={accordionForm.order_position}
                  onChange={(e) =>
                    setAccordionForm({ ...accordionForm, order_position: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78BE20]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="accordion-active"
                  checked={accordionForm.is_active}
                  onChange={(e) =>
                    setAccordionForm({ ...accordionForm, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-[#78BE20] rounded focus:ring-[#78BE20]"
                />
                <label htmlFor="accordion-active" className="text-sm font-medium text-gray-700">
                  Active (show on website)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowAccordionModal(false);
                  setEditingAccordionItem(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingAccordionItem ? handleUpdateAccordionItem : handleCreateAccordionItem}
                className="flex-1 px-4 py-2 bg-[#78BE20] hover:bg-[#6da71d] text-white rounded-lg transition-all"
              >
                {editingAccordionItem ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPageEditor;

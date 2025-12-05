import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {
  HeroGridImage,
  fetchAllHeroGridImages,
  createHeroGridImage,
  updateHeroGridImage,
  deleteHeroGridImage,
  uploadImage
} from '../../utils/supabase';

const HeroGridManager: React.FC = () => {
  const [images, setImages] = useState<HeroGridImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await fetchAllHeroGridImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading hero grid images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    setUploading(true);
    try {
      for (const file of files) {
        const imageUrl = await uploadImage(file, 'tiles');
        if (imageUrl) {
          const newImage = await createHeroGridImage({
            image_url: imageUrl,
            position: images.length + 1,
            is_active: true
          });
          if (newImage) {
            setImages([...images, newImage]);
          }
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    multiple: true
  });

  const handleToggleActive = async (image: HeroGridImage) => {
    const updated = await updateHeroGridImage(image.id, {
      is_active: !image.is_active
    });
    if (updated) {
      setImages(images.map(img => img.id === updated.id ? updated : img));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this image?')) {
      const success = await deleteHeroGridImage(id);
      if (success) {
        setImages(images.filter(img => img.id !== id));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hero Grid Images</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage images for the animated grid background (21 slots available)
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-[#78BE20] bg-[#78BE20]/10'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium mb-2">
            {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
          </p>
          <p className="text-gray-400 text-sm">
            Supports: PNG, JPG, WEBP, GIF
          </p>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
            >
              {/* Image */}
              <img
                src={image.image_url}
                alt={`Grid image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleToggleActive(image)}
                  className={`p-2 rounded-full transition-colors ${
                    image.is_active
                      ? 'bg-[#78BE20] text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                  title={image.is_active ? 'Active' : 'Inactive'}
                >
                  {image.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Position indicator */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>

              {/* Inactive overlay */}
              {!image.is_active && (
                <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Inactive</span>
                </div>
              )}
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 21 - images.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div>
            Total: {images.length} / 21 slots
          </div>
          <div>
            Active: {images.filter(img => img.is_active).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroGridManager;

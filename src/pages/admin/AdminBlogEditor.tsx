import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  GripVertical,
  Type,
  Image,
  Quote,
  Info,
  Table,
  List,
  Columns,
  Grid,
  Megaphone,
  MoreVertical,
  FileText,
  Coffee,
  Star,
  Save,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { blogPosts, caseStudies } from '../../lib/blog-data';
import { blogCategories, BlogCategory, ContentBlockType } from '../../lib/blog-types';

// Block template definitions
const blockTemplates: {
  type: ContentBlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { type: 'text', label: 'Text Block', icon: <Type className="w-5 h-5" />, description: 'Paragraph text with rich formatting' },
  { type: 'heading', label: 'Heading', icon: <Type className="w-5 h-5 font-bold" />, description: 'Section headings (H2, H3, H4)' },
  { type: 'image', label: 'Image', icon: <Image className="w-5 h-5" />, description: 'Full-width or inline images' },
  { type: 'quote', label: 'Quote', icon: <Quote className="w-5 h-5" />, description: 'Pull quote with attribution' },
  { type: 'info-box', label: 'Info Box', icon: <Info className="w-5 h-5" />, description: 'Highlighted tip or important info' },
  { type: 'table', label: 'Table', icon: <Table className="w-5 h-5" />, description: 'Data table with headers' },
  { type: 'list', label: 'List', icon: <List className="w-5 h-5" />, description: 'Bullet or numbered list' },
  { type: 'two-column', label: 'Two Column', icon: <Columns className="w-5 h-5" />, description: 'Side-by-side content layout' },
  { type: 'gallery', label: 'Gallery', icon: <Grid className="w-5 h-5" />, description: 'Image gallery grid' },
  { type: 'cta', label: 'Call to Action', icon: <Megaphone className="w-5 h-5" />, description: 'Button with heading and text' },
];

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'case-studies'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<BlogCategory | 'all'>('all');
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);

  // Combined items for display
  const allItems = useMemo(() => {
    if (activeTab === 'posts') {
      return blogPosts.map(post => ({
        id: post.id,
        title: post.title,
        type: 'post' as const,
        category: post.category,
        publishedAt: post.publishedAt,
        featured: post.featured,
        author: post.author.name,
        slug: post.slug,
      }));
    } else {
      return caseStudies.map(study => ({
        id: study.id,
        title: study.title,
        type: 'case-study' as const,
        category: 'case-studies' as const,
        publishedAt: study.publishedAt,
        featured: false,
        author: 'Team',
        slug: study.slug,
      }));
    }
  }, [activeTab]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allItems, searchQuery, filterCategory]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryLabel = (category: string) => {
    const cat = blogCategories.find(c => c.value === category);
    return cat?.label || category;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Blog & Case Studies</h1>
          <p className="text-gray-500 mt-1">Create and manage blog posts and case studies</p>
        </div>
        <button
          onClick={() => setShowBlockPicker(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#64a70b] text-white rounded-xl font-semibold hover:bg-[#578f09] transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New {activeTab === 'posts' ? 'Post' : 'Case Study'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'posts'
              ? 'bg-[#183028] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Blog Posts ({blogPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('case-studies')}
          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'case-studies'
              ? 'bg-[#183028] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Case Studies ({caseStudies.length})
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as BlogCategory | 'all')}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none"
          >
            <option value="all">All Categories</option>
            {blogCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Author</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#183028' }}
                    >
                      {item.type === 'post' ? (
                        <FileText className="w-5 h-5 text-[#64a70b]" />
                      ) : (
                        <Coffee className="w-5 h-5 text-[#64a70b]" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-sm text-gray-500">/{item.type === 'post' ? 'blog' : 'case-study'}/{item.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#64a70b]/10 text-[#64a70b]">
                    {getCategoryLabel(item.category)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.author}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.publishedAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.featured && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <Star className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Published
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={item.type === 'post' ? `/blog/${item.slug}` : `/case-study/${item.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEditingPost(item.id)}
                      className="p-2 rounded-lg hover:bg-[#64a70b]/10 text-gray-500 hover:text-[#64a70b] transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="px-6 py-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No {activeTab === 'posts' ? 'blog posts' : 'case studies'} found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Block Template Picker Modal */}
      <AnimatePresence>
        {showBlockPicker && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBlockPicker(false)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New {activeTab === 'posts' ? 'Blog Post' : 'Case Study'}</h2>
                  <p className="text-sm text-gray-500 mt-1">Choose content blocks to build your page</p>
                </div>
                <button
                  onClick={() => setShowBlockPicker(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Available Content Blocks</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {blockTemplates.map((block) => (
                      <button
                        key={block.type}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#64a70b] hover:bg-[#64a70b]/5 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#183028] flex items-center justify-center text-[#64a70b] mb-3 group-hover:scale-110 transition-transform">
                          {block.icon}
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{block.label}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{block.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Post Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        placeholder="Enter post title..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none">
                        {blogCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                      <textarea
                        placeholder="Brief description for the blog list..."
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowBlockPicker(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#64a70b] text-white rounded-lg font-semibold hover:bg-[#578f09] transition-colors">
                  <Save className="w-4 h-4" />
                  Create Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Card */}
      <div className="mt-8 bg-gradient-to-br from-[#183028] to-[#2d5a47] rounded-xl p-6 text-white">
        <h3 className="font-bold text-lg mb-3">How Template Blocks Work</h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
              <Plus className="w-4 h-4" />
            </div>
            <h4 className="font-semibold mb-1">Add Blocks</h4>
            <p className="text-white/70">Choose from 10 different content block types to build your post structure</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
              <GripVertical className="w-4 h-4" />
            </div>
            <h4 className="font-semibold mb-1">Drag & Reorder</h4>
            <p className="text-white/70">Easily rearrange blocks by dragging them to change the order</p>
          </div>
          <div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="font-semibold mb-1">Preview</h4>
            <p className="text-white/70">See exactly how your post will look before publishing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;

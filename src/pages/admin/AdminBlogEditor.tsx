import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronDown,
  FileText,
  Coffee,
  Star,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { blogCategories, BlogCategory } from '../../lib/blog-types';
import BlogPostEditor from '../../components/admin/BlogPostEditor';
import CaseStudyEditor from '../../components/admin/CaseStudyEditor';

// API configuration
const API_BASE = process.env.NODE_ENV === 'production'
  ? '/api/blog'
  : '/.netlify/functions/blog';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  iconName?: string;
  authorId?: string;
  author?: { id: string; name: string; role?: string };
  publishedAt?: string;
  updatedAt: string;
  readTime: number;
  featured: boolean;
  status: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  clientName: string;
  clientLocation?: string;
  industry?: string;
  tags: string[];
  status: string;
  publishedAt?: string;
  updatedAt: string;
}

type EditorMode = 'list' | 'new-post' | 'edit-post' | 'new-case-study' | 'edit-case-study';

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'case-studies'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<BlogCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Data state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor state
  const [editorMode, setEditorMode] = useState<EditorMode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'post' | 'case-study'; id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const [postsRes, caseStudiesRes] = await Promise.all([
        fetch(`${API_BASE}/admin/posts`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/admin/case-studies`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const postsData = await postsRes.json();
      const caseStudiesData = await caseStudiesRes.json();

      if (postsData.success) {
        setPosts(postsData.posts);
      }
      if (caseStudiesData.success) {
        setCaseStudies(caseStudiesData.caseStudies);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    const token = getAuthToken();

    try {
      const endpoint = deleteConfirm.type === 'post'
        ? `${API_BASE}/admin/posts/${deleteConfirm.id}`
        : `${API_BASE}/admin/case-studies/${deleteConfirm.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        if (deleteConfirm.type === 'post') {
          setPosts(prev => prev.filter(p => p.id !== deleteConfirm.id));
        } else {
          setCaseStudies(prev => prev.filter(cs => cs.id !== deleteConfirm.id));
        }
        setDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete');
      }
    } catch (err) {
      setError('Failed to delete');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchQuery, filterCategory, filterStatus]);

  // Filter case studies
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter(cs => {
      const matchesSearch = cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || cs.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [caseStudies, searchQuery, filterStatus]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Not published';
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

  const handleEditorClose = () => {
    setEditorMode('list');
    setEditingId(null);
    fetchData(); // Refresh data
  };

  // Render editor if in edit/create mode
  if (editorMode === 'new-post') {
    return (
      <BlogPostEditor
        onSave={handleEditorClose}
        onCancel={handleEditorClose}
      />
    );
  }

  if (editorMode === 'edit-post' && editingId) {
    return (
      <BlogPostEditor
        postId={editingId}
        onSave={handleEditorClose}
        onCancel={handleEditorClose}
      />
    );
  }

  if (editorMode === 'new-case-study') {
    return (
      <CaseStudyEditor
        onSave={handleEditorClose}
        onCancel={handleEditorClose}
      />
    );
  }

  if (editorMode === 'edit-case-study' && editingId) {
    return (
      <CaseStudyEditor
        caseStudyId={editingId}
        onSave={handleEditorClose}
        onCancel={handleEditorClose}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Blog & Case Studies</h1>
          <p className="text-gray-500 mt-1">Create and manage blog posts and case studies</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setEditorMode(activeTab === 'posts' ? 'new-post' : 'new-case-study')}
            className="flex items-center gap-2 px-5 py-3 bg-[#64a70b] text-white rounded-xl font-semibold hover:bg-[#578f09] transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New {activeTab === 'posts' ? 'Post' : 'Case Study'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
          Blog Posts ({posts.length})
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
            placeholder={activeTab === 'posts' ? 'Search posts...' : 'Search case studies...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none"
          />
        </div>

        {activeTab === 'posts' && (
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
        )}

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
            className="px-4 pr-8 py-2.5 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#64a70b]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {activeTab === 'posts' ? (
            // Posts Table
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
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#183028' }}
                        >
                          <FileText className="w-5 h-5 text-[#64a70b]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-sm text-gray-500">/blog/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#64a70b]/10 text-[#64a70b]">
                        {getCategoryLabel(post.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.author?.name || 'No author'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(post.publishedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingId(post.id);
                            setEditorMode('edit-post');
                          }}
                          className="p-2 rounded-lg hover:bg-[#64a70b]/10 text-gray-500 hover:text-[#64a70b] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'post', id: post.id, title: post.title })}
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
          ) : (
            // Case Studies Table
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Industry</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCaseStudies.map((cs) => (
                  <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#183028' }}
                        >
                          <Coffee className="w-5 h-5 text-[#64a70b]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{cs.title}</p>
                          <p className="text-sm text-gray-500">/case-study/{cs.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cs.clientName}</p>
                        {cs.clientLocation && (
                          <p className="text-sm text-gray-500">{cs.clientLocation}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cs.industry || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(cs.publishedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cs.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {cs.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/case-study/${cs.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingId(cs.id);
                            setEditorMode('edit-case-study');
                          }}
                          className="p-2 rounded-lg hover:bg-[#64a70b]/10 text-gray-500 hover:text-[#64a70b] transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'case-study', id: cs.id, title: cs.title })}
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
          )}

          {/* Empty State */}
          {((activeTab === 'posts' && filteredPosts.length === 0) ||
            (activeTab === 'case-studies' && filteredCaseStudies.length === 0)) && (
            <div className="px-6 py-16 text-center">
              {activeTab === 'posts' ? (
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              ) : (
                <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              )}
              <p className="text-gray-500 font-medium">
                No {activeTab === 'posts' ? 'blog posts' : 'case studies'} found
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : `Click "New ${activeTab === 'posts' ? 'Post' : 'Case Study'}" to create one`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete {deleteConfirm.type === 'post' ? 'Post' : 'Case Study'}</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{deleteConfirm.title}</strong>"?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogEditor;

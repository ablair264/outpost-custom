import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Calendar,
  Package,
  Clock,
  TrendingUp,
  Inbox,
  FileCheck,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Loader2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { getEnquiries, getEnquiryCounts, ClothingEnquiry } from '../../lib/enquiry-service';

// Status configuration with colors
const statusConfig: Record<string, { color: string; bgColor: string; label: string; icon: React.ReactNode }> = {
  new: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', label: 'New', icon: <Inbox className="w-3.5 h-3.5" /> },
  in_progress: { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)', label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" /> },
  quoted: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Quoted', icon: <FileCheck className="w-3.5 h-3.5" /> },
  approved: { color: '#64a70b', bgColor: 'rgba(100, 167, 11, 0.1)', label: 'Approved', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  in_production: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', label: 'In Production', icon: <Package className="w-3.5 h-3.5" /> },
  completed: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', label: 'Cancelled', icon: <XCircle className="w-3.5 h-3.5" /> },
};

// Quality tier colors
const qualityColors: Record<string, string> = {
  excellent: '#22c55e',
  good: '#64a70b',
  acceptable: '#f59e0b',
  low: '#ef4444',
};

const PAGE_SIZE = 12;

const ClothingEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<ClothingEnquiry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [enquiriesData, countsData] = await Promise.all([
        getEnquiries(),
        getEnquiryCounts(),
      ]);
      setEnquiries(enquiriesData);
      setCounts(countsData);
    } catch (err) {
      setError('Failed to load enquiries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort enquiries
  const filteredEnquiries = enquiries
    .filter((e) => {
      // Status filter
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          e.customer_name?.toLowerCase().includes(query) ||
          e.customer_email?.toLowerCase().includes(query) ||
          e.product_name?.toLowerCase().includes(query) ||
          e.id?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.status.localeCompare(b.status);
    });

  // Pagination
  const totalPages = Math.ceil(filteredEnquiries.length / PAGE_SIZE);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Export to CSV
  const handleExport = () => {
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'Product', 'Status', 'Created'];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      e.customer_name,
      e.customer_email,
      e.customer_phone,
      e.product_name || '',
      e.status,
      new Date(e.created_at).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clothing-enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // Metrics cards data
  const metrics = [
    {
      label: 'Total Enquiries',
      value: counts.total || 0,
      icon: <Inbox className="w-6 h-6" />,
      color: '#64a70b',
    },
    {
      label: 'New',
      value: counts.new || 0,
      icon: <AlertCircle className="w-6 h-6" />,
      color: '#3b82f6',
    },
    {
      label: 'In Progress',
      value: counts.in_progress || 0,
      icon: <Clock className="w-6 h-6" />,
      color: '#8b5cf6',
    },
    {
      label: 'Quoted',
      value: counts.quoted || 0,
      icon: <FileCheck className="w-6 h-6" />,
      color: '#f59e0b',
    },
    {
      label: 'Approved',
      value: counts.approved || 0,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: '#64a70b',
    },
    {
      label: 'Conversion',
      value: counts.total ? `${Math.round(((counts.approved || 0) / counts.total) * 100)}%` : '0%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#10b981',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#64a70b] animate-spin" />
          <p className="text-gray-600 neuzeit-font">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Hearns', sans-serif" }}>
            Clothing Enquiries
          </h1>
          <p className="text-gray-600 text-sm neuzeit-font mt-1">
            Manage custom clothing and branded workwear requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors neuzeit-font text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#64a70b] text-white hover:bg-[#578f09] transition-colors neuzeit-font text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              if (metric.label !== 'Total Enquiries' && metric.label !== 'Conversion') {
                setStatusFilter(metric.label.toLowerCase().replace(' ', '_'));
                setCurrentPage(1);
              }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <div style={{ color: metric.color }}>{metric.icon}</div>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 neuzeit-font">{metric.value}</p>
            <p className="text-xs text-gray-500 neuzeit-font mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or product..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] bg-white"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid' ? 'bg-[#64a70b] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list' ? 'bg-[#64a70b] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 neuzeit-font text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEnquiries.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 neuzeit-font mb-2">No enquiries found</h3>
          <p className="text-gray-500 text-sm neuzeit-font">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'New enquiries will appear here when customers submit requests'}
          </p>
        </div>
      )}

      {/* Enquiries Grid/List */}
      {filteredEnquiries.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  onClick={() => navigate(`/admin/clothing-enquiries/${enquiry.id}`)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500">
                        #{enquiry.id.slice(0, 8)}
                      </span>
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusConfig[enquiry.status]?.bgColor,
                          color: statusConfig[enquiry.status]?.color,
                        }}
                      >
                        {statusConfig[enquiry.status]?.icon}
                        {statusConfig[enquiry.status]?.label}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 neuzeit-font truncate">
                      {enquiry.customer_name}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Product */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {enquiry.product_image_url ? (
                          <img
                            src={enquiry.product_image_url}
                            alt={enquiry.product_name || ''}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate neuzeit-font">
                          {enquiry.product_name || 'No product specified'}
                        </p>
                        {enquiry.product_style_code && (
                          <p className="text-xs text-gray-500">{enquiry.product_style_code}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{enquiry.customer_email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{enquiry.customer_phone}</span>
                      </div>
                    </div>

                    {/* Logo Quality */}
                    {enquiry.logo_quality_tier && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Logo Quality:</span>
                        <span
                          className="text-xs font-medium capitalize"
                          style={{ color: qualityColors[enquiry.logo_quality_tier] }}
                        >
                          {enquiry.logo_quality_tier}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(enquiry.created_at)}
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Logo
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Created
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedEnquiries.map((enquiry) => (
                      <tr
                        key={enquiry.id}
                        onClick={() => navigate(`/admin/clothing-enquiries/${enquiry.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{enquiry.customer_name}</p>
                            <p className="text-xs text-gray-500">{enquiry.customer_email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-900">{enquiry.product_name || '-'}</p>
                          {enquiry.product_style_code && (
                            <p className="text-xs text-gray-500">{enquiry.product_style_code}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: statusConfig[enquiry.status]?.bgColor,
                              color: statusConfig[enquiry.status]?.color,
                            }}
                          >
                            {statusConfig[enquiry.status]?.icon}
                            {statusConfig[enquiry.status]?.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {enquiry.logo_quality_tier ? (
                            <span
                              className="text-xs font-medium capitalize"
                              style={{ color: qualityColors[enquiry.logo_quality_tier] }}
                            >
                              {enquiry.logo_quality_tier}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{formatDate(enquiry.created_at)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 neuzeit-font">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, filteredEnquiries.length)} of{' '}
                {filteredEnquiries.length} enquiries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 neuzeit-font min-w-[100px] text-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClothingEnquiries;

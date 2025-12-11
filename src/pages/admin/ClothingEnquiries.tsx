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
import { enquiriesApi, ClothingEnquiry, EnquiryCounts } from '../../lib/api';

// Status configuration with colors (purple theme)
const statusConfig: Record<string, { color: string; bgColor: string; label: string; icon: React.ReactNode }> = {
  new: { color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', label: 'New', icon: <Inbox className="w-3.5 h-3.5" /> },
  in_progress: { color: '#c4b5fd', bgColor: 'rgba(196, 181, 253, 0.15)', label: 'In Progress', icon: <Clock className="w-3.5 h-3.5" /> },
  quoted: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', label: 'Quoted', icon: <FileCheck className="w-3.5 h-3.5" /> },
  approved: { color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', label: 'Approved', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  in_production: { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)', label: 'In Production', icon: <Package className="w-3.5 h-3.5" /> },
  completed: { color: '#c084fc', bgColor: 'rgba(192, 132, 252, 0.15)', label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.15)', label: 'Cancelled', icon: <XCircle className="w-3.5 h-3.5" /> },
};

// Quality tier colors (purple theme)
const qualityColors: Record<string, string> = {
  excellent: '#c084fc',
  good: '#a78bfa',
  acceptable: '#f59e0b',
  low: '#ef4444',
};

const PAGE_SIZE = 12;

const ClothingEnquiries: React.FC = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<ClothingEnquiry[]>([]);
  const [counts, setCounts] = useState<EnquiryCounts>({
    new: 0, in_progress: 0, quoted: 0, approved: 0, in_production: 0, completed: 0, cancelled: 0, total: 0
  });
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
        enquiriesApi.getAll(),
        enquiriesApi.getCounts(),
      ]);
      setEnquiries(enquiriesData.enquiries);
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
          e.customerName?.toLowerCase().includes(query) ||
          e.customerEmail?.toLowerCase().includes(query) ||
          e.productName?.toLowerCase().includes(query) ||
          e.id?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
      e.customerName,
      e.customerEmail,
      e.customerPhone,
      e.productName || '',
      e.status,
      new Date(e.createdAt).toLocaleDateString(),
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
      color: '#8b5cf6',
    },
    {
      label: 'New',
      value: counts.new || 0,
      icon: <AlertCircle className="w-6 h-6" />,
      color: '#a78bfa',
    },
    {
      label: 'In Progress',
      value: counts.in_progress || 0,
      icon: <Clock className="w-6 h-6" />,
      color: '#c4b5fd',
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
      color: '#a78bfa',
    },
    {
      label: 'Conversion',
      value: counts.total ? `${Math.round(((counts.approved || 0) / counts.total) * 100)}%` : '0%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#c084fc',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          <p className="text-gray-300 neuzeit-font">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}>
            Enquiries
          </h1>
          <p className="text-gray-400 text-sm neuzeit-font mt-1">
            Manage custom clothing and branded workwear requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2a2440] border border-purple-500/20 text-gray-300 hover:bg-[#3d3456] transition-colors neuzeit-font text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors neuzeit-font text-sm"
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
            className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer"
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
                style={{ backgroundColor: `${metric.color}20` }}
              >
                <div style={{ color: metric.color }}>{metric.icon}</div>
              </div>
            </div>
            <p className="text-2xl font-bold text-white neuzeit-font">{metric.value}</p>
            <p className="text-xs text-gray-400 neuzeit-font mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, or product..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1e1a2e] border border-purple-500/20 text-gray-200 placeholder-gray-500 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 rounded-lg bg-[#1e1a2e] border border-purple-500/20 text-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
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
            className="px-3 py-2.5 rounded-lg bg-[#1e1a2e] border border-purple-500/20 text-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border border-purple-500/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-[#1e1a2e] text-gray-400 hover:bg-[#2a2440]'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-[#1e1a2e] text-gray-400 hover:bg-[#2a2440]'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300 neuzeit-font text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEnquiries.length === 0 && (
        <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl p-12 border border-purple-500/10 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white neuzeit-font mb-2">No enquiries found</h3>
          <p className="text-gray-400 text-sm neuzeit-font">
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
                  onClick={() => navigate(`/admin/enquiries/${enquiry.id}`)}
                  className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-purple-500/10">
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
                    <h3 className="font-semibold text-white neuzeit-font truncate">
                      {enquiry.customerName}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Product */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#1e1a2e] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {enquiry.productImageUrl ? (
                          <img
                            src={enquiry.productImageUrl}
                            alt={enquiry.productName || ''}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate neuzeit-font">
                          {enquiry.productName || 'No product specified'}
                        </p>
                        {enquiry.productStyleCode && (
                          <p className="text-xs text-gray-500">{enquiry.productStyleCode}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        <span className="truncate">{enquiry.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        <span>{enquiry.customerPhone}</span>
                      </div>
                    </div>

                    {/* Logo Quality */}
                    {enquiry.logoQualityTier && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Logo Quality:</span>
                        <span
                          className="text-xs font-medium capitalize"
                          style={{ color: qualityColors[enquiry.logoQualityTier] }}
                        >
                          {enquiry.logoQualityTier}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-[#1e1a2e]/50 border-t border-purple-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(enquiry.createdAt)}
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-purple-500/20 transition-colors opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1e1a2e]/50 border-b border-purple-500/10">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Logo
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Created
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    {paginatedEnquiries.map((enquiry) => (
                      <tr
                        key={enquiry.id}
                        onClick={() => navigate(`/admin/enquiries/${enquiry.id}`)}
                        className="hover:bg-purple-500/5 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-200 text-sm">{enquiry.customerName}</p>
                            <p className="text-xs text-gray-500">{enquiry.customerEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-300">{enquiry.productName || '-'}</p>
                          {enquiry.productStyleCode && (
                            <p className="text-xs text-gray-500">{enquiry.productStyleCode}</p>
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
                          {enquiry.logoQualityTier ? (
                            <span
                              className="text-xs font-medium capitalize"
                              style={{ color: qualityColors[enquiry.logoQualityTier] }}
                            >
                              {enquiry.logoQualityTier}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-400">{formatDate(enquiry.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 rounded-lg hover:bg-purple-500/20 transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
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
              <p className="text-sm text-gray-400 neuzeit-font">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, filteredEnquiries.length)} of{' '}
                {filteredEnquiries.length} enquiries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-purple-500/20 bg-[#2a2440] text-gray-300 hover:bg-[#3d3456] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 neuzeit-font min-w-[100px] text-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-purple-500/20 bg-[#2a2440] text-gray-300 hover:bg-[#3d3456] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Package,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileCheck,
  Inbox,
  Palette,
  Ruler,
  FileText,
  Hash,
  MapPin
} from 'lucide-react';
import {
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  getEnquiryNotes,
  ClothingEnquiry,
  EnquiryNote
} from '../../lib/enquiry-service';
import { useAuth } from '../../contexts/AuthContext';

// Status configuration
const statusConfig: Record<string, { color: string; bgColor: string; label: string; icon: React.ReactNode }> = {
  new: { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', label: 'New', icon: <Inbox className="w-4 h-4" /> },
  in_progress: { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)', label: 'In Progress', icon: <Clock className="w-4 h-4" /> },
  quoted: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Quoted', icon: <FileCheck className="w-4 h-4" /> },
  approved: { color: '#64a70b', bgColor: 'rgba(100, 167, 11, 0.1)', label: 'Approved', icon: <CheckCircle2 className="w-4 h-4" /> },
  in_production: { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', label: 'In Production', icon: <Package className="w-4 h-4" /> },
  completed: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> },
};

// Quality tier colors
const qualityColors: Record<string, { color: string; label: string }> = {
  excellent: { color: '#22c55e', label: 'Excellent' },
  good: { color: '#64a70b', label: 'Good' },
  acceptable: { color: '#f59e0b', label: 'Acceptable' },
  low: { color: '#ef4444', label: 'Low Quality' },
};

const ClothingEnquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adminUser } = useAuth();

  const [enquiry, setEnquiry] = useState<ClothingEnquiry | null>(null);
  const [notes, setNotes] = useState<EnquiryNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      loadEnquiry();
    }
  }, [id]);

  const loadEnquiry = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const [enquiryData, notesData] = await Promise.all([
        getEnquiryById(id),
        getEnquiryNotes(id),
      ]);
      setEnquiry(enquiryData);
      setNotes(notesData);
    } catch (err) {
      setError('Failed to load enquiry details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!enquiry || !adminUser) return;

    setUpdatingStatus(true);
    try {
      await updateEnquiryStatus(enquiry.id, newStatus, adminUser.id);
      setEnquiry({ ...enquiry, status: newStatus });
      // Reload notes to show the status change activity
      const notesData = await getEnquiryNotes(enquiry.id);
      setNotes(notesData);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!enquiry || !adminUser || !newNote.trim()) return;

    setSubmittingNote(true);
    try {
      await addEnquiryNote(enquiry.id, newNote.trim(), adminUser.id);
      setNewNote('');
      // Reload notes
      const notesData = await getEnquiryNotes(enquiry.id);
      setNotes(notesData);
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRelative = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#64a70b] animate-spin" />
          <p className="text-gray-600 neuzeit-font">Loading enquiry...</p>
        </div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="p-8">
        <button
          onClick={() => navigate('/admin/clothing-enquiries')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 neuzeit-font"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Enquiries
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-700 font-semibold">Error Loading Enquiry</p>
            <p className="text-red-600 text-sm">{error || 'Enquiry not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/clothing-enquiries')}
            className="p-2 rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Hearns', sans-serif" }}>
                Enquiry Details
              </h1>
              <span className="text-sm font-mono text-gray-500">#{enquiry.id.slice(0, 8)}</span>
            </div>
            <p className="text-gray-600 text-sm neuzeit-font mt-1">
              Submitted {formatDate(enquiry.created_at)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: statusConfig[enquiry.status]?.bgColor,
            color: statusConfig[enquiry.status]?.color,
          }}
        >
          {statusConfig[enquiry.status]?.icon}
          {statusConfig[enquiry.status]?.label}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Enquiry Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900 neuzeit-font flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Customer Information
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Name</label>
                  <p className="text-gray-900 font-medium neuzeit-font mt-1">{enquiry.customer_name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Company</label>
                  <p className="text-gray-900 neuzeit-font mt-1">{enquiry.company_name || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</label>
                    <a
                      href={`mailto:${enquiry.customer_email}`}
                      className="block text-gray-900 hover:text-[#64a70b] neuzeit-font mt-0.5"
                    >
                      {enquiry.customer_email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Phone</label>
                    <a
                      href={`tel:${enquiry.customer_phone}`}
                      className="block text-gray-900 hover:text-[#64a70b] neuzeit-font mt-0.5"
                    >
                      {enquiry.customer_phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900 neuzeit-font flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Product Details
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-5">
                {/* Product Image */}
                <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {enquiry.product_image_url ? (
                    <img
                      src={enquiry.product_image_url}
                      alt={enquiry.product_name || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 neuzeit-font">
                      {enquiry.product_name || 'No product specified'}
                    </h3>
                    {enquiry.product_style_code && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Hash className="w-3.5 h-3.5" />
                        {enquiry.product_style_code}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {enquiry.product_color && (
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{enquiry.product_color}</span>
                      </div>
                    )}
                    {enquiry.quantity && (
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Qty: {enquiry.quantity}</span>
                      </div>
                    )}
                  </div>

                  {enquiry.sizes && Object.keys(enquiry.sizes).length > 0 && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Sizes</label>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {Object.entries(enquiry.sizes).map(([size, qty]) => (
                          <span
                            key={size}
                            className="px-2.5 py-1 bg-gray-100 rounded-md text-sm text-gray-700 neuzeit-font"
                          >
                            {size}: {qty as number}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Logo Info Card */}
          {(enquiry.logo_file_url || enquiry.logo_quality_tier) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900 neuzeit-font flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  Logo Details
                </h2>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Logo Preview */}
                  {enquiry.logo_file_url && (
                    <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50">
                      <img
                        src={enquiry.logo_file_url}
                        alt="Customer Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Logo Analysis */}
                  <div className="flex-1 space-y-4">
                    {/* Quality Tier */}
                    {enquiry.logo_quality_tier && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Quality Assessment</label>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${qualityColors[enquiry.logo_quality_tier]?.color}15`,
                              color: qualityColors[enquiry.logo_quality_tier]?.color,
                            }}
                          >
                            {qualityColors[enquiry.logo_quality_tier]?.label}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Logo Dimensions */}
                    {(enquiry.logo_width && enquiry.logo_height) && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Dimensions</label>
                        <p className="text-gray-700 neuzeit-font mt-1">
                          {enquiry.logo_width} x {enquiry.logo_height}px
                        </p>
                      </div>
                    )}

                    {/* Placement */}
                    {enquiry.logo_placement && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Placement</label>
                        <div className="flex items-center gap-2 mt-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 capitalize">{enquiry.logo_placement}</span>
                        </div>
                      </div>
                    )}

                    {/* Download Button */}
                    {enquiry.logo_file_url && (
                      <a
                        href={enquiry.logo_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors neuzeit-font"
                      >
                        <Download className="w-4 h-4" />
                        Download Original
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes from Customer */}
          {enquiry.additional_notes && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-semibold text-gray-900 neuzeit-font flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Customer Notes
                </h2>
              </div>
              <div className="p-5">
                <p className="text-gray-700 whitespace-pre-wrap neuzeit-font">{enquiry.additional_notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900 neuzeit-font">Quick Actions</h2>
            </div>
            <div className="p-5 space-y-4">
              {/* Status Dropdown */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold block mb-2">
                  Update Status
                </label>
                <select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] bg-white disabled:opacity-50"
                >
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={`mailto:${enquiry.customer_email}?subject=RE: Clothing Enquiry #${enquiry.id.slice(0, 8)}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#64a70b] text-white hover:bg-[#578f09] transition-colors neuzeit-font text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Email Customer
                </a>
                <a
                  href={`tel:${enquiry.customer_phone}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors neuzeit-font text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Customer
                </a>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900 neuzeit-font flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Activity
              </h2>
            </div>
            <div className="p-5">
              {/* Add Note Form */}
              <div className="mb-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || submittingNote}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm neuzeit-font transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingNote ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Add Note
                </button>
              </div>

              {/* Timeline */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No activity yet</p>
                ) : (
                  notes.map((note, index) => (
                    <div key={note.id} className="relative pl-6">
                      {/* Timeline line */}
                      {index < notes.length - 1 && (
                        <div className="absolute left-[7px] top-6 w-0.5 h-full bg-gray-200" />
                      )}
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                          note.note_type === 'status_change'
                            ? 'bg-[#64a70b] border-[#64a70b]'
                            : 'bg-white border-gray-300'
                        }`}
                      />
                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">
                            {formatDateRelative(note.created_at)}
                          </span>
                          {note.note_type === 'status_change' && (
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                              Status Change
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 neuzeit-font">{note.content}</p>
                        {note.created_by_name && (
                          <p className="text-xs text-gray-400 mt-1">by {note.created_by_name}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Enquiry Meta */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-900 neuzeit-font">Enquiry Info</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">{formatDate(enquiry.created_at)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-900">{formatDate(enquiry.updated_at)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Enquiry ID</span>
                <span className="text-gray-900 font-mono text-xs">{enquiry.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingEnquiryDetail;

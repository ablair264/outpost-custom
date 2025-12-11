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
import { enquiriesApi, ClothingEnquiry, EnquiryNote } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

// Status configuration - purple theme
const statusConfig: Record<string, { color: string; bgColor: string; label: string; icon: React.ReactNode }> = {
  new: { color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', label: 'New', icon: <Inbox className="w-4 h-4" /> },
  in_progress: { color: '#c4b5fd', bgColor: 'rgba(196, 181, 253, 0.15)', label: 'In Progress', icon: <Clock className="w-4 h-4" /> },
  quoted: { color: '#e9d5ff', bgColor: 'rgba(233, 213, 255, 0.15)', label: 'Quoted', icon: <FileCheck className="w-4 h-4" /> },
  approved: { color: '#a78bfa', bgColor: 'rgba(167, 139, 250, 0.15)', label: 'Approved', icon: <CheckCircle2 className="w-4 h-4" /> },
  in_production: { color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)', label: 'In Production', icon: <Package className="w-4 h-4" /> },
  completed: { color: '#7c3aed', bgColor: 'rgba(124, 58, 237, 0.15)', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.15)', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> },
};

// Quality tier colors - purple theme
const qualityColors: Record<string, { color: string; label: string }> = {
  excellent: { color: '#a78bfa', label: 'Excellent' },
  good: { color: '#8b5cf6', label: 'Good' },
  acceptable: { color: '#c4b5fd', label: 'Acceptable' },
  low: { color: '#ef4444', label: 'Low Quality' },
};

const ClothingEnquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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
      const enquiryData = await enquiriesApi.getById(id);
      setEnquiry(enquiryData);
      setNotes(enquiryData?.notes || []);
    } catch (err) {
      setError('Failed to load enquiry details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!enquiry || !user) return;

    setUpdatingStatus(true);
    try {
      await enquiriesApi.updateStatus(enquiry.id, newStatus);
      setEnquiry({ ...enquiry, status: newStatus });
      // Reload enquiry to get updated notes
      const updatedEnquiry = await enquiriesApi.getById(enquiry.id);
      setNotes(updatedEnquiry?.notes || []);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!enquiry || !user || !newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const note = await enquiriesApi.addNote(enquiry.id, newNote.trim());
      if (note) {
        setNewNote('');
        setNotes([note, ...notes]);
      }
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
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          <p className="text-gray-400 neuzeit-font">Loading enquiry...</p>
        </div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="p-8">
        <button
          onClick={() => navigate('/admin/enquiries')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-6 neuzeit-font"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Enquiries
        </button>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <div>
            <p className="text-red-300 font-semibold">Error Loading Enquiry</p>
            <p className="text-red-400 text-sm">{error || 'Enquiry not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/enquiries')}
            className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Hearns', sans-serif" }}>
                Enquiry Details
              </h1>
              <span className="text-sm font-mono text-gray-500">#{enquiry.id.slice(0, 8)}</span>
            </div>
            <p className="text-gray-400 text-sm neuzeit-font mt-1">
              Submitted {formatDate(enquiry.createdAt)}
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
          <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
              <h2 className="font-semibold text-gray-200 neuzeit-font flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                Customer Information
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Name</label>
                  <p className="text-gray-200 font-medium neuzeit-font mt-1">{enquiry.customerName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Company</label>
                  <p className="text-gray-300 neuzeit-font mt-1">{enquiry.companyName || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Email</label>
                    <a
                      href={`mailto:${enquiry.customerEmail}`}
                      className="block text-gray-200 hover:text-purple-400 neuzeit-font mt-0.5"
                    >
                      {enquiry.customerEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Phone</label>
                    <a
                      href={`tel:${enquiry.customerPhone}`}
                      className="block text-gray-200 hover:text-purple-400 neuzeit-font mt-0.5"
                    >
                      {enquiry.customerPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
              <h2 className="font-semibold text-gray-200 neuzeit-font flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Product Details
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-5">
                {/* Product Image */}
                <div className="w-32 h-32 rounded-lg bg-[#1e1a2e] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {enquiry.productImageUrl ? (
                    <img
                      src={enquiry.productImageUrl}
                      alt={enquiry.productName || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-600" />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 neuzeit-font">
                      {enquiry.productName || 'No product specified'}
                    </h3>
                    {enquiry.productStyleCode && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Hash className="w-3.5 h-3.5" />
                        {enquiry.productStyleCode}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {enquiry.productColor && (
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">{enquiry.productColor}</span>
                      </div>
                    )}
                    {enquiry.quantity && (
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-300">Qty: {enquiry.quantity}</span>
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
                            className="px-2.5 py-1 bg-[#1e1a2e] border border-purple-500/20 rounded-md text-sm text-gray-300 neuzeit-font"
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
          {(enquiry.logoFileUrl || enquiry.logoQualityTier) && (
            <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
                <h2 className="font-semibold text-gray-200 neuzeit-font flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  Logo Details
                </h2>
              </div>
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Logo Preview */}
                  {enquiry.logoFileUrl && (
                    <div className="w-40 h-40 rounded-lg border-2 border-dashed border-purple-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 bg-[#1e1a2e]">
                      <img
                        src={enquiry.logoFileUrl}
                        alt="Customer Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Logo Analysis */}
                  <div className="flex-1 space-y-4">
                    {/* Quality Tier */}
                    {enquiry.logoQualityTier && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Quality Assessment</label>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="px-3 py-1.5 rounded-full text-sm font-medium"
                            style={{
                              backgroundColor: `${qualityColors[enquiry.logoQualityTier]?.color}15`,
                              color: qualityColors[enquiry.logoQualityTier]?.color,
                            }}
                          >
                            {qualityColors[enquiry.logoQualityTier]?.label}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Logo Dimensions */}
                    {(enquiry.logoWidth && enquiry.logoHeight) && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Dimensions</label>
                        <p className="text-gray-300 neuzeit-font mt-1">
                          {enquiry.logoWidth} x {enquiry.logoHeight}px
                        </p>
                      </div>
                    )}

                    {/* Download Button */}
                    {enquiry.logoFileUrl && (
                      <a
                        href={enquiry.logoFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e1a2e] border border-purple-500/20 hover:bg-purple-500/10 rounded-lg text-sm text-gray-300 transition-colors neuzeit-font"
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
          {enquiry.additionalNotes && (
            <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
                <h2 className="font-semibold text-gray-200 neuzeit-font flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Customer Notes
                </h2>
              </div>
              <div className="p-5">
                <p className="text-gray-300 whitespace-pre-wrap neuzeit-font">{enquiry.additionalNotes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
              <h2 className="font-semibold text-gray-200 neuzeit-font">Quick Actions</h2>
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
                  className="w-full px-4 py-2.5 rounded-lg bg-[#1e1a2e] border border-purple-500/20 text-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 disabled:opacity-50"
                >
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={`mailto:${enquiry.customerEmail}?subject=RE: Clothing Enquiry #${enquiry.id.slice(0, 8)}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors neuzeit-font text-sm font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Email Customer
                </a>
                <a
                  href={`tel:${enquiry.customerPhone}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-purple-500/20 text-gray-300 hover:bg-purple-500/10 transition-colors neuzeit-font text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Customer
                </a>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
              <h2 className="font-semibold text-gray-200 neuzeit-font flex items-center gap-2">
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
                  className="w-full px-4 py-3 rounded-lg bg-[#1e1a2e] border border-purple-500/20 text-gray-200 placeholder-gray-500 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || submittingNote}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e1a2e] border border-purple-500/20 hover:bg-purple-500/10 text-gray-300 text-sm neuzeit-font transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="absolute left-[7px] top-6 w-0.5 h-full bg-purple-500/20" />
                      )}
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                          note.noteType === 'status_change'
                            ? 'bg-purple-500 border-purple-500'
                            : 'bg-[#2a2440] border-purple-500/30'
                        }`}
                      />
                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500">
                            {formatDateRelative(note.createdAt)}
                          </span>
                          {note.noteType === 'status_change' && (
                            <span className="px-1.5 py-0.5 bg-purple-500/15 rounded text-xs text-purple-300">
                              Status Change
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 neuzeit-font">{note.content}</p>
                        {note.author?.name && (
                          <p className="text-xs text-gray-500 mt-1">by {note.author.name}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Enquiry Meta */}
          <div className="bg-[#2a2440]/50 backdrop-blur-sm rounded-xl border border-purple-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-500/10 bg-[#1e1a2e]/50">
              <h2 className="font-semibold text-gray-200 neuzeit-font">Enquiry Info</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-300">{formatDate(enquiry.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-300">{formatDate(enquiry.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Enquiry ID</span>
                <span className="text-gray-300 font-mono text-xs">{enquiry.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingEnquiryDetail;

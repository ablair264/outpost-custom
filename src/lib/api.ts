// API client for Netlify Functions
// Replaces direct Supabase calls with API endpoints

const API_BASE = '/.netlify/functions';

// Token management
let authToken: string | null = localStorage.getItem('admin_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// Generic fetch helper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ============================================
// AUTH API
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}

export const authApi = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AdminUser | null> {
    if (!authToken) return null;
    try {
      const data = await apiFetch<{ success: boolean; user: AdminUser }>('/auth/me');
      return data.user;
    } catch {
      setAuthToken(null);
      return null;
    }
  },

  // Logout
  logout() {
    setAuthToken(null);
  },

  // Setup initial admin (only works if no users exist)
  async setup(email: string, password: string, name?: string): Promise<LoginResponse> {
    try {
      const data = await apiFetch<LoginResponse>('/auth/setup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Setup failed',
      };
    }
  },

  // Create new admin user (requires admin)
  async createUser(
    email: string,
    password: string,
    name?: string,
    role: 'admin' | 'staff' = 'staff'
  ): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      return await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, role }),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
      };
    }
  },

  // Get all admin users (requires admin)
  async getUsers(): Promise<AdminUser[]> {
    try {
      const data = await apiFetch<{ success: boolean; users: AdminUser[] }>('/auth/users');
      return data.users;
    } catch {
      return [];
    }
  },

  // Update admin user (requires admin)
  async updateUser(
    id: string,
    updates: Partial<Pick<AdminUser, 'name' | 'role' | 'isActive'>>
  ): Promise<boolean> {
    try {
      await apiFetch(`/auth/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return true;
    } catch {
      return false;
    }
  },

  // Delete (deactivate) admin user (requires admin)
  async deleteUser(id: string): Promise<boolean> {
    try {
      await apiFetch(`/auth/users/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};

// ============================================
// ENQUIRIES API
// ============================================

export interface LogoPreviewCapture {
  cartItemId: string;
  productName: string;
  selectedColor: string;
  colorChanged: boolean;
  originalColor: string;
  logoPosition: { x: number; y: number; scale: number };
  previewImageUrl: string;
}

export interface ClothingEnquiry {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  assignedTo?: string;
  assignedUser?: { id: string; name: string | null; email: string };

  // Contact info
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;

  // Product info
  productId?: string;
  productName?: string;
  productStyleCode?: string;
  productColor?: string;
  productColorCode?: string;
  productImageUrl?: string;

  // Logo info
  logoFileName?: string;
  logoFileUrl?: string;
  logoFileSize?: number;
  logoFormat?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoQualityTier?: string;
  logoQualityNotes?: string[];
  logoHasTransparency?: boolean;

  // Placement
  logoPositionX?: number;
  logoPositionY?: number;
  logoSizePercent?: number;

  // Order details
  estimatedQuantity?: string;
  quantity?: number;
  sizes?: Record<string, number>;
  additionalNotes?: string;
  enquiryType: 'upload' | 'design_help' | 'consultation';

  // Quote info
  quoteAmount?: number;
  quoteNotes?: string;
  quoteSentAt?: string;

  source: string;

  // Logo preview captures
  logoPreviewCaptures?: LogoPreviewCapture[];

  // Relations
  notes?: EnquiryNote[];
}

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  createdAt: string;
  createdBy?: string;
  noteType: 'note' | 'status_change' | 'quote_sent' | 'customer_reply' | 'system';
  content: string;
  author?: { id: string; name: string | null };
}

export interface EnquiryCounts {
  new: number;
  in_progress: number;
  quoted: number;
  approved: number;
  in_production: number;
  completed: number;
  cancelled: number;
  total: number;
}

export const enquiriesApi = {
  // Submit new enquiry (public)
  async submit(data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    companyName?: string;
    productId?: string;
    productName?: string;
    productStyleCode?: string;
    productColor?: string;
    productColorCode?: string;
    productImageUrl?: string;
    logoFileUrl?: string;
    logoAnalysis?: {
      fileName: string;
      fileSize: number;
      format: string;
      width: number;
      height: number;
      hasTransparency: boolean;
      qualityTier: string;
      qualityNotes: string[];
    };
    logoPositionX?: number;
    logoPositionY?: number;
    logoSizePercent?: number;
    estimatedQuantity?: string;
    additionalNotes?: string;
    enquiryType: 'upload' | 'design_help' | 'consultation';
  }): Promise<{ success: boolean; enquiryId?: string; error?: string }> {
    try {
      return await apiFetch('/enquiries/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit enquiry',
      };
    }
  },

  // Get all enquiries (requires auth)
  async getAll(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ enquiries: ClothingEnquiry[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());

    const query = params.toString() ? `?${params}` : '';

    try {
      const data = await apiFetch<{
        success: boolean;
        enquiries: ClothingEnquiry[];
        total: number;
      }>(`/enquiries${query}`);
      return { enquiries: data.enquiries, total: data.total };
    } catch {
      return { enquiries: [], total: 0 };
    }
  },

  // Get single enquiry (requires auth)
  async getById(id: string): Promise<ClothingEnquiry | null> {
    try {
      const data = await apiFetch<{ success: boolean; enquiry: ClothingEnquiry }>(
        `/enquiries/${id}`
      );
      return data.enquiry;
    } catch {
      return null;
    }
  },

  // Get counts by status (requires auth)
  async getCounts(): Promise<EnquiryCounts> {
    try {
      const data = await apiFetch<{ success: boolean; counts: EnquiryCounts }>(
        '/enquiries/counts'
      );
      return data.counts;
    } catch {
      return {
        new: 0,
        in_progress: 0,
        quoted: 0,
        approved: 0,
        in_production: 0,
        completed: 0,
        cancelled: 0,
        total: 0,
      };
    }
  },

  // Update enquiry (requires auth)
  async update(
    id: string,
    data: {
      status?: string;
      assignedTo?: string | null;
      quoteAmount?: number;
      quoteNotes?: string;
      quoteSentAt?: string;
      addNote?: boolean;
    }
  ): Promise<boolean> {
    try {
      await apiFetch(`/enquiries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return true;
    } catch {
      return false;
    }
  },

  // Update status (convenience method)
  async updateStatus(id: string, status: string): Promise<boolean> {
    return this.update(id, { status });
  },

  // Add note to enquiry (requires auth)
  async addNote(
    enquiryId: string,
    content: string,
    noteType: EnquiryNote['noteType'] = 'note'
  ): Promise<EnquiryNote | null> {
    try {
      const data = await apiFetch<{ success: boolean; note: EnquiryNote }>(
        `/enquiries/${enquiryId}/notes`,
        {
          method: 'POST',
          body: JSON.stringify({ content, noteType }),
        }
      );
      return data.note;
    } catch {
      return null;
    }
  },

  // Get notes for enquiry (requires auth)
  async getNotes(enquiryId: string): Promise<EnquiryNote[]> {
    try {
      const data = await apiFetch<{ success: boolean; notes: EnquiryNote[] }>(
        `/enquiries/${enquiryId}/notes`
      );
      return data.notes;
    } catch {
      return [];
    }
  },
};

export default { auth: authApi, enquiries: enquiriesApi };

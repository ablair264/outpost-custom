// Auth Service - connects to Neon via Netlify Functions
// No longer uses Supabase Auth

const AUTH_API_BASE = '/.netlify/functions/auth';
const TOKEN_KEY = 'auth_token';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'staff';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// For compatibility with old code
export interface AuthState {
  user: AdminUser | null;
  adminUser: AdminUser | null;
  session: { token: string } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Helper for API calls
async function authApiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  includeToken = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeToken) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${AUTH_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Token storage helpers
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function removeStoredToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Get the stored auth token (for use in other API calls)
export function getAuthToken(): string | null {
  return getStoredToken();
}

// Sign in with email and password
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const response = await authApiFetch<{
      success: boolean;
      token: string;
      user: AdminUser;
      error?: string;
    }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      setStoredToken(response.token);
      return { success: true, user: response.user };
    }

    return { success: false, error: response.error || 'Login failed' };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Sign out
export async function signOut(): Promise<void> {
  removeStoredToken();
}

// Get current session (check if token exists and is valid)
export async function getSession(): Promise<{ token: string } | null> {
  const token = getStoredToken();
  if (!token) return null;

  // Verify token is still valid by calling /me
  try {
    await getCurrentUser();
    return { token };
  } catch {
    removeStoredToken();
    return null;
  }
}

// Get current user from token
export async function getCurrentUser(): Promise<AdminUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await authApiFetch<{ success: boolean; user: AdminUser }>(
      '/me',
      { method: 'GET' },
      true
    );
    return response.user || null;
  } catch {
    // Token is invalid or expired
    removeStoredToken();
    return null;
  }
}

// Alias for compatibility
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  return getCurrentUser();
}

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

// Check if current user is authenticated
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && user.isActive;
}

// Create a new admin user (admin only)
export async function createAdminUser(
  email: string,
  password: string,
  name?: string,
  role: 'admin' | 'staff' = 'staff'
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const response = await authApiFetch<{
      success: boolean;
      user?: AdminUser;
      error?: string;
    }>(
      '/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name, role }),
      },
      true
    );

    return {
      success: response.success,
      user: response.user,
      error: response.error,
    };
  } catch (error) {
    console.error('Create admin user error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Setup initial admin user (only works if no users exist)
export async function setupInitialAdmin(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const response = await authApiFetch<{
      success: boolean;
      token?: string;
      user?: AdminUser;
      error?: string;
    }>('/setup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.success && response.token) {
      setStoredToken(response.token);
      return { success: true, user: response.user };
    }

    return { success: false, error: response.error || 'Setup failed' };
  } catch (error) {
    console.error('Setup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Update admin user
export async function updateAdminUser(
  id: string,
  updates: Partial<Pick<AdminUser, 'name' | 'role' | 'isActive'>>
): Promise<boolean> {
  try {
    await authApiFetch<{ success: boolean }>(
      `/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      },
      true
    );
    return true;
  } catch (error) {
    console.error('Update admin user error:', error);
    return false;
  }
}

// Delete admin user (soft delete - sets isActive to false)
export async function deleteAdminUser(id: string): Promise<boolean> {
  try {
    await authApiFetch<{ success: boolean }>(
      `/users/${id}`,
      { method: 'DELETE' },
      true
    );
    return true;
  } catch (error) {
    console.error('Delete admin user error:', error);
    return false;
  }
}

// Get all admin users
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const response = await authApiFetch<{ success: boolean; users: AdminUser[] }>(
      '/users',
      { method: 'GET' },
      true
    );
    return response.users || [];
  } catch (error) {
    console.error('Get admin users error:', error);
    return [];
  }
}

// Listen for auth state changes (simplified - no real-time updates)
// This is provided for compatibility but doesn't do real-time like Supabase
export function onAuthStateChange(
  callback: (event: string, session: { token: string } | null) => void
): { data: { subscription: { unsubscribe: () => void } } } {
  // Check auth state on load
  const token = getStoredToken();
  if (token) {
    // Verify it's still valid
    getCurrentUser().then(user => {
      if (user) {
        callback('SIGNED_IN', { token });
      } else {
        callback('SIGNED_OUT', null);
      }
    });
  } else {
    callback('SIGNED_OUT', null);
  }

  // Return unsubscribe function (no-op since we don't have real-time)
  return {
    data: {
      subscription: {
        unsubscribe: () => {},
      },
    },
  };
}

// Compatibility exports for old code that used Supabase types
export type User = AdminUser;
export type Session = { token: string };

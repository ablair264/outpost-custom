import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  auth_user_id: string | null;
  email: string;
  name: string | null;
  role: 'admin' | 'staff';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  adminUser: AdminUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Sign in with email and password
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'No user returned' };
    }

    // Check if user exists in admin_users table
    const adminUser = await getAdminUserByAuthId(data.user.id);
    if (!adminUser) {
      // User exists in auth but not admin_users - sign them out
      await supabase.auth.signOut();
      return { success: false, error: 'You do not have admin access' };
    }

    if (!adminUser.is_active) {
      await supabase.auth.signOut();
      return { success: false, error: 'Your account has been deactivated' };
    }

    return { success: true };
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
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Get current session
export async function getSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

// Get current auth user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Get admin user by auth user ID
export async function getAdminUserByAuthId(
  authUserId: string
): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error) {
      // Not found is not an error for our purposes
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Get admin user error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get admin user error:', error);
    return null;
  }
}

// Get admin user by email (for checking before linking)
export async function getAdminUserByEmail(
  email: string
): Promise<AdminUser | null> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Get admin user by email error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get admin user by email error:', error);
    return null;
  }
}

// Get current admin user (combines auth user + admin user data)
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    return await getAdminUserByAuthId(user.id);
  } catch (error) {
    console.error('Get current admin user error:', error);
    return null;
  }
}

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  const adminUser = await getCurrentAdminUser();
  return adminUser?.role === 'admin';
}

// Check if current user is authenticated admin user
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const adminUser = await getCurrentAdminUser();
  return adminUser !== null && adminUser.is_active;
}

// Create a new admin user (admin only)
export async function createAdminUser(
  email: string,
  password: string,
  name?: string,
  role: 'admin' | 'staff' = 'staff'
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      // If admin API not available, try signUp (user will need to confirm email)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }

      // Create admin_users record
      const { data: adminUser, error: insertError } = await supabase
        .from('admin_users')
        .insert([{
          auth_user_id: signUpData.user?.id,
          email,
          name: name || null,
          role,
          is_active: true,
        }])
        .select()
        .single();

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      return { success: true, user: adminUser };
    }

    // Create admin_users record
    const { data: adminUser, error: insertError } = await supabase
      .from('admin_users')
      .insert([{
        auth_user_id: authData.user?.id,
        email,
        name: name || null,
        role,
        is_active: true,
      }])
      .select()
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true, user: adminUser };
  } catch (error) {
    console.error('Create admin user error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Update admin user
export async function updateAdminUser(
  id: string,
  updates: Partial<Pick<AdminUser, 'name' | 'role' | 'is_active'>>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Update admin user error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Update admin user error:', error);
    return false;
  }
}

// Delete admin user (soft delete - sets is_active to false)
export async function deleteAdminUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Delete admin user error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete admin user error:', error);
    return false;
  }
}

// Get all admin users
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get admin users error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get admin users error:', error);
    return [];
  }
}

// Listen for auth state changes
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

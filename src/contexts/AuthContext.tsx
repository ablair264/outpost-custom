import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  AdminUser,
  getCurrentUser,
  getCurrentAdminUser,
  getSession,
  signIn as authSignIn,
  signOut as authSignOut,
  onAuthStateChange,
} from '../lib/auth-service';

interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!adminUser && adminUser.is_active;
  const isAdmin = adminUser?.role === 'admin';

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const currentSession = await getSession();
        setSession(currentSession);

        if (currentSession?.user) {
          setUser(currentSession.user);
          const admin = await getCurrentAdminUser();
          setAdminUser(admin);
        } else {
          setUser(null);
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        setUser(null);
        setAdminUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);
      setSession(newSession);

      if (newSession?.user) {
        setUser(newSession.user);
        const admin = await getCurrentAdminUser();
        setAdminUser(admin);
      } else {
        setUser(null);
        setAdminUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await authSignIn(email, password);

    if (result.success) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const admin = await getCurrentAdminUser();
      setAdminUser(admin);
    }

    setIsLoading(false);
    return result;
  };

  const signOut = async () => {
    setIsLoading(true);
    await authSignOut();
    setUser(null);
    setAdminUser(null);
    setSession(null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const admin = await getCurrentAdminUser();
      setAdminUser(admin);
    } else {
      setAdminUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    adminUser,
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    signIn,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requireAdmin: boolean = false
) => {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#c1c6c8]">
          <div className="w-8 h-8 border-4 border-[#64a70b] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      // Will be handled by route protection
      return null;
    }

    if (requireAdmin && !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#c1c6c8]">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;

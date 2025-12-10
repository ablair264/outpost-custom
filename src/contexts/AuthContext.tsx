import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AdminUser, getAuthToken } from '../lib/api';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && user.isActive;
  const isAdmin = user?.role === 'admin';

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        // Check if we have a stored token
        const token = getAuthToken();
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Validate token by getting current user
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth init error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authApi.login(email, password);

      if (result.success && result.user) {
        setUser(result.user);
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    authApi.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    const currentUser = await authApi.getCurrentUser();
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
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

import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import {
  Package,
  Globe,
  FileText,
  Clipboard,
  LogOut,
  Eye,
  Home,
  ChevronRight,
  ChevronLeft,
  Users,
  Loader2,
  Pin,
  PinOff,
  Settings,
  Shirt,
  MessageSquare,
  LayoutDashboard,
  Image as ImageIcon,
  Printer
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  color: string;
  links?: { label: string; path: string; badge?: number }[];
  adminOnly?: boolean;
}

const AdminLayoutNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const { isAuthenticated, isLoading, adminUser, signOut, isAdmin } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Load sidebar preferences
  useEffect(() => {
    try {
      const pinned = localStorage.getItem('adminSidebarPinned');
      if (pinned !== null) {
        setSidebarPinned(pinned === 'true');
      }
    } catch {}
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleViewSite = () => {
    window.open('/', '_blank');
  };

  const togglePin = () => {
    const next = !sidebarPinned;
    setSidebarPinned(next);
    try {
      localStorage.setItem('adminSidebarPinned', String(next));
    } catch {}
    if (next) setSidebarCollapsed(false);
  };

  const toggleCollapse = () => {
    if (sidebarPinned && !sidebarCollapsed) {
      setSidebarPinned(false);
      try {
        localStorage.setItem('adminSidebarPinned', 'false');
      } catch {}
    }
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#64a70b] animate-spin" />
          <p className="text-gray-400 neuzeit-font">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const username = adminUser?.name || adminUser?.email?.split('@')[0] || 'Admin';

  // Navigation items with sections
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin/dashboard',
      color: '#64a70b',
    },
    {
      id: 'products',
      label: 'Products',
      icon: <Package className="w-5 h-5" />,
      color: '#8b5cf6',
      links: [
        { label: 'Product Manager', path: '/admin/products' },
        { label: 'Pricing', path: '/admin/pricing' },
        { label: 'Updates', path: '/admin/updates' },
      ],
    },
    {
      id: 'web-content',
      label: 'Web Content',
      icon: <Globe className="w-5 h-5" />,
      color: '#3b82f6',
      links: [
        { label: 'Shop Page', path: '/admin/shop-page' },
        { label: 'Home Page', path: '/admin/home-page' },
        { label: 'Signage', path: '/admin/signage' },
        { label: 'Printing', path: '/admin/printing' },
      ],
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <Clipboard className="w-5 h-5" />,
      color: '#f59e0b',
      links: [
        { label: 'Clothing Enquiries', path: '/admin/clothing-enquiries' },
        { label: 'General Enquiries', path: '/admin/enquiries' },
        { label: 'Settings', path: '/admin/enquiry-settings' },
      ],
    },
    {
      id: 'blog',
      label: 'Blog Posts',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/blog',
      color: '#10b981',
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users',
      color: '#ef4444',
      adminOnly: true,
    },
  ];

  // Filter nav items based on role
  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const isSectionActive = (item: NavItem) => {
    if (item.path) return isActivePath(item.path);
    if (item.links) {
      return item.links.some((link) => location.pathname.startsWith(link.path));
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#1a2634] to-[#0f1419] border-r border-white/5 flex flex-col z-50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'
        }`}
        onMouseEnter={() => {
          if (!sidebarPinned && sidebarCollapsed) {
            setSidebarCollapsed(false);
          }
        }}
        onMouseLeave={() => {
          if (!sidebarPinned && !sidebarCollapsed) {
            setSidebarCollapsed(true);
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 min-h-[64px]">
          <div className={`transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            <img
              src="/images/outpost-logo.png"
              alt="Outpost Custom"
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={togglePin}
              className={`p-2 rounded-lg transition-colors ${
                sidebarPinned
                  ? 'bg-[#64a70b]/20 text-[#64a70b]'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
              title={sidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              {sidebarPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#64a70b] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div className={`transition-opacity duration-300 min-w-0 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <p className="text-white font-semibold text-sm truncate">{username}</p>
              <p className="text-gray-500 text-xs capitalize">{adminUser?.role || 'Staff'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-2 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <div
              key={item.id}
              className="relative mb-1"
              onMouseEnter={() => {
                if (sidebarCollapsed && item.links) {
                  setHoveredSection(item.id);
                }
              }}
              onMouseLeave={() => {
                if (sidebarCollapsed) {
                  setHoveredSection(null);
                }
              }}
            >
              <button
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  } else if (item.links && item.links.length > 0) {
                    navigate(item.links[0].path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isSectionActive(item)
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div
                  className="flex-shrink-0 relative"
                  style={{ color: isSectionActive(item) ? item.color : undefined }}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                    sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>
                {item.links && !sidebarCollapsed && (
                  <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
                )}
              </button>

              {/* Hover Popup for collapsed state */}
              {item.links && sidebarCollapsed && hoveredSection === item.id && (
                <div
                  className="absolute left-full top-0 ml-2 bg-[#1a2634] border border-white/10 rounded-xl shadow-xl min-w-[200px] z-50 overflow-hidden"
                  onMouseEnter={() => setHoveredSection(item.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                    <div style={{ color: item.color }}>{item.icon}</div>
                    <span className="text-white font-semibold text-sm">{item.label}</span>
                  </div>
                  <div className="py-2">
                    {item.links.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                          isActivePath(link.path)
                            ? 'bg-[#64a70b]/20 text-[#64a70b]'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{link.label}</span>
                        {link.badge && link.badge > 0 && (
                          <span className="ml-auto px-2 py-0.5 bg-[#64a70b] text-white text-xs rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-links for expanded state */}
              {item.links && !sidebarCollapsed && isSectionActive(item) && (
                <div className="mt-1 ml-8 space-y-0.5">
                  {item.links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActivePath(link.path)
                          ? 'bg-[#64a70b]/20 text-[#64a70b] font-medium'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {link.label}
                      {link.badge && link.badge > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-[#64a70b] text-white text-xs rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <button
            onClick={handleViewSite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
            {!sidebarCollapsed && <span className="text-sm">View Site</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="text-sm">Log Out</span>}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
        }`}
      >
        {/* Glass Header */}
        <header className="sticky top-0 z-30 bg-[#0f1419]/80 backdrop-blur-xl border-b border-white/5">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl text-white font-semibold neuzeit-font">
                Admin Dashboard
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 bg-[#c1c6c8] min-h-[calc(100vh-73px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayoutNew;

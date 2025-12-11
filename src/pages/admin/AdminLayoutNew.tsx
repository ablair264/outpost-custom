import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import {
  Package,
  FileText,
  Clipboard,
  LogOut,
  Eye,
  Home,
  ChevronDown,
  ChevronUp,
  ChevronsLeftRight,
  Users,
  Loader2,
  Settings,
  Bell,
  Mail,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
  Image,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  links?: { label: string; path: string }[];
  adminOnly?: boolean;
  section: 'main' | 'settings';
}

const AdminLayoutNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['enquiries']);
  const [isLiveChatOnline, setIsLiveChatOnline] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const { isAuthenticated, isLoading, user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    try {
      const liveChatStatus = localStorage.getItem('liveChatOnline');
      if (liveChatStatus !== null) {
        setIsLiveChatOnline(liveChatStatus === 'true');
      }
    } catch {}
  }, []);

  const toggleLiveChat = () => {
    const newStatus = !isLiveChatOnline;
    setIsLiveChatOnline(newStatus);
    try {
      localStorage.setItem('liveChatOnline', String(newStatus));
    } catch {}
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const handleViewSite = () => {
    window.open('/', '_blank');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1625] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin" />
          <p className="text-gray-400" style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const username = user?.name || user?.email?.split('@')[0] || 'Admin';

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/admin/dashboard',
      section: 'main',
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: <Clipboard className="w-5 h-5" />,
      path: '/admin/enquiries',
      section: 'main',
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: <FileText className="w-5 h-5" />,
      section: 'main',
      links: [
        { label: 'Shop Page Editor', path: '/admin/shop-editor' },
        { label: 'Blog Editor', path: '/admin/blog' },
      ],
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: <Package className="w-5 h-5" />,
      section: 'main',
      links: [
        { label: 'Product Manager', path: '/admin/products' },
        { label: 'Image Manager', path: '/admin/images' },
        { label: 'Updater', path: '/admin/updater' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/customers',
      section: 'main',
    },
    {
      id: 'livechat',
      label: 'LiveChat',
      icon: <MessageCircle className="w-5 h-5" />,
      path: '/admin/livechat',
      section: 'main',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      section: 'settings',
      links: [
        { label: 'User Management', path: '/admin/users' },
      ],
      adminOnly: true,
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const mainItems = filteredNavItems.filter(item => item.section === 'main');
  const settingsItems = filteredNavItems.filter(item => item.section === 'settings');

  const isActivePath = (path: string) => location.pathname === path;

  const isSectionActive = (item: NavItem) => {
    if (item.path) return isActivePath(item.path);
    if (item.links) {
      return item.links.some((link) => location.pathname.startsWith(link.path));
    }
    return false;
  };

  const isExpanded = (itemId: string) => expandedSections.includes(itemId);

  const renderNavItem = (item: NavItem) => {
    const hasLinks = item.links && item.links.length > 0;
    const expanded = isExpanded(item.id);
    const active = isSectionActive(item);

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasLinks) {
              toggleSection(item.id);
            } else if (item.path) {
              navigate(item.path);
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            active && hasLinks
              ? 'bg-[#3d3456] text-white'
              : active
              ? 'text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
        >
          <span className={active ? 'text-white' : 'text-gray-500'}>
            {item.icon}
          </span>
          {!sidebarCollapsed && (
            <>
              <span className="font-medium text-[15px]">{item.label}</span>
              {hasLinks && (
                <span className="ml-auto">
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </span>
              )}
            </>
          )}
        </button>

        {/* Sub-links */}
        {hasLinks && expanded && !sidebarCollapsed && (
          <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-600/50 space-y-1">
            {item.links!.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
                  isActivePath(link.path)
                    ? 'bg-[#4a3d66] text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1625] flex admin-layout">
      <style>{`
        .admin-layout ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .admin-layout ::-webkit-scrollbar-track {
          background: #1a1625;
          border-radius: 4px;
        }
        .admin-layout ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6b5b95 0%, #4a3d66 100%);
          border-radius: 4px;
        }
        .admin-layout ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7d6ba8 0%, #5a4d76 100%);
        }
        .admin-layout {
          scrollbar-width: thin;
          scrollbar-color: #6b5b95 #1a1625;
        }
      `}</style>
      {/* Floating Sidebar */}
      <nav
        className={`fixed top-4 left-4 bottom-4 bg-gradient-to-b from-[#2a2440] to-[#1e1a2e] rounded-2xl flex flex-col z-50 transition-all duration-300 shadow-2xl ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Header with Logo */}
        <div className="relative p-6 pb-4">
          {!sidebarCollapsed && (
            <img
              src="/images/outpost-logo.png"
              alt="Outpost Custom"
              className="h-10 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OC</span>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-4 -right-3 w-6 h-6 bg-[#2a2440] border border-gray-600/50 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3d3456] transition-colors shadow-lg"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeftRight className="w-3 h-3" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 overflow-y-auto">
          {/* MAIN Section */}
          {!sidebarCollapsed && (
            <div
              className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3"
              style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
            >
              Main
            </div>
          )}
          {mainItems.map(renderNavItem)}

          {/* SETTINGS Section */}
          {!sidebarCollapsed && (
            <div
              className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3 mt-6"
              style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
            >
              Settings
            </div>
          )}
          {sidebarCollapsed && <div className="my-4 border-t border-gray-600/30" />}
          {settingsItems.map(renderNavItem)}
        </div>

        {/* Footer with User Info */}
        <div className="p-4 bg-[#252035] rounded-b-2xl">
          {/* User Info */}
          <div className={`flex items-center gap-3 mb-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6b7280&color=fff&size=48`}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p
                  className="text-white font-semibold text-sm truncate"
                  style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
                >
                  {username}
                </p>
                <p
                  className="text-gray-400 text-xs capitalize"
                  style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
                >
                  {user?.role || 'Admin'}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!sidebarCollapsed ? (
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6b5b95] hover:bg-[#7d6ba8] text-white text-sm font-medium transition-colors"
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                Logout
              </button>
              <button
                onClick={handleViewSite}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#3d3456] hover:bg-[#4a3d66] text-gray-300 text-sm font-medium transition-colors"
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                View Site
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="w-full p-2.5 rounded-lg bg-[#6b5b95] hover:bg-[#7d6ba8] text-white transition-colors flex items-center justify-center"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleViewSite}
                className="w-full p-2.5 rounded-lg bg-[#3d3456] hover:bg-[#4a3d66] text-gray-300 transition-colors flex items-center justify-center"
                title="View Site"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen bg-gradient-to-br from-[#1e1a2e] via-[#2a2440] to-[#1a1625] transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[96px]' : 'ml-[284px]'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-transparent backdrop-blur-sm border-b border-purple-500/10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1
              className="text-xl text-white font-semibold"
              style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
            >
              Admin Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <div
                className="text-sm text-gray-400 hidden md:block"
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              <div className="h-6 w-px bg-purple-500/20 hidden md:block" />

              <button
                onClick={toggleLiveChat}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isLiveChatOnline
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30'
                }`}
                title={isLiveChatOnline ? 'LiveChat Online' : 'LiveChat Offline'}
              >
                {isLiveChatOnline ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
                <span
                  className="text-sm font-medium hidden sm:inline"
                  style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
                >
                  {isLiveChatOnline ? 'Online' : 'Offline'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isLiveChatOnline ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`} />
              </button>

              <button
                className="relative p-2 rounded-lg text-gray-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                title="Messages"
              >
                <Mail className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>

              <button
                className="relative p-2 rounded-lg text-gray-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 min-h-[calc(100vh-73px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayoutNew;

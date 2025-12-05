import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Package,
  Globe,
  FileText,
  Clipboard,
  LogOut,
  Eye,
  Home,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string; badge?: string }[];
}

const AdminLayoutNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Web Content']);
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('admin_authenticated');
    const user = localStorage.getItem('admin_user');

    if (!isAuth || isAuth !== 'true') {
      navigate('/admin/login');
    } else {
      setUsername(user || 'Admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const handleViewSite = () => {
    window.open('/', '_blank');
  };

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/admin/dashboard'
    },
    {
      label: 'Products',
      icon: <Package className="w-5 h-5" />,
      children: [
        { label: 'Product Manager', path: '/admin/products' },
        { label: 'Pricing', path: '/admin/pricing' },
        { label: 'Updates', path: '/admin/updates' }
      ]
    },
    {
      label: 'Web Content',
      icon: <Globe className="w-5 h-5" />,
      children: [
        { label: 'Shop Page', path: '/admin/shop-page', badge: 'Active' },
        { label: 'Home Page', path: '/admin/home-page' },
        { label: 'Signage', path: '/admin/signage' },
        { label: 'Printing', path: '/admin/printing' }
      ]
    },
    {
      label: 'Blog Posts',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/blog'
    },
    {
      label: 'Enquiries',
      icon: <Clipboard className="w-5 h-5" />,
      children: [
        { label: 'Enquiries List', path: '/admin/enquiries' },
        { label: 'Settings', path: '/admin/enquiry-settings' }
      ]
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#c1c6c8]" style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#333333] shadow-2xl transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-72' : 'w-0'
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#64a70b] flex items-center justify-center text-white font-black text-xl shadow-lg">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-lg" style={{ fontFamily: "'Aldivaro', sans-serif" }}>
                {username}
              </p>
              <p className="text-gray-400 text-sm">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  // Section with children
                  <div>
                    <button
                      onClick={() => toggleSection(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 group-hover:text-[#64a70b] transition-colors">
                          {item.icon}
                        </div>
                        <span className="font-semibold" style={{ fontFamily: "'Aldivaro', sans-serif" }}>
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                          expandedSections.includes(item.label) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {/* Children */}
                    {expandedSections.includes(item.label) && (
                      <ul className="mt-2 ml-8 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <button
                              onClick={() => navigate(child.path)}
                              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                                isActivePath(child.path)
                                  ? 'bg-[#64a70b] text-white font-semibold shadow-lg'
                                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Single item
                  <button
                    onClick={() => item.path && navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      item.path && isActivePath(item.path)
                        ? 'bg-[#64a70b] text-white font-semibold shadow-lg'
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={item.path && isActivePath(item.path) ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </div>
                    <span className="font-semibold" style={{ fontFamily: "'Aldivaro', sans-serif" }}>
                      {item.label}
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleViewSite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/5 transition-all group"
          >
            <Eye className="w-5 h-5 text-gray-400 group-hover:text-[#64a70b] transition-colors" />
            <span className="font-semibold">View Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#908d9a] text-white hover:bg-[#7a7785] transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Toggle Notch Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-[#333333] text-white p-2 rounded-r-lg shadow-lg hover:bg-[#64a70b] transition-all duration-300 ${
          sidebarOpen ? 'left-72' : 'left-0'
        }`}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-72' : 'ml-0'
        } min-h-screen`}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl text-[#333333]" style={{ fontFamily: "'Hearns', sans-serif" }}>
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayoutNew;

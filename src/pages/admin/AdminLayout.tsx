import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Package,
  Globe,
  ChevronDown,
  ChevronUp,
  Clipboard,
  LogOut,
  Eye,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  Home,
  ShoppingCart,
  FileText,
  Settings
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Web Content']);
  const [username, setUsername] = useState('');

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
        { label: 'Shop Page', path: '/admin/shop-page' },
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
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2a2a2a] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#78BE20] flex items-center justify-center text-white font-black text-xl">
              {username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">Username</p>
              <p className="text-white/60 text-sm">Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  // Section with children
                  <div>
                    <button
                      onClick={() => toggleSection(item.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-white/60 group-hover:text-[#78BE20] transition-colors">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {expandedSections.includes(item.label) ? (
                        <ChevronUp className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      )}
                    </button>

                    {/* Children */}
                    {expandedSections.includes(item.label) && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <button
                              onClick={() => navigate(child.path)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                isActivePath(child.path)
                                  ? 'bg-[#78BE20] text-white font-medium'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {child.label}
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      item.path && isActivePath(item.path)
                        ? 'bg-[#78BE20] text-white'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                  >
                    <div className={item.path && isActivePath(item.path) ? 'text-white' : 'text-white/60'}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/5 transition-all"
          >
            <Eye className="w-5 h-5 text-white/60" />
            <span className="font-medium">View Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

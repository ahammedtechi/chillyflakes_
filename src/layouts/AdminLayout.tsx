import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Clock,
  Layers,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminProducts } from '../features/admin/hooks/useAdminProducts';
import { ToastProvider } from '../components/vendor/Toast';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Get live pending review count
  const { data: queueData } = useAdminProducts({ status: 'pending_review', page_size: 1 });
  const pendingCount = queueData?.status_counts?.pending_review ?? 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileDrawerOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: pendingCount > 0 ? `${pendingCount} pending` : undefined,
    },
    {
      label: 'Product Reviews',
      path: '/admin/product-reviews',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
      badgeColor: 'bg-[#FAF3E0] text-[#8A5A00] border-[#F3E2B8]',
    },
    {
      label: 'Categories',
      path: '/admin/categories',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      label: 'Seller Approvals',
      path: '/admin/seller-approvals',
      icon: <Users className="w-4 h-4" />,
      badge: 'Soon',
      badgeColor: 'bg-[#F4F4F5] text-[#71717A] border-[#E4E4E7]',
    },
  ];

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/product-reviews/')) return 'Product Inspection';
    if (location.pathname.startsWith('/admin/product-reviews')) return 'Product Reviews';
    if (location.pathname.startsWith('/admin/categories')) return 'Categories Management';
    if (location.pathname.startsWith('/admin/seller-approvals')) return 'Seller Approvals';
    if (location.pathname.startsWith('/admin/dashboard')) return 'Admin Overview';
    return 'Super Admin Console';
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FAF7F2] text-[#223B28] flex flex-col font-sans selection:bg-[#2E4D34] selection:text-white">
        {/* DESKTOP FIXED SIDEBAR */}
        <aside
          role="navigation"
          aria-label="Admin Navigation"
          className="hidden lg:flex flex-col fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-[#EAE5DB] z-30"
        >
          {/* Logo Area */}
          <div className="h-20 px-6 border-b border-[#EAE5DB] flex items-center justify-between">
            <Link
              to="/admin/product-reviews"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2E4D34] rounded-lg p-1"
            >
              <Logo variant="dark" size="sm" showTagline={false} />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2E4D34] text-white px-2 py-0.5 rounded-full shadow-2xs">
                Super Admin
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2E4D34] text-white shadow-xs font-semibold'
                      : 'text-[#5F6D61] hover:text-[#223B28] hover:bg-[#FAF7F2]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : item.badgeColor || 'bg-[#EAE5DB] text-[#5F6D61] border-transparent'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Sidebar Bottom Profile */}
          <div className="p-4 border-t border-[#EAE5DB] bg-[#FAF7F2]/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2E4D34] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#223B28] truncate">
                  {admin?.name || 'Platform Admin'}
                </p>
                <p className="text-[11px] text-[#8E9B90] truncate">
                  {admin?.email || 'admin@test.com'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-xs flex animate-fadeIn"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              ref={drawerRef}
              className="w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col animate-slideInLeft"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 px-5 border-b border-[#EAE5DB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Logo variant="dark" size="sm" showTagline={false} />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2E4D34] text-white px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-[#637365] hover:text-[#223B28] hover:bg-[#FAF7F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#2E4D34] text-white shadow-xs font-semibold'
                          : 'text-[#5F6D61] hover:text-[#223B28] hover:bg-[#FAF7F2]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EAE5DB] text-[#5F6D61]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

              <div className="p-4 border-t border-[#EAE5DB] bg-[#FAF7F2]/60">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#EAE5DB] bg-white text-xs font-semibold text-[#DC2626] hover:bg-[#FFF0F0] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Topbar */}
          <header className="sticky top-0 z-20 h-16 sm:h-20 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE5DB] flex items-center justify-between px-4 sm:px-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-[#EAE5DB] bg-white text-[#223B28] hover:bg-[#FAF7F2] transition-colors"
                aria-label="Open navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-[#223B28] tracking-tight">
                {getPageTitle()}
              </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Queue Status Pill */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3E0] text-[#8A5A00] border border-[#F3E2B8] text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{pendingCount} waiting review</span>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full sm:rounded-xl border border-[#EAE5DB] bg-white hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2E4D34] text-white flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <p className="font-semibold text-[#223B28] truncate max-w-[120px]">
                      {admin?.name || 'Super Admin'}
                    </p>
                    <p className="text-[10px] text-[#8E9B90]">Platform Staff</p>
                  </div>
                  <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#8E9B90]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EAE5DB] py-2 z-30 animate-fadeIn text-xs">
                    <div className="px-4 py-2 border-b border-[#EAE5DB] mb-1">
                      <p className="font-bold text-[#223B28] truncate">{admin?.name}</p>
                      <p className="text-[#8E9B90] text-[11px] truncate">{admin?.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[#DC2626] hover:bg-[#FFF0F0] transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Outlet */}
          <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 focus:outline-none">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="border-t border-[#EAE5DB] bg-white py-4 px-4 sm:px-8 text-xs text-[#8E9B90] flex items-center justify-between">
            <p>© 2026 ChillyFlakes Marketplace. Internal Super Administrator Console.</p>
            <p>Confidential & Secure</p>
          </footer>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;

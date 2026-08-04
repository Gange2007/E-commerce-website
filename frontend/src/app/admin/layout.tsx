'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: ListTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'admin')) {
      toast.error('Access denied. Admins only.');
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">ShopNex</span>
                <span className="text-[10px] font-medium text-indigo-500 -mt-0.5">Admin Panel</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => { setMobileOpen(false); setCollapsed(!collapsed); }}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin Info + Logout */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full mt-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="lg:hidden h-14 bg-white border-b border-slate-200 flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">Admin Panel</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}


'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, User, Menu, X, Package,
  LogOut, Settings, ChevronDown, Shield, Heart
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.count());
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Wishlist', href: '/wishlist' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-premium-sm' : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-200">
              <Package size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              ShopNex
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

{/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all">
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all">
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          <User size={16} /> My Profile
                        </Link>
                        <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          <Package size={16} /> My Orders
                        </Link>
                        <Link href="/wishlist" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                          <Heart size={16} /> Wishlist
                        </Link>
                        {user?.role === 'admin' && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 font-medium transition-colors">
                            <Shield size={16} /> Admin Dashboard
                          </Link>
                        )}
                        <hr className="my-1.5 border-slate-100" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-xl transition-all shadow-premium-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none text-sm"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <hr className="my-2 border-slate-100" />
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-colors text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

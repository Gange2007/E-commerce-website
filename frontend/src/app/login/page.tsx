'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Package } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      toast.success('Welcome back! 👋');
      router.push(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-200">
              <Package size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              ShopNex
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-6">Welcome back</h1>
          <p className="text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail size={17} />}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              icon={<Lock size={17} />}
              error={errors.password}
              autoComplete="current-password"
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400 font-medium">Demo credentials</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={async () => {
                  const demo = { email: 'john@example.com', password: 'user123' };
                  setForm(demo);
                  setLoading(true);
                  try {
                    const res = await authAPI.login(demo);
                    login(res.data.user, res.data.token);
                    toast.success('Welcome back! 👋');
                    router.push(res.data.user.role === 'admin' ? '/admin' : '/');
                  } catch (err: any) {
                    toast.error(err.response?.data?.message || 'Login failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 transition-all cursor-pointer"
              >
                👤 User Demo
              </button>
              <button
                type="button"
                onClick={async () => {
                  const demo = { email: 'admin@ecommerce.com', password: 'admin123' };
                  setForm(demo);
                  setLoading(true);
                  try {
                    const res = await authAPI.login(demo);
                    login(res.data.user, res.data.token);
                    toast.success('Welcome back! 👋');
                    router.push(res.data.user.role === 'admin' ? '/admin' : '/');
                  } catch (err: any) {
                    toast.error(err.response?.data?.message || 'Login failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 transition-all cursor-pointer"
              >
                🔐 Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

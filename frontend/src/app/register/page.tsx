'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Package } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      toast.success('Account created! Welcome 🎉');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center shadow-xl shadow-indigo-200">
              <Package size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              ShopNex
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-6">Create an account</h1>
          <p className="text-slate-500 mt-1">Join thousands of happy shoppers</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={update('name')}
              icon={<User size={17} />}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              icon={<Mail size={17} />}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={update('password')}
              icon={<Lock size={17} />}
              error={errors.password}
              autoComplete="new-password"
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              icon={<Lock size={17} />}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

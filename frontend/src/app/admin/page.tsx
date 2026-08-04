'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import type { AdminStats, Order } from '@/types';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

const statusColors: Record<string, 'yellow' | 'blue' | 'indigo' | 'emerald' | 'red'> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'indigo',
  Delivered: 'emerald',
  Cancelled: 'red',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getStats()
      .then((r) => setStats(r.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: stats?.totalRevenue ?? 0,
      prefix: '$',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-600',
      bg: 'from-emerald-500 to-emerald-600',
      format: true,
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      bg: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-indigo-100 text-indigo-600',
      bg: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-600',
      bg: 'from-orange-500 to-orange-600',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={22} />
              </div>
              {(card.label === 'Total Revenue' || card.label === 'Total Orders') && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp size={12} /> +12%
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mb-1">{card.label}</p>
            <p className="text-2xl font-extrabold text-slate-800">
              {card.prefix || ''}
              {card.format
                ? card.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : card.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-indigo-500" /> Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={36} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order: Order, i: number) => (
                <Link
                  key={order._id}
                  href={`/admin/orders`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                      #{String(i + 1)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {typeof order.user === 'object' ? order.user.name : 'User'} • ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Badge color={statusColors[order.orderStatus] || 'slate'} className="text-xs">
                    {order.orderStatus}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Order Status</h2>

          {!stats?.ordersByStatus || stats.ordersByStatus.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.ordersByStatus.map((item) => {
                const totalOrders = stats.ordersByStatus.reduce((acc, s) => acc + s.count, 0);
                const percentage = totalOrders > 0 ? (item.count / totalOrders) * 100 : 0;
                const statusColorMap: Record<string, string> = {
                  Pending: 'bg-yellow-500',
                  Processing: 'bg-blue-500',
                  Shipped: 'bg-indigo-500',
                  Delivered: 'bg-emerald-500',
                  Cancelled: 'bg-red-500',
                };

                return (
                  <div key={item._id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-600 font-medium">{item._id}</span>
                      <span className="font-bold text-slate-800">{item.count}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${statusColorMap[item._id] || 'bg-slate-400'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


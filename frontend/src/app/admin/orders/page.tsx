'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  ChevronDown,
  Search,
  Eye,
} from 'lucide-react';
import { orderAPI } from '@/lib/api';
import type { Order } from '@/types';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

const statusColors: Record<string, 'yellow' | 'blue' | 'indigo' | 'emerald' | 'red'> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'indigo',
  Delivered: 'emerald',
  Cancelled: 'red',
};

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await orderAPI.getAll(params);
      setOrders(res.data.orders);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total orders</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <ShoppingCart size={48} className="text-slate-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {statusFilter !== 'All' ? `No ${statusFilter} orders` : 'No orders yet'}
          </h3>
          <p className="text-slate-500">
            {statusFilter !== 'All' ? 'Try a different status filter' : 'Orders will appear here once customers start purchasing'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600">Order ID</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden sm:table-cell">Customer</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden md:table-cell">Items</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600">Total</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden lg:table-cell">Date</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-right py-3.5 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div>
                        <p className="font-medium text-slate-800 text-xs">
                          {typeof order.user === 'object' ? order.user.name : 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {typeof order.user === 'object' ? order.user.email : ''}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-600">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-slate-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                          className="appearance-none bg-transparent pr-5 text-sm font-medium outline-none cursor-pointer disabled:opacity-50"
                          style={{
                            color:
                              order.orderStatus === 'Delivered'
                                ? '#059669'
                                : order.orderStatus === 'Cancelled'
                                ? '#dc2626'
                                : order.orderStatus === 'Pending'
                                ? '#ca8a04'
                                : order.orderStatus === 'Processing'
                                ? '#2563eb'
                                : '#4338ca',
                          }}
                        >
                          {statusOptions.filter(s => s !== 'All').map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/orders/${order._id}`}>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                          <Eye size={15} />
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      page === p
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


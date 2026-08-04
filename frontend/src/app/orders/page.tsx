'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderAPI } from '@/lib/api';
import type { Order } from '@/types';
import Badge from '@/components/ui/Badge';
import { OrderCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

const statusColors: Record<string, 'yellow' | 'blue' | 'indigo' | 'emerald' | 'red'> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'indigo',
  Delivered: 'emerald',
  Cancelled: 'red',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then((r) => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-slate-200 rounded-xl mb-6 skeleton" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Package size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          <p className="text-slate-500 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <ShoppingBag size={48} className="text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
          <Link href="/products"><Button icon={<ShoppingBag size={16} />}>Browse Products</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/orders/${order._id}`}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge color={statusColors[order.orderStatus] || 'slate'}>
                      {order.orderStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-4 overflow-hidden">
                    {(order.orderItems as any[]).slice(0, 4).map((item: any, idx: number) => (
                      <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                        <Image
                          src={item.image || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.orderItems.length > 4 && (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                        +{order.orderItems.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-slate-500">{order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''} • </span>
                      <span className="font-bold text-slate-800">${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-500 text-sm font-medium group-hover:gap-2 transition-all">
                      View Details <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

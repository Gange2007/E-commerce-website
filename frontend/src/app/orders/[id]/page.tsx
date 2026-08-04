'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, CreditCard, ArrowLeft, Truck } from 'lucide-react';
import { orderAPI } from '@/lib/api';
import type { Order } from '@/types';
import Badge from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

const statusColors: Record<string, 'yellow' | 'blue' | 'indigo' | 'emerald' | 'red'> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'indigo',
  Delivered: 'emerald',
  Cancelled: 'red',
};

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then((r) => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Order not found</h2>
        <Link href="/orders" className="text-indigo-600 hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Order Placed Successfully!</h3>
            <p className="text-emerald-600 text-sm">
              Your order has been confirmed. We&apos;ll update you when it ships.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-slate-500 text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <div className="ml-auto">
          <Badge color={statusColors[order.orderStatus] || 'slate'}>{order.orderStatus}</Badge>
        </div>
      </div>

      {/* Status Progress */}
      {order.orderStatus !== 'Cancelled' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-5">Order Status</h2>
          <div className="flex items-center">
            {statusSteps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i <= currentStatusIndex
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {i < currentStatusIndex ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    i <= currentStatusIndex ? 'text-indigo-600' : 'text-slate-400'
                  }`}>{s}</span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-5 ${
                    i < currentStatusIndex ? 'bg-indigo-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipping */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={17} className="text-indigo-500" />
            <h3 className="font-semibold text-slate-800">Shipping Address</h3>
          </div>
          <p className="text-sm text-slate-600 space-y-1">
            <span className="block font-medium text-slate-800">{order.shippingAddress.fullName}</span>
            <span className="block">{order.shippingAddress.address}</span>
            <span className="block">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</span>
            <span className="block">{order.shippingAddress.country}</span>
            <span className="block">{order.shippingAddress.phone}</span>
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={17} className="text-indigo-500" />
            <h3 className="font-semibold text-slate-800">Payment Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Method</span>
              <span className="font-medium text-slate-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <Badge color={order.isPaid ? 'emerald' : 'yellow'} className="text-xs">
                {order.isPaid ? 'Paid' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Package size={17} className="text-indigo-500" />
          Order Items ({order.orderItems.length})
        </h3>
        <div className="space-y-4">
          {(order.orderItems as any[]).map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                <Image src={item.image || 'https://via.placeholder.com/100'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm line-clamp-1">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
              </div>
              <p className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          {[
            { label: 'Subtotal', value: order.itemsPrice },
            { label: 'Shipping', value: order.shippingPrice },
            { label: 'Tax', value: order.taxPrice },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-700">
                {label === 'Shipping' && value === 0 ? 'FREE' : `$${value.toFixed(2)}`}
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800">Total</span>
            <span className="text-lg font-extrabold text-indigo-600">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link href="/orders">
        <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
          <ArrowLeft size={16} /> Back to Orders
        </button>
      </Link>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shipping = totalPrice() > 50 ? 0 : 9.99;
  const tax = totalPrice() * 0.1;
  const total = totalPrice() + shipping + tax;

  if (!mounted) return null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to checkout');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-indigo-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Add some products to get started</p>
          <Link href="/products">
            <Button icon={<ArrowLeft size={18} />} size="lg">Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-slate-500 mt-1">{totalItems()} items in your cart</p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success('Cart cleared'); }}
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 size={15} /> Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex gap-5"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                  <Image
                    src={item.product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <Link href={`/products/${item.product._id}`}
                        className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 text-sm">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{item.product.brand}</p>
                    </div>
                    <button
                      onClick={() => { removeItem(item.product._id); toast('Item removed', { icon: '🗑️' }); }}
                      className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1.5 font-semibold text-slate-800 text-sm min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-500">${item.product.price.toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal ({totalItems()} items)</span>
                <span className="font-medium text-slate-800">${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (10%)</span>
                <span className="font-medium text-slate-800">${tax.toFixed(2)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <Tag size={12} /> Add ${(50 - totalPrice()).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-xl font-extrabold text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              variant="orange"
              icon={<ArrowRight size={18} />}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>

            <Link href="/products" className="block mt-3">
              <Button variant="ghost" fullWidth className="border border-slate-200">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

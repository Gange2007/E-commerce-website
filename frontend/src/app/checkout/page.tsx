'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, CreditCard, Truck, CheckCircle, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderAPI } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');

  const [shipping, setShipping] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subTotal = totalPrice();
  const shippingCost = subTotal > 50 ? 0 : 9.99;
  const tax = subTotal * 0.1;
  const total = subTotal + shippingCost + tax;

  if (!mounted) return null;

  const validateShipping = () => {
    const e: Record<string, string> = {};
    if (!shipping.fullName) e.fullName = 'Full name is required';
    if (!shipping.address) e.address = 'Address is required';
    if (!shipping.city) e.city = 'City is required';
    if (!shipping.state) e.state = 'State is required';
    if (!shipping.zipCode) e.zipCode = 'ZIP code is required';
    if (!shipping.phone) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0]?.url || '',
          price: item.product.price,
          quantity: item.quantity,
        })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice: subTotal,
        shippingPrice: shippingCost,
        taxPrice: tax,
        totalPrice: total,
      };

      const res = await orderAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      router.push(`/orders/${res.data.order._id}?success=true`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
              i < step
                ? 'bg-emerald-500 text-white'
                : i === step
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {i < step ? <CheckCircle size={18} /> : i + 1}
          </div>
          <span className={`ml-2 text-sm font-medium ${i === step ? 'text-indigo-600' : 'text-slate-500'}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${i < step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Checkout</h1>
      <StepIndicator />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Steps */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <MapPin size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Full Name" value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    error={errors.fullName} placeholder="John Doe" />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Street Address" value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    error={errors.address} placeholder="123 Main Street, Apt 4B" />
                </div>
                <Input label="City" value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  error={errors.city} placeholder="San Francisco" />
                <Input label="State" value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                  error={errors.state} placeholder="California" />
                <Input label="ZIP Code" value={shipping.zipCode}
                  onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                  error={errors.zipCode} placeholder="94102" />
                <Input label="Country" value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  placeholder="United States" />
                <div className="sm:col-span-2">
                  <Input label="Phone Number" value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    error={errors.phone} placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <Button
                fullWidth
                size="lg"
                className="mt-6"
                onClick={() => { if (validateShipping()) setStep(1); }}
              >
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <CreditCard size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Truck },
                  { id: 'Online', label: 'Online Payment', desc: 'Credit/debit card, UPI, wallets', icon: CreditCard },
                ].map(({ id, label, desc, icon: Icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id as 'COD' | 'Online')}
                      className="text-indigo-600"
                    />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === id ? 'bg-indigo-100' : 'bg-slate-100'
                    }`}>
                      <Icon size={20} className={paymentMethod === id ? 'text-indigo-600' : 'text-slate-500'} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{label}</p>
                      <p className="text-sm text-slate-500">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="ghost" className="border border-slate-200" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button fullWidth size="lg" onClick={() => setStep(2)}>
                  Review Order
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Review Your Order</h2>
              </div>

              {/* Shipping summary */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={15} /> Shipping To
                </p>
                <p className="text-sm text-slate-600">{shipping.fullName}</p>
                <p className="text-sm text-slate-600">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zipCode}</p>
                <p className="text-sm text-slate-600">{shipping.country} • {shipping.phone}</p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={item.product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" className="border border-slate-200" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  fullWidth
                  size="lg"
                  variant="orange"
                  loading={loading}
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="text-base font-bold text-slate-800 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className={`font-medium ${shippingCost === 0 ? 'text-emerald-600' : ''}`}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between">
              <span className="font-bold text-slate-800">Total</span>
              <span className="text-lg font-extrabold text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

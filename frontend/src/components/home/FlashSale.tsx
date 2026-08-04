'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Zap } from 'lucide-react';

interface FlashSaleProps {
  products: Product[];
  loading: boolean;
}

function useCountdown(targetDate: number) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: 'Hrs', value: String(hours).padStart(2, '0') },
    { label: 'Min', value: String(minutes).padStart(2, '0') },
    { label: 'Sec', value: String(seconds).padStart(2, '0') },
  ];
}

function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [targetDate, setTargetDate] = useState(0);

  useEffect(() => {
    setTargetDate(Date.now() + 24 * 60 * 60 * 1000); // 24h from now
    setMounted(true);
  }, []);

  const timer = useCountdown(targetDate);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur rounded-lg px-2.5 py-1.5 text-center min-w-[3rem]">
              <p className="text-lg font-bold text-white leading-none">--</p>
              <p className="text-[10px] text-white/70 uppercase">{['Hrs', 'Min', 'Sec'][i]}</p>
            </div>
            {i < 2 && <span className="text-white/70 font-bold">:</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {timer.map((t, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur rounded-lg px-2.5 py-1.5 text-center min-w-[3rem]">
            <p className="text-lg font-bold text-white leading-none">{t.value}</p>
            <p className="text-[10px] text-white/70 uppercase">{t.label}</p>
          </div>
          {i < timer.length - 1 && <span className="text-white/70 font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function FlashSale({ products, loading }: FlashSaleProps) {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">Flash Sale</h2>
              <p className="text-white/80 text-sm">Limited time offers</p>
            </div>
          </div>
          <Countdown />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Shield, Truck, RotateCcw, Star, Zap, TrendingUp, Clock, Percent, Flame, Sparkles } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { productAPI, categoryAPI } from '@/lib/api';
import type { Product, Category } from '@/types';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import BrandMarquee from '@/components/home/BrandMarquee';
import FlashSale from '@/components/home/FlashSale';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [dealOfDay, setDealOfDay] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, cats, newest, popular, flash] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          categoryAPI.getAll(),
          productAPI.getAll({ sort: 'newest', limit: 8 }),
          productAPI.getAll({ sort: 'popular', limit: 8 }),
          productAPI.getAll({ sort: 'price_desc', limit: 4 }),
        ]);

        setFeaturedProducts(featured.data.products);
        setCategories(cats.data.categories);
        setNewArrivals(newest.data.products);
        setBestSellers(popular.data.products);
        setFlashSaleProducts(flash.data.products);
        setDealOfDay(featured.data.products[0] || null);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'bg-primary-100 text-primary-600' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions', color: 'bg-emerald-100 text-emerald-600' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy', color: 'bg-orange-100 text-orange-600' },
    { icon: Star, title: 'Top Quality', desc: 'Curated premium products', color: 'bg-purple-100 text-purple-600' },
  ];

  // Helper to render section header
  const SectionHeader = ({ title, subtitle, link, icon }: { title: string; subtitle: string; link?: string; icon?: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-11 h-11 rounded-2xl bg-primary-100 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-display">{title}</h2>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
      {link && (
        <Link href={link} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      )}
    </motion.div>
  );

  return (
    <div className="bg-slate-50">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroBanner />

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                <f.icon size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────── */}
      <CategoryShowcase categories={categories} />

      {/* ── Featured Products ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SectionHeader
          title="Featured Products"
          subtitle="Handpicked for you"
          link="/products?featured=true"
          icon={<Sparkles size={20} className="text-primary-600" />}
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Flash Sale ─────────────────────────────────────── */}
      <FlashSale products={flashSaleProducts} loading={loading} />

      {/* ── New Arrivals ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SectionHeader
          title="New Arrivals"
          subtitle="Latest products just landed"
          link="/products?sort=newest"
          icon={<Clock size={20} className="text-primary-600" />}
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Best Sellers ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SectionHeader
          title="Best Sellers"
          subtitle="Most popular with our customers"
          link="/products?sort=popular"
          icon={<Flame size={20} className="text-primary-600" />}
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Deal of the Day ────────────────────────────────── */}
      {dealOfDay && !loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <SectionHeader title="Deal of the Day" subtitle="Limited time mega deal" icon={<Percent size={20} className="text-primary-600" />} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-premium border border-slate-100 transition-all duration-300"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-96 bg-slate-50 overflow-hidden">
                <img
                  src={dealOfDay.images?.[0]?.url || 'https://via.placeholder.com/600'}
                  alt={dealOfDay.name}
                  className="w-full h-full object-cover img-zoom"
                />
                <span className="absolute top-4 left-4 bg-accent-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  % OFF
                </span>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">{dealOfDay.brand}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4 font-display">{dealOfDay.name}</h3>
                <p className="text-slate-600 mb-6 line-clamp-3">{dealOfDay.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-extrabold text-slate-800">${dealOfDay.price.toFixed(2)}</span>
                  {dealOfDay.originalPrice && dealOfDay.originalPrice > dealOfDay.price && (
                    <span className="text-xl text-slate-400 line-through">${dealOfDay.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                {/* Stock progress */}
                {dealOfDay.stock > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-slate-700">{dealOfDay.sold} sold</span>
                      <span className="text-slate-500">{dealOfDay.stock} left</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"
                        style={{ width: `${Math.min(100, (dealOfDay.sold / (dealOfDay.sold + dealOfDay.stock)) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Link href={`/products/${dealOfDay._id}`}>
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-premium-sm transition-all cursor-pointer">
                      <ShoppingBag size={18} /> Grab Deal
                    </button>
                  </Link>
                  <Link href={`/products/${dealOfDay._id}`}>
                    <button className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold px-8 py-3.5 rounded-2xl transition-all cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-brand rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-display">Special Offer Today!</h2>
            <p className="text-primary-200 text-lg mb-8">Get up to 50% off on selected items. Limited time only.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <ShoppingBag size={18} /> Shop the Sale
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Brands ─────────────────────────────────────────── */}
      <BrandMarquee />

      {/* ── Testimonials ───────────────────────────────────── */}
      <Testimonials />

      {/* ── Newsletter ─────────────────────────────────────── */}
      <Newsletter />
    </div>
  );
}

'use client';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Tech Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    quote: 'Absolutely love the quality and fast delivery. The product photos are exactly what I received. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Professional Shopper',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    quote: 'The best shopping experience I\'ve had online. Great prices, excellent customer service, and premium products.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Fashion Blogger',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    quote: 'From the smooth checkout to the beautiful packaging, everything feels premium. My new go-to store!',
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 font-display">What Our Customers Say</h2>
        <p className="text-slate-500 mt-2">Join thousands of happy shoppers</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-premium-sm transition-all duration-300"
          >
            <Quote size={36} className="absolute top-6 right-6 text-primary-100" />
            <div className="flex mb-4">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  size={16}
                  className={s < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                />
              ))}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary-100 overflow-hidden">
                <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

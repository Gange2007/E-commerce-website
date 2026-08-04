'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('Subscribed! Check your inbox for exclusive deals 🎉');
    setEmail('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl gradient-brand p-10 md:p-16 text-center text-white"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-display">Stay in the Loop</h2>
          <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
            Subscribe to get exclusive deals, new arrivals, and product recommendations straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3.5 rounded-2xl hover:bg-primary-50 transition-all cursor-pointer"
            >
              <Send size={18} /> Subscribe
            </button>
          </form>

          <p className="text-primary-300 text-sm mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </motion.div>
    </section>
  );
}

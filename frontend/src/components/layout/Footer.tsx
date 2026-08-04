import Link from 'next/link';
import { Package, Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <Package size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">ShopNex</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Your premium e-commerce destination for the latest products across all categories.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Profile', href: '/profile' },
                { label: 'Cart', href: '/cart' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {['Electronics', 'Clothing', 'Books', 'Sports', 'Home & Garden', 'Beauty'].map((c) => (
                <li key={c}>
                  <Link href={`/products?category=${encodeURIComponent(c)}`}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                support@shopnex.com
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={16} className="text-indigo-400 flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                123 Commerce St, San Francisco, CA 94102
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ShopNex. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((l) => (
              <a key={l} href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

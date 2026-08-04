import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shopnex.example.com'),
  title: {
    default: 'ShopNex – Premium E-Commerce Store',
    template: '%s | ShopNex',
  },
  description: 'Shop the latest premium products at the best prices. Electronics, Fashion, Beauty, Books, Sports and more.',
  keywords: ['ecommerce', 'shop', 'online store', 'electronics', 'fashion', 'beauty', 'books', 'sports'],
  openGraph: {
    title: 'ShopNex – Premium E-Commerce Store',
    description: 'Shop the latest premium products at the best prices.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
        width: 1200,
        height: 630,
        alt: 'ShopNex',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopNex – Premium E-Commerce Store',
    description: 'Shop the latest premium products at the best prices.',
    images: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${sora.variable}`}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}

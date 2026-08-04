import React, { useEffect, useState } from 'react';
import { productAPI } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/types';

interface RelatedProductsProps {
  categoryId: string;
  excludeId: string;
}

export default function RelatedProducts({ categoryId, excludeId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productAPI.getAll({ category: categoryId, limit: 8 });
        const filtered = res.data.products.filter((p: Product) => p._id !== excludeId);
        setProducts(filtered);
      } catch (e) {
        console.error('Failed to load related products', e);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetch();
  }, [categoryId, excludeId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

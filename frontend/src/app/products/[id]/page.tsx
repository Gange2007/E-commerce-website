'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Share2, ArrowLeft, Plus, Minus,
  Package, CheckCircle, Star, MessageCircle, Truck, Shield
} from 'lucide-react';
import { productAPI } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import RelatedProducts from '@/components/products/RelatedProducts';
import { Skeleton } from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(id);
        setProduct(res.data.product);
      } catch {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    toast.success(`${qty}x ${product.name} added to cart!`);
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await productAPI.addReview(id, reviewForm);
      setProduct(res.data.product);
      setReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-700">Product not found</h2>
        <Link href="/products" className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const alreadyReviewed = product.reviews?.some(
    (r) => typeof r.user === 'object' && r.user._id === user?._id
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {/* Images */}
          <div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-96 md:h-[460px] rounded-2xl overflow-hidden bg-slate-50 mb-4"
            >
              <Image
                src={product.images?.[activeImage]?.url || 'https://via.placeholder.com/600'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </motion.div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      activeImage === i ? 'border-indigo-500 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Image src={img.url} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-medium text-indigo-500 mb-1">{product.brand}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">{product.name}</h1>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer">
                  <Heart size={18} />
                </button>
                <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-500 hover:border-indigo-200 transition-all cursor-pointer">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-sm font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-slate-500">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-extrabold text-slate-800">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <Badge color="orange">{discount}% OFF</Badge>
              )}
            </div>

            {/* Category & Stock */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {product.category && (
                <Badge color="indigo">{product.category.name}</Badge>
              )}
              {product.stock > 0 ? (
                <Badge color="emerald">
                  <CheckCircle size={12} className="mr-1" />
                  In Stock ({product.stock})
                </Badge>
              ) : (
                <Badge color="red">Out of Stock</Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-0 rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2.5 font-semibold text-slate-800 min-w-[3rem] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-3 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button
                  icon={<ShoppingCart size={18} />}
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                >
                  Add to Cart
                </Button>
              </div>
            )}

            <Link href="/cart">
              <Button variant="secondary" fullWidth size="lg">Buy Now</Button>
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Payment' },
                { icon: Package, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Icon size={18} className="text-indigo-500" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Customer Reviews ({product.numReviews})
            </h2>
            {isAuthenticated && !alreadyReviewed && (
              <Button
                variant="outline"
                size="sm"
                icon={<MessageCircle size={16} />}
                onClick={() => setReviewModal(true)}
              >
                Write Review
              </Button>
            )}
          </div>

          {product.reviews?.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <Star size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews?.map((review) => (
                <div key={review._id} className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {review.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{review.name}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    {/* Related Products */}
    {product && <RelatedProducts categoryId={product.category?._id || ''} excludeId={product._id} />}

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
            <StarRating
              rating={reviewForm.rating}
              size={28}
              interactive
              onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Review</label>
            <textarea
              rows={4}
              placeholder="Share your experience with this product..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm resize-none"
            />
          </div>
          <Button fullWidth loading={submittingReview} onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </div>
      </Modal>
    </div>
  );
}

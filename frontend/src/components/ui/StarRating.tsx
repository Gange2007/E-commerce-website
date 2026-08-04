'use client';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            onClick={() => interactive && onChange?.(i + 1)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          >
            <Star
              size={size}
              className={
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : partial
                  ? 'fill-amber-200 text-amber-400'
                  : 'fill-slate-200 text-slate-300'
              }
            />
          </button>
        );
      })}
    </div>
  );
}

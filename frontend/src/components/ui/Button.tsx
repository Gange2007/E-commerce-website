'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'orange' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-premium-sm hover:shadow-premium',
  secondary:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-200',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white bg-transparent',
  ghost:
    'text-slate-600 hover:bg-primary-50 hover:text-primary-700 bg-transparent',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-200',
  orange:
    'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg shadow-accent-200',
  accent:
    'bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500 text-white shadow-premium-sm hover:shadow-premium',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const [rippleX, setRippleX] = useState(0);
  const [rippleY, setRippleY] = useState(0);
  const [showRipple, setShowRipple] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRippleX(e.clientX - rect.left);
    setRippleY(e.clientY - rect.top);
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      className={`
        relative inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 cursor-pointer select-none overflow-hidden
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={handleClick}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {showRipple && (
        <span
          className="ripple"
          style={{ left: rippleX, top: rippleY, position: 'absolute', width: 0, height: 0 }}
        />
      )}
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}

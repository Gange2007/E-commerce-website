import React from 'react';

type Color = 'indigo' | 'emerald' | 'orange' | 'red' | 'yellow' | 'blue' | 'slate' | 'purple';

const colorMap: Record<Color, string> = {
  indigo: 'bg-primary-100 text-primary-700',
  purple: 'bg-primary-100 text-primary-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-accent-100 text-accent-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  blue: 'bg-blue-100 text-blue-700',
  slate: 'bg-slate-100 text-slate-700',
};

interface BadgeProps {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

export default function Badge({ children, color = 'indigo', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
}

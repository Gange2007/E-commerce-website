'use client';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200
            bg-white text-slate-800 placeholder:text-slate-400
            border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100
            outline-none text-sm
            ${icon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

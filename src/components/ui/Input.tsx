import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-2 border border-white/20 rounded-lg bg-black text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}


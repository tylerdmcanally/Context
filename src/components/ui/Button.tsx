import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-white/90 focus:ring-white/30',
    secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10 focus:ring-white/20',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}


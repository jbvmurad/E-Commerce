import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  className,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variants = {
    primary: 'bg-gradient-to-r from-[#00f5ff] to-[#00b4c8] text-[#020408] hover:shadow-[0_0_30px_rgba(0,245,255,0.6)] gradient-animate font-bold',
    secondary: 'border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[rgba(255,0,255,0.1)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]',
    ghost: 'bg-transparent text-foreground hover:bg-muted border border-border',
    danger: 'bg-[var(--danger)] text-white hover:bg-[#DC2626] active:bg-[#B91C1C] hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

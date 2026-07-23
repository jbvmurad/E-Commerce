import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[rgba(0,245,255,0.04)] rounded-none p-6 border border-[rgba(0,245,255,0.15)]',
        'shadow-[var(--shadow-card)]',
        onClick && 'cursor-pointer hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:border-[rgba(0,245,255,0.5)] transition-all duration-300',
        !onClick && 'hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all duration-300',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

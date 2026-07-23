import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'px-4 py-3 rounded-none border border-border bg-input-background text-foreground',
            'focus:outline-none focus:ring-2 focus:ring-[#00f5ff] focus:border-[#00f5ff]',
            'focus:shadow-[0_0_20px_rgba(0,245,255,0.2)]',
            'disabled:bg-muted disabled:cursor-not-allowed',
            'transition-all duration-300',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-[#050d15] rounded-none w-full mx-4 border border-[rgba(0,245,255,0.3)]',
          'shadow-[var(--shadow-modal)] max-h-[90vh] overflow-y-auto',
          sizeStyles[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[rgba(0,245,255,0.15)]">
            <h2 className="text-xl font-display text-[#00f5ff]" style={{textShadow: '0 0 15px #00f5ff'}}>{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[rgba(0,245,255,0.1)] rounded-none transition-all duration-300 hover:scale-110 border border-transparent hover:border-[rgba(0,245,255,0.3)]"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

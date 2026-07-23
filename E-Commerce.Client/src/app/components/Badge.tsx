import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import type { ProductStatus, OrderStatus } from '../data/mockData';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'productStatus' | 'orderStatus';
  status?: ProductStatus | OrderStatus;
  className?: string;
}

export function Badge({ children, variant = 'default', status, className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs';

  const getProductStatusStyles = (status: ProductStatus) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-slate-100 text-slate-600',
      OutOfStock: 'bg-red-100 text-red-800',
    };
    return styles[status];
  };

  const getOrderStatusStyles = (status: OrderStatus) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-800',
      Confirmed: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status];
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700',
    productStatus: status ? getProductStatusStyles(status as ProductStatus) : '',
    orderStatus: status ? getOrderStatusStyles(status as OrderStatus) : '',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
}

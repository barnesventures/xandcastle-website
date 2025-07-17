import { StockStatus } from '@/app/lib/types/inventory';

interface StockBadgeProps {
  status: StockStatus | undefined;
  className?: string;
}

export function StockBadge({ status, className = '' }: StockBadgeProps) {
  if (!status) return null;

  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const statusClasses = {
    [StockStatus.IN_STOCK]: 'bg-green-100 text-green-800',
    [StockStatus.LOW_STOCK]: 'bg-yellow-100 text-yellow-800',
    [StockStatus.OUT_OF_STOCK]: 'bg-red-100 text-red-800',
  };

  const statusText = {
    [StockStatus.IN_STOCK]: 'In Stock',
    [StockStatus.LOW_STOCK]: 'Low Stock',
    [StockStatus.OUT_OF_STOCK]: 'Out of Stock',
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]} ${className}`}>
      {statusText[status]}
    </span>
  );
}

interface VariantStockBadgeProps {
  inStock: boolean;
  className?: string;
}

export function VariantStockBadge({ inStock, className = '' }: VariantStockBadgeProps) {
  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
  
  if (inStock) {
    return (
      <span className={`${baseClasses} bg-green-50 text-green-700 ${className}`}>
        Available
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-red-50 text-red-700 ${className}`}>
      Out of Stock
    </span>
  );
}
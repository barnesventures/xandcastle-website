import { cn } from '@/app/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave';
  width?: string | number;
  height?: string | number;
}

export default function LoadingSkeleton({
  className,
  variant = 'text',
  animation = 'pulse',
  width,
  height,
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
  };
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-md',
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <LoadingSkeleton variant="rectangular" height={300} className="w-full" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton variant="text" className="w-3/4" />
        <LoadingSkeleton variant="text" className="w-1/2" height={20} />
        <div className="flex justify-between items-center mt-4">
          <LoadingSkeleton variant="text" width={80} height={24} />
          <LoadingSkeleton variant="rounded" width={100} height={36} />
        </div>
      </div>
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <LoadingSkeleton variant="rounded" className="w-full aspect-square" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} variant="rounded" className="aspect-square" />
            ))}
          </div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <LoadingSkeleton variant="text" height={32} className="w-3/4 mb-2" />
            <LoadingSkeleton variant="text" height={28} className="w-1/3" />
          </div>
          
          <div className="space-y-2">
            <LoadingSkeleton variant="text" className="w-full" />
            <LoadingSkeleton variant="text" className="w-full" />
            <LoadingSkeleton variant="text" className="w-3/4" />
          </div>
          
          <div className="space-y-4">
            <LoadingSkeleton variant="rounded" height={48} className="w-full" />
            <LoadingSkeleton variant="rounded" height={48} className="w-full" />
            <LoadingSkeleton variant="rounded" height={56} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog Post List Skeleton
export function BlogPostListSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-4">
            <LoadingSkeleton variant="rounded" width={200} height={150} />
            <div className="flex-1 space-y-3">
              <LoadingSkeleton variant="text" height={24} className="w-3/4" />
              <LoadingSkeleton variant="text" className="w-full" />
              <LoadingSkeleton variant="text" className="w-full" />
              <div className="flex items-center space-x-4 mt-4">
                <LoadingSkeleton variant="text" width={100} />
                <LoadingSkeleton variant="text" width={100} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Order List Skeleton
export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <LoadingSkeleton variant="text" width={150} height={20} />
              <LoadingSkeleton variant="text" width={200} />
            </div>
            <LoadingSkeleton variant="rounded" width={100} height={32} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LoadingSkeleton variant="text" width={120} />
            <LoadingSkeleton variant="text" width={100} />
            <LoadingSkeleton variant="text" width={80} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-6 py-3">
                <LoadingSkeleton variant="text" className="w-24" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <LoadingSkeleton variant="text" className="w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
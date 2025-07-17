'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import { brandPlaceholder, getShimmerPlaceholder } from '@/app/lib/image-blur';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = '/placeholder.svg',
  showSkeleton = true,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    setImgSrc(fallbackSrc);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn('relative', className)}>
      {isLoading && showSkeleton && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading && !hasError ? 'opacity-0' : 'opacity-100',
          className
        )}
        placeholder="blur"
        blurDataURL={brandPlaceholder}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}

// Product Image Component with specific optimizations
export function ProductImage({
  src,
  alt,
  priority = false,
  ...props
}: OptimizedImageProps & { priority?: boolean }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={85}
      priority={priority}
      {...props}
    />
  );
}

// Hero Image Component with specific optimizations
export function HeroImage({
  src,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes="100vw"
      quality={90}
      priority
      {...props}
    />
  );
}

// Thumbnail Image Component
export function ThumbnailImage({
  src,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes="(max-width: 640px) 50vw, 150px"
      quality={75}
      {...props}
    />
  );
}
// Utility for generating blur data URLs for Next.js Image component

/**
 * Generates a blurred placeholder data URL for images
 * This is a simplified version - in production you might want to generate
 * actual blurred versions of your images
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  
  if (!canvas) {
    // Return a simple SVG placeholder for SSR
    return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3C/svg%3E`;
  }
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a gradient for a more pleasant placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

/**
 * Shimmer effect SVG for loading placeholders
 */
export const shimmerBlurDataURL = `
<svg width="400" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="#f3f4f6" />
  <rect id="r" width="400" height="400" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-400" to="400" dur="1s" repeatCount="indefinite"  />
</svg>`;

/**
 * Convert SVG to base64 data URL
 */
export function toBase64(str: string): string {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
}

/**
 * Get shimmer placeholder
 */
export function getShimmerPlaceholder(): string {
  return `data:image/svg+xml;base64,${toBase64(shimmerBlurDataURL)}`;
}

/**
 * Simple gray placeholder
 */
export const grayPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

/**
 * Purple gradient placeholder matching brand colors
 */
export const brandPlaceholder = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%239333EA;stop-opacity:0.1'/%3E%3Cstop offset='100%25' style='stop-color:%23EC4899;stop-opacity:0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3C/svg%3E`;
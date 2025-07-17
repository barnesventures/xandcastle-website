'use client';

import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { AFFILIATE_COOKIE_NAME } from '@/app/lib/affiliate';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  useEffect(() => {
    const affiliateCode = searchParams.get('ref');
    
    if (affiliateCode) {
      // Track the affiliate click
      fetch('/api/affiliate/track?' + new URLSearchParams({
        ref: affiliateCode,
        page: pathname
      }))
        .then(() => {
          // Remove the ref parameter from URL without reload
          const url = new URL(window.location.href);
          url.searchParams.delete('ref');
          window.history.replaceState({}, '', url.toString());
        })
        .catch((error) => {
          console.error('Failed to track affiliate:', error);
        });
    }
  }, [searchParams, pathname]);
  
  return null;
}
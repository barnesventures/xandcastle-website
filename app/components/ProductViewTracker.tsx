'use client';

import { useEffect } from 'react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import * as gtag from '@/app/utils/analytics';
import { ProductDetails } from '@/app/lib/printify-client';

interface ProductViewTrackerProps {
  product: ProductDetails;
}

export function ProductViewTracker({ product }: ProductViewTrackerProps) {
  const { currentCurrency } = useCurrency();

  useEffect(() => {
    if (!product || !product.variants.length) return;

    // Get the first available variant for pricing
    const firstVariant = product.variants.find(v => v.is_available && v.is_enabled) || product.variants[0];
    
    // Track product view
    gtag.viewItem({
      currency: currentCurrency,
      value: firstVariant.price / 100,
      items: [{
        item_id: product.id,
        item_name: product.title,
        item_category: 'Apparel',
        item_brand: 'Xandcastle',
        price: firstVariant.price / 100,
        quantity: 1
      }]
    });
  }, [product, currentCurrency]);

  return null; // This component doesn't render anything
}
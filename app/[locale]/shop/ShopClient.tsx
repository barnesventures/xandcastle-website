'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, formatPrice } from '@/app/lib/printify-client';
import type { ProductListItem } from '@/app/lib/printify-client';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import * as gtag from '@/app/utils/analytics';
import { ProductCardSkeleton } from '@/app/components/LoadingSkeleton';
import ErrorMessage from '@/app/components/ErrorMessage';

export function ShopClient() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentCurrency } = useCurrency();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      
      // Track view item list event
      if (data.length > 0) {
        gtag.viewItemList({
          currency: currentCurrency,
          items: data.slice(0, 10).map((product, index) => ({
            item_id: product.id,
            item_name: product.title,
            item_category: 'Apparel',
            item_list_name: 'Shop All',
            index: index,
            quantity: 1
          }))
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
        <ErrorMessage message={error} onRetry={loadProducts} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
      
      {products.length === 0 ? (
        <p className="text-center text-gray-600 py-16">No products available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative aspect-square bg-gray-100">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].src}
                      alt={`${product.title} - Kids and teens clothing`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-xandcastle-purple transition">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {product.variant_count} variant{product.variant_count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
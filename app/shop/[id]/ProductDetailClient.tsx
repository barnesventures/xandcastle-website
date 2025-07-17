'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductDetails, getProduct } from '@/app/lib/printify-client';
import { ProductDetailSkeleton } from '@/app/components/LoadingSkeleton';
import ErrorMessage from '@/app/components/ErrorMessage';
import { ProductImagesClient } from './ProductImagesClient';
import { AddToCart } from '@/app/components/AddToCart';
import { ProductViewTracker } from '@/app/components/ProductViewTracker';

export function ProductDetailClient() {
  const params = useParams();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProduct(params.id as string);
      setProduct(data);
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message="Product not found" />
      </div>
    );
  }

  return (
    <>
      <ProductViewTracker product={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductImagesClient images={product.images} />
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="mt-4 text-lg text-gray-600">{product.description}</p>
            </div>
            
            <AddToCart product={product} />
            
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>High-quality print-on-demand product</li>
                <li>Printed and shipped when you order</li>
                <li>Eco-friendly production process</li>
                <li>Available in multiple sizes and colors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
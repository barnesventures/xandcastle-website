'use client';

import { useState, useEffect } from 'react';
import { ProductListItem } from '@/app/lib/printify-client';
import ProductCard from '@/app/components/ProductCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import { MapPinIcon } from '@heroicons/react/24/outline';

export function WindsorClient() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWindsorProducts();
  }, []);

  async function loadWindsorProducts() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/printify/products?windsor=true');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error('Error loading Windsor products:', err);
      setError('Failed to load Windsor collection. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadWindsorProducts} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full">
                <MapPinIcon className="h-12 w-12 text-xandcastle-purple" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Windsor Tourist Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exclusive castle-themed clothing and souvenirs inspired by the majesty of Windsor Castle. 
              Perfect memorabilia from your royal visit!
            </p>
          </div>
        </div>
      </div>

      {/* Collection Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-xandcastle-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Castle-Inspired Designs</h3>
            <p className="text-gray-600">Unique designs celebrating Windsor&apos;s royal heritage</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-xandcastle-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Souvenirs</h3>
            <p className="text-gray-600">Memorable gifts for friends and family back home</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-xandcastle-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">High-quality materials and professional printing</p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Windsor collection products coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const mainImage = product.images.find(img => img.position === "front") || product.images[0];
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  image={mainImage?.src || "/placeholder.svg"}
                  priceRange={{
                    min: 1999,
                    max: 3999,
                    currency: "USD"
                  }}
                  tags={product.tags}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-purple-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Visiting Windsor Castle?
          </h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Take home a piece of royal history with our exclusive Windsor tourist collection. 
            Each design captures the magic and majesty of this iconic British landmark.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-xandcastle-purple bg-white hover:bg-gray-50 transition"
            >
              Browse All Products
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-xandcastle-purple hover:bg-purple-700 transition"
            >
              Learn Our Story
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
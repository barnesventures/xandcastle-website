'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getWindsorTouristProducts, formatPrice } from '../lib/printify-client';
import type { ProductListItem } from '../lib/printify-client';

export default function WindsorCollectionPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWindsorProducts();
  }, []);

  const fetchWindsorProducts = async () => {
    try {
      setLoading(true);
      const data = await getWindsorTouristProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load Windsor collection. Please try again later.');
      console.error('Error fetching Windsor products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-xandcastle-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchWindsorProducts}
            className="bg-xandcastle-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-xandcastle-blue to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Windsor Tourist Collection</h1>
            <p className="text-xl mb-8 text-blue-100">
              Celebrate your visit to Windsor with our exclusive collection of castle-themed apparel and souvenirs
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                <span>Exclusive Windsor Designs</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Perfect Souvenirs</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Made with Love</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Description */}
      <div className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">About the Collection</h2>
            <p className="text-gray-700 mb-6">
              Our Windsor Tourist Collection features unique designs inspired by the historic Windsor Castle and the charming town that surrounds it. 
              From playful castle illustrations to elegant royal-themed patterns, each piece is designed to help you remember your special visit to Windsor.
            </p>
            <p className="text-gray-700">
              Whether you're looking for a cozy hoodie to remember your castle tour or a fun t-shirt for the little ones, 
              our collection offers something special for every member of the family.
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Shop the Collection</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No Windsor collection products available at the moment.</p>
            <Link 
              href="/shop"
              className="text-xandcastle-blue hover:underline"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <WindsorProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-gray-700 mb-6">
            Check out our full collection for more fun and creative designs
          </p>
          <Link 
            href="/shop"
            className="bg-xandcastle-purple text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition inline-block"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
}

// Windsor Product Card Component
function WindsorProductCard({ product }: { product: ProductListItem }) {
  const mainImage = product.images.find(img => img.position === 'front') || product.images[0];

  return (
    <Link href={`/shop/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-blue-100">
        <div className="relative aspect-square bg-gray-100">
          {mainImage && (
            <Image
              src={mainImage.src}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          <span className="absolute top-2 left-2 bg-xandcastle-blue text-white text-xs px-2 py-1 rounded">
            Windsor Exclusive
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 group-hover:text-xandcastle-blue transition-colors line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.variant_count} variants</span>
            <span className="text-sm font-medium text-xandcastle-blue">Shop Now</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
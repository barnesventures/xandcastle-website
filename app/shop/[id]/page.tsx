'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductDetails } from '@/app/lib/printify-client';
import { ProductDetails } from '@/app/lib/printify-client';
import { AddToCart } from '@/app/components/AddToCart';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductDetails(productId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-pulse">
            <div className="h-96 w-96 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error || 'Product not found'}</p>
          <Link href="/shop" className="text-xandcastle-purple hover:text-purple-700">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link href="/shop" className="text-gray-600 hover:text-gray-800">
          &larr; Back to Shop
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            {product.images[selectedImage] && (
              <div className="relative aspect-square">
                <Image
                  src={product.images[selectedImage].src}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}
          </div>
          
          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? 'border-xandcastle-purple'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          {product.description && (
            <div className="prose prose-gray mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <AddToCart product={product} />
          </div>

          {/* Product Details */}
          <div className="mt-8 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Product Details</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• High-quality print-on-demand product</li>
                <li>• Made to order for you</li>
                <li>• Eco-friendly printing process</li>
                <li>• Shipped worldwide</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Care Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Machine wash cold, inside out</li>
                <li>• Tumble dry low or hang dry</li>
                <li>• Do not iron directly on print</li>
                <li>• Do not dry clean</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
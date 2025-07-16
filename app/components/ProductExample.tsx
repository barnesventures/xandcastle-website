'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProducts, getProductDetails, formatPrice } from '@/app/lib/printify-client';
import type { ProductListItem, ProductDetails } from '@/app/lib/printify-client';

export function ProductExample() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (productId: string) => {
    try {
      const details = await getProductDetails(productId);
      setSelectedProduct(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product details');
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProductClick(product.id)}
          >
            {product.images[0] && (
              <Image
                src={product.images[0].src}
                alt={product.title}
                width={300}
                height={192}
                className="w-full h-48 object-cover mb-2 rounded"
              />
            )}
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.variant_count} variants</p>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
            <p className="mb-4">{selectedProduct.description}</p>
            
            <div className="mb-4">
              <p className="font-semibold">
                Price: {formatPrice(selectedProduct.price_range.min)} - {formatPrice(selectedProduct.price_range.max)}
              </p>
            </div>

            <h3 className="font-semibold mb-2">Available Variants:</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedProduct.variants
                .filter(v => v.is_available && v.is_enabled)
                .map((variant) => (
                  <div key={variant.id} className="border rounded p-2">
                    <p className="text-sm">{variant.title}</p>
                    <p className="text-sm font-semibold">{formatPrice(variant.price)}</p>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
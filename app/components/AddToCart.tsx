'use client';

import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { ProductDetails } from '@/app/lib/printify-client';
import { formatPrice } from '@/app/lib/printify-client';

interface AddToCartProps {
  product: ProductDetails;
}

export function AddToCart({ product }: AddToCartProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Get available variants
  const availableVariants = product.variants.filter(v => v.is_available && v.is_enabled);
  
  // Group variants by color
  const variantsByColor = availableVariants.reduce((acc, variant) => {
    const color = variant.options.color;
    if (!acc[color]) acc[color] = [];
    acc[color].push(variant);
    return acc;
  }, {} as Record<string, typeof availableVariants>);

  const selectedVariant = selectedVariantId 
    ? availableVariants.find(v => v.id === selectedVariantId)
    : null;

  const handleAddToCart = async () => {
    if (!selectedVariantId || !selectedVariant) {
      setError('Please select size and color');
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      addItem(product, selectedVariantId, quantity);
      // Reset after successful add
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(variantsByColor).map((color) => {
            const variantsForColor = variantsByColor[color];
            const isSelected = selectedVariant?.options.color === color;
            
            return (
              <button
                key={color}
                onClick={() => {
                  // Select the first variant of this color
                  setSelectedVariantId(variantsForColor[0].id);
                  setError(null);
                }}
                className={`px-4 py-2 border rounded-md transition ${
                  isSelected
                    ? 'border-xandcastle-purple bg-xandcastle-purple text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      {selectedVariant && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {variantsByColor[selectedVariant.options.color].map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariantId(variant.id);
                  setError(null);
                }}
                className={`px-4 py-2 border rounded-md transition ${
                  selectedVariantId === variant.id
                    ? 'border-xandcastle-purple bg-xandcastle-purple text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {variant.options.size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Display */}
      {selectedVariant && (
        <div className="text-lg font-semibold">
          {formatPrice(selectedVariant.price)}
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !selectedVariantId}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
          isAdding || !selectedVariantId
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-xandcastle-purple text-white hover:bg-purple-700'
        }`}
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
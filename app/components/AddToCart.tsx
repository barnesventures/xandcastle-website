'use client';

import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { ProductDetails } from '@/app/lib/printify-client';
import { formatPrice } from '@/app/lib/printify-client';
import { useTranslations } from 'next-intl';
import { VariantStockBadge } from '@/app/components/StockBadge';
import { RestockNotification } from '@/app/components/RestockNotification';

interface AddToCartProps {
  product: ProductDetails;
}

export function AddToCart({ product }: AddToCartProps) {
  const { addItem } = useCart();
  const t = useTranslations();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Get all enabled variants (including out of stock ones)
  const allVariants = product.variants.filter(v => v.is_enabled);
  const availableVariants = allVariants.filter(v => v.is_available || (v.inStock !== false));
  
  // Group all variants by color (including out of stock)
  const variantsByColor = allVariants.reduce((acc, variant) => {
    const color = variant.options.color;
    if (!acc[color]) acc[color] = [];
    acc[color].push(variant);
    return acc;
  }, {} as Record<string, typeof allVariants>);

  const selectedVariant = selectedVariantId 
    ? allVariants.find(v => v.id === selectedVariantId)
    : null;

  const handleAddToCart = async () => {
    if (!selectedVariantId || !selectedVariant) {
      setError(t('products.options.selectSize') + ' & ' + t('products.options.selectColor'));
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      addItem(product, selectedVariantId, quantity);
      // Reset after successful add
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.general'));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('products.options.color')}
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
            {t('products.options.size')}
          </label>
          <div className="flex flex-wrap gap-2">
            {variantsByColor[selectedVariant.options.color].map((variant) => {
              const isInStock = variant.is_available || (variant.inStock !== false);
              const isSelected = selectedVariantId === variant.id;
              
              return (
                <div key={variant.id} className="relative">
                  <button
                    onClick={() => {
                      if (isInStock) {
                        setSelectedVariantId(variant.id);
                        setError(null);
                      }
                    }}
                    disabled={!isInStock}
                    className={`px-4 py-2 border rounded-md transition ${
                      isSelected
                        ? 'border-xandcastle-purple bg-xandcastle-purple text-white'
                        : isInStock
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {variant.options.size}
                  </button>
                  {!isInStock && (
                    <span className="absolute -top-2 -right-2 bg-red-100 text-red-700 text-xs px-1 rounded">
                      Out
                    </span>
                  )}
                </div>
              );
            })}
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
          {t('products.options.quantity')}
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
        disabled={isAdding || !selectedVariantId || (selectedVariant && !selectedVariant.is_available && selectedVariant.inStock === false)}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
          isAdding || !selectedVariantId || (selectedVariant && !selectedVariant.is_available && selectedVariant.inStock === false)
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-xandcastle-purple text-white hover:bg-purple-700'
        }`}
      >
        {isAdding ? t('common.loading') : 
         selectedVariant && !selectedVariant.is_available && selectedVariant.inStock === false ? 'Out of Stock' : 
         t('common.addToCart')}
      </button>

      {/* Restock Notification */}
      {selectedVariant && !selectedVariant.is_available && selectedVariant.inStock === false && (
        <RestockNotification
          productId={product.id}
          variantId={selectedVariant.id}
          variantTitle={selectedVariant.title}
          className="mt-4"
        />
      )}
    </div>
  );
}
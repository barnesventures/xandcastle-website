'use client';

import { useCart } from '@/app/contexts/CartContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import Image from 'next/image';
import Link from 'next/link';

export function CartClient() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const { convertPrice, formatPrice } = useCurrency();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Link 
            href="/shop" 
            className="inline-block bg-xandcastle-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {item.image && (
                    <div className="w-full sm:w-32 h-48 sm:h-32 relative">
                      <Image
                        src={item.image}
                        alt={`${item.title} - ${item.variantTitle || 'Product image'}`}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 640px) 100vw, 128px"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-600">
                      {item.variantTitle}
                      {item.color && <span className="ml-2">Color: {item.color}</span>}
                      {item.size && <span className="ml-2">Size: {item.size}</span>}
                    </p>
                    <p className="font-semibold mt-2">{formatPrice(convertPrice(item.price))}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={clearCart}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Clear Cart
            </button>
            <Link 
              href="/shop" 
              className="text-xandcastle-purple hover:text-purple-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(convertPrice(subtotal))}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(convertPrice(subtotal))}</span>
              </div>
            </div>
            
            <Link
              href="/checkout"
              className="block w-full bg-xandcastle-purple text-white text-center py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
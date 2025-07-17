'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/app/contexts/CartContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import Image from 'next/image';
import * as gtag from '@/app/utils/analytics';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { currentCurrency, convertPrice, formatPrice } = useCurrency();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    } else {
      // Track begin checkout event
      const cartValue = subtotal / 100; // Convert cents to currency units
      gtag.beginCheckout({
        currency: currentCurrency,
        value: cartValue,
        items: items.map(item => ({
          item_id: item.productId,
          item_name: item.title,
          item_category: 'Apparel',
          item_variant: item.variantTitle,
          price: item.price / 100,
          quantity: item.quantity
        }))
      });
    }
  }, [items, router]);

  // Calculate totals
  const shipping = 500; // $5.00 in cents - this should come from Printify API
  const tax = Math.round(subtotal * 0.08); // 8% tax - this should be calculated properly
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
          currency: currentCurrency,
          customerEmail: customerInfo.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Use Stripe.js as fallback
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Information</h2>

            {/* Guest/Account Toggle */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setIsGuest(true)}
                  className={`px-4 py-2 rounded-md ${
                    isGuest
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Guest Checkout
                </button>
                <button
                  type="button"
                  onClick={() => setIsGuest(false)}
                  className={`px-4 py-2 rounded-md ${
                    !isGuest
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sign In
                </button>
              </div>
              {!isGuest && (
                <p className="mt-2 text-sm text-gray-600">
                  Sign in feature coming soon. Please use guest checkout for now.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={isLoading || !isGuest}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Processing...</span>
                  </span>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  {item.image && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.color && `Color: ${item.color}`}
                      {item.color && item.size && ' • '}
                      {item.size && `Size: ${item.size}`}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(convertPrice(item.price * item.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(convertPrice(subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatPrice(convertPrice(shipping))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatPrice(convertPrice(tax))}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(convertPrice(total))}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">
                Your payment information will be processed securely by Stripe.
                We never store your credit card details.
              </p>
              <div className="mt-3 flex items-center space-x-2">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                  <path fill="#635BFF" d="M0 0h32v32H0z"/>
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M13.055 7.75c0-.691.566-1.25 1.265-1.25 2.363 0 3.495.907 3.495 2.646 0 1.01-.525 1.72-1.505 2.36-.747.49-1.012.776-1.012 1.234 0 .05.003.098.008.145h-1.607a2.67 2.67 0 01-.018-.323c0-.836.357-1.352 1.297-1.957.778-.5 1.083-.837 1.083-1.336 0-.825-.602-1.269-1.74-1.269-.692 0-1.266-.559-1.266-1.25zm1.227 7.48c.706 0 1.155.452 1.155 1.094 0 .65-.449 1.102-1.155 1.102-.697 0-1.154-.451-1.154-1.102 0-.642.457-1.093 1.154-1.093z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-600">Powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
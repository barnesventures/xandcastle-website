'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface SessionData {
  id: string;
  status: string;
  payment_status: string;
  customer_email: string;
  customer_name: string;
  amount_total: number;
  currency: string;
  metadata: Record<string, string>;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Fetch session data
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/checkout/session/${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const data = await response.json();
        setSessionData(data);

        // Clear the cart after successful payment
        if (data.payment_status === 'paid') {
          clearCart();
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [searchParams, router, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase
            </p>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{sessionData.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{sessionData.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(sessionData.amount_total / 100, sessionData.currency.toUpperCase())}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">What happens next?</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your items will be printed and prepared for shipping</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You'll receive a shipping notification once your order is on its way</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Estimated delivery time: 5-10 business days</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              Continue Shopping
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
            >
              View All Products
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Have questions about your order?{' '}
              <a href="mailto:support@xandcastle.com" className="text-purple-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
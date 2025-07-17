'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber: string;
    email: string;
    trackingUrl: string;
  } | null>(null);

  useEffect(() => {
    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email');
    
    if (orderNumber && email) {
      setOrderDetails({
        orderNumber,
        email,
        trackingUrl: `/orders/track?order=${orderNumber}&email=${encodeURIComponent(email)}`,
      });
    }
  }, [searchParams]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Order Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon and Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Your order number is:</p>
            <p className="text-2xl font-bold text-gray-900 mb-4">{orderDetails.orderNumber}</p>
            <p className="text-gray-600">
              A confirmation email has been sent to:
            </p>
            <p className="font-medium text-gray-900 mb-6">{orderDetails.email}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex">
                <span className="font-bold mr-2">1.</span>
                <span>We'll start preparing your order for production</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">2.</span>
                <span>You'll receive an email when your order ships</span>
              </li>
              <li className="flex">
                <span className="font-bold mr-2">3.</span>
                <span>Track your order anytime using your order number and email</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={orderDetails.trackingUrl}
            className="inline-block bg-black text-white px-6 py-3 rounded-md text-center hover:bg-gray-800 transition-colors"
          >
            Track Your Order
          </Link>
          <Link
            href="/shop"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-center hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center text-gray-600">
          <p>Need help? Contact us at:</p>
          <a href="mailto:support@xandcastle.com" className="text-blue-600 hover:underline">
            support@xandcastle.com
          </a>
        </div>
      </div>
    </div>
  );
}
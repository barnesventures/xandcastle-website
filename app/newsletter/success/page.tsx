'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import * as gtag from '@/app/utils/analytics';

export default function NewsletterSuccessPage() {
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';
  const message = searchParams.get('message');

  useEffect(() => {
    // Track successful newsletter signup
    if (isWelcome) {
      gtag.signUp('newsletter_confirmed');
    }
  }, [isWelcome]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
        </div>
        
        {isWelcome ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to the Castle Crew!
            </h1>
            <p className="text-gray-600 mb-6">
              You're all set! Check your email for your welcome gift and get ready for awesome updates.
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
              <p className="text-purple-800 font-semibold">
                🎁 Don't forget to use your welcome code:
              </p>
              <p className="text-2xl font-bold text-purple-900 mt-2">CASTLE10</p>
              <p className="text-sm text-purple-700 mt-1">10% off your first order!</p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {message || 'Success!'}
            </h1>
            <p className="text-gray-600 mb-6">
              You're already part of the Castle Crew! Keep an eye on your inbox for exciting updates.
            </p>
          </>
        )}
        
        <div className="space-y-3">
          <Link
            href="/shop"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition duration-200"
          >
            Start Shopping 🛍️
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
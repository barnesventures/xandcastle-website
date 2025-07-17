'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function NewsletterErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Something went wrong';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops!
        </h1>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition duration-200"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition duration-200"
          >
            Contact Support
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Need help? Email us at support@xandcastle.com
        </p>
      </div>
    </div>
  );
}
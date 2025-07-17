'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function NewsletterUnsubscribePage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const already = searchParams.get('already') === 'true';
  const error = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setUnsubscribeStatus('success');
        setEmail('');
      } else {
        setUnsubscribeStatus('error');
      }
    } catch (error) {
      setUnsubscribeStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (success || already) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👋</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {already ? 'Already Unsubscribed' : 'Successfully Unsubscribed'}
          </h1>
          <p className="text-gray-600 mb-6">
            {already 
              ? "You're already unsubscribed from our newsletter."
              : "We're sad to see you go! You've been unsubscribed from the Castle Crew newsletter."
            }
          </p>
          
          <p className="text-gray-500 mb-6">
            Changed your mind? You can always rejoin the crew!
          </p>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">❌</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Invalid Link
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            {error}
          </p>
          
          <p className="text-gray-500 mb-6 text-center">
            You can unsubscribe by entering your email below:
          </p>
          
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={isLoading || unsubscribeStatus === 'success'}
            />
            
            <button
              type="submit"
              disabled={isLoading || unsubscribeStatus === 'success'}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-700 transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Unsubscribe'}
            </button>
          </form>
          
          {unsubscribeStatus === 'success' && (
            <p className="mt-4 text-green-600 text-center">
              You've been successfully unsubscribed!
            </p>
          )}
          
          {unsubscribeStatus === 'error' && (
            <p className="mt-4 text-red-600 text-center">
              Something went wrong. Please try again or contact support.
            </p>
          )}
          
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default unsubscribe form (when no parameters)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📧</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Unsubscribe from Newsletter
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email to unsubscribe from the Castle Crew newsletter.
        </p>
        
        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={isLoading || unsubscribeStatus === 'success'}
          />
          
          <button
            type="submit"
            disabled={isLoading || unsubscribeStatus === 'success'}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-700 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Unsubscribe'}
          </button>
        </form>
        
        {unsubscribeStatus === 'success' && (
          <p className="mt-4 text-green-600 text-center">
            You've been successfully unsubscribed!
          </p>
        )}
        
        {unsubscribeStatus === 'error' && (
          <p className="mt-4 text-red-600 text-center">
            Something went wrong. Please try again or contact support.
          </p>
        )}
        
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
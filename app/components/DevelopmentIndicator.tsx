'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon, CodeBracketIcon, BeakerIcon } from '@heroicons/react/24/outline';

export default function DevelopmentIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check localStorage for visibility preference
    const hidden = localStorage.getItem('dev-indicator-hidden');
    if (hidden === 'true') {
      setIsVisible(false);
    }
    
    const minimized = localStorage.getItem('dev-indicator-minimized');
    if (minimized === 'true') {
      setIsMinimized(true);
    }
  }, []);

  const handleHide = () => {
    setIsVisible(false);
    localStorage.setItem('dev-indicator-hidden', 'true');
  };

  const handleToggleMinimize = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    localStorage.setItem('dev-indicator-minimized', String(newMinimized));
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={handleToggleMinimize}
          className="bg-yellow-500 text-white p-2 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          title="Expand development indicator"
        >
          <CodeBracketIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <div className="bg-yellow-500 text-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BeakerIcon className="w-5 h-5" />
              <span className="font-semibold">Development Mode</span>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={handleToggleMinimize}
                className="text-white/80 hover:text-white"
                title="Minimize"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={handleHide}
                className="text-white/80 hover:text-white"
                title="Hide (refresh to show again)"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-yellow-100 space-y-1">
            <p>You are viewing the development build.</p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-white underline hover:no-underline"
            >
              {showDetails ? 'Hide' : 'Show'} details
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-yellow-400 text-xs text-yellow-100 space-y-1">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>Next.js: {process.env.NEXT_PUBLIC_VERCEL_ENV || 'local'}</div>
              <div className="mt-2 space-y-1">
                <div className="font-semibold">Test Accounts:</div>
                <div>User: test@example.com / testpassword123</div>
                <div>Admin: admin@xandcastle.com / testpassword123</div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="font-semibold">Useful Links:</div>
                <Link href="/api/printify/products" className="block underline hover:no-underline">
                  API: Products
                </Link>
                <Link href="/admin" className="block underline hover:no-underline">
                  Admin Dashboard
                </Link>
                <Link href="/test-currency" className="block underline hover:no-underline">
                  Currency Test Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Development-only debug panel
export function DebugPanel({ data }: { data: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-mono"
      >
        {isOpen ? 'Close' : 'Debug'}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-h-96 overflow-auto bg-gray-900 text-white p-4 rounded-lg shadow-xl">
          <pre className="text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
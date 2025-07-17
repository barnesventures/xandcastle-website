'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '../contexts/CookieConsentContext';

export function CookieConsentBanner() {
  const { showBanner, giveConsent, analyticsConsent, marketingConsent, functionalConsent } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [functional, setFunctional] = useState(true);

  if (!showBanner) return null;

  const handleAcceptAll = () => {
    giveConsent(true, true, true);
  };

  const handleAcceptSelected = () => {
    giveConsent(analytics, marketing, functional);
  };

  const handleRejectAll = () => {
    giveConsent(false, false, false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 We use cookies to make your experience magical!
            </h3>
            <p className="text-sm text-gray-600">
              We use cookies to personalize content, analyze traffic, and improve your experience. 
              By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              {' '}
              <Link href="/cookies" className="text-xandcastle-purple hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRejectAll}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-2 text-sm font-medium text-xandcastle-purple border border-xandcastle-purple rounded-lg hover:bg-purple-50 transition-colors"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink rounded-lg hover:shadow-lg transition-all"
            >
              Accept All
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Customize your cookie preferences
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="necessary"
                  checked={true}
                  disabled
                  className="mt-1 h-4 w-4 text-xandcastle-purple rounded cursor-not-allowed"
                />
                <label htmlFor="necessary" className="ml-3 flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    Necessary Cookies
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Essential for the website to function. Cannot be disabled.
                  </p>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 text-xandcastle-purple rounded focus:ring-xandcastle-purple"
                />
                <label htmlFor="analytics" className="ml-3 flex-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">
                    Analytics Cookies
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Help us understand how visitors interact with our website.
                  </p>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 text-xandcastle-purple rounded focus:ring-xandcastle-purple"
                />
                <label htmlFor="marketing" className="ml-3 flex-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">
                    Marketing Cookies
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Used to deliver personalized advertisements.
                  </p>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="functional"
                  checked={functional}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="mt-1 h-4 w-4 text-xandcastle-purple rounded focus:ring-xandcastle-purple"
                />
                <label htmlFor="functional" className="ml-3 flex-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">
                    Functional Cookies
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Enable enhanced functionality and personalization.
                  </p>
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAcceptSelected}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink rounded-lg hover:shadow-lg transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
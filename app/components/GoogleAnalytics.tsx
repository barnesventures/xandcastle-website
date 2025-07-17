'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import * as gtag from '../utils/analytics';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { analyticsConsent } = useCookieConsent();
  
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Track page views when route changes
  useEffect(() => {
    if (analyticsConsent && gaMeasurementId) {
      const url = pathname + searchParams.toString();
      gtag.pageview(url);
    }
  }, [pathname, searchParams, analyticsConsent, gaMeasurementId]);

  // Don't load GA if no measurement ID or no consent
  if (!gaMeasurementId || !analyticsConsent) {
    return null;
  }

  // Don't load in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Google Analytics is disabled in development mode');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent mode
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'granted',
              'security_storage': 'granted'
            });

            gtag('config', '${gaMeasurementId}', {
              page_path: window.location.pathname,
              cookie_flags: 'secure;samesite=strict'
            });
          `,
        }}
      />
    </>
  );
}
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CookieConsentContextType {
  hasConsent: boolean | null;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  functionalConsent: boolean;
  giveConsent: (analytics: boolean, marketing: boolean, functional: boolean) => void;
  revokeConsent: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const CONSENT_COOKIE_NAME = 'xandcastle-cookie-consent';
const CONSENT_COOKIE_DAYS = 365;

interface ConsentData {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: number;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [functionalConsent, setFunctionalConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Read consent from cookies on mount
  useEffect(() => {
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (consentCookie) {
      try {
        const consentData: ConsentData = JSON.parse(
          decodeURIComponent(consentCookie.split('=')[1])
        );
        
        setHasConsent(true);
        setAnalyticsConsent(consentData.analytics);
        setMarketingConsent(consentData.marketing);
        setFunctionalConsent(consentData.functional);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing consent cookie:', error);
        setHasConsent(false);
        setShowBanner(true);
      }
    } else {
      setHasConsent(false);
      setShowBanner(true);
    }
  }, []);

  const giveConsent = (analytics: boolean, marketing: boolean, functional: boolean) => {
    const consentData: ConsentData = {
      analytics,
      marketing,
      functional,
      timestamp: Date.now()
    };

    // Set cookie
    const expires = new Date();
    expires.setDate(expires.getDate() + CONSENT_COOKIE_DAYS);
    
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
      JSON.stringify(consentData)
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    // Update state
    setHasConsent(true);
    setAnalyticsConsent(analytics);
    setMarketingConsent(marketing);
    setFunctionalConsent(functional);
    setShowBanner(false);

    // Trigger Google Analytics if consent given
    if (analytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const revokeConsent = () => {
    // Remove cookie
    document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Update state
    setHasConsent(false);
    setAnalyticsConsent(false);
    setMarketingConsent(false);
    setFunctionalConsent(false);
    setShowBanner(true);

    // Update Google Analytics consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsent,
        analyticsConsent,
        marketingConsent,
        functionalConsent,
        giveConsent,
        revokeConsent,
        showBanner,
        setShowBanner
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
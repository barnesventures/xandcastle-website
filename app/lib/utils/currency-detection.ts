import { SupportedCurrency } from '../types/currency';
import { COUNTRY_CURRENCY_MAP, DEFAULT_CURRENCY } from '../constants/currency';

/**
 * Detect user's preferred currency based on browser settings
 */
export function detectCurrencyFromBrowser(): SupportedCurrency | null {
  if (typeof window === 'undefined') return null;

  try {
    // Try to get currency from browser's language settings
    const locale = navigator.language || navigator.languages[0];
    const countryCode = locale.split('-')[1]?.toUpperCase();

    if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
      return COUNTRY_CURRENCY_MAP[countryCode];
    }

    // Try Intl API
    if (Intl && Intl.NumberFormat) {
      const formatter = new Intl.NumberFormat();
      const options = formatter.resolvedOptions();
      const currency = options.currency as SupportedCurrency;
      
      if (currency && ['USD', 'GBP', 'EUR'].includes(currency)) {
        return currency;
      }
    }
  } catch (error) {
    console.warn('Error detecting currency from browser:', error);
  }

  return null;
}

/**
 * Detect user's location and preferred currency using IP geolocation
 * Using ipapi.co free tier (1000 requests/day)
 */
export async function detectCurrencyFromGeolocation(): Promise<SupportedCurrency | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Geolocation API request failed');
    }

    const data = await response.json();
    const countryCode = data.country_code?.toUpperCase();

    if (countryCode && COUNTRY_CURRENCY_MAP[countryCode]) {
      return COUNTRY_CURRENCY_MAP[countryCode];
    }

    // Check if the API returned a currency directly
    const currency = data.currency?.toUpperCase() as SupportedCurrency;
    if (currency && ['USD', 'GBP', 'EUR'].includes(currency)) {
      return currency;
    }
  } catch (error) {
    console.warn('Error detecting currency from geolocation:', error);
  }

  return null;
}

/**
 * Auto-detect user's preferred currency using multiple methods
 * 1. Check localStorage for saved preference
 * 2. Try browser language settings
 * 3. Try geolocation API
 * 4. Fall back to USD
 */
export async function autoDetectCurrency(storageKey: string): Promise<SupportedCurrency> {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(storageKey);
    if (saved && ['USD', 'GBP', 'EUR'].includes(saved)) {
      return saved as SupportedCurrency;
    }
  }

  // Try browser detection
  const browserCurrency = detectCurrencyFromBrowser();
  if (browserCurrency) {
    return browserCurrency;
  }

  // Try geolocation as last resort
  const geoCurrency = await detectCurrencyFromGeolocation();
  if (geoCurrency) {
    return geoCurrency;
  }

  // Default to USD
  return DEFAULT_CURRENCY;
}
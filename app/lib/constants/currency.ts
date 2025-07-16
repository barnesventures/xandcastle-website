import { Currency, SupportedCurrency } from '../types/currency';

export const CURRENCIES: Record<SupportedCurrency, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-DE',
  },
};

// Country to currency mapping for auto-detection
export const COUNTRY_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  // United States
  US: 'USD',
  // United Kingdom
  GB: 'GBP',
  UK: 'GBP',
  // Eurozone countries
  DE: 'EUR', // Germany
  FR: 'EUR', // France
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  PT: 'EUR', // Portugal
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  AT: 'EUR', // Austria
  IE: 'EUR', // Ireland
  FI: 'EUR', // Finland
  GR: 'EUR', // Greece
  // Add more as needed
};

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';

// Cache duration for exchange rates (1 hour in milliseconds)
export const EXCHANGE_RATE_CACHE_DURATION = 60 * 60 * 1000;

// LocalStorage keys
export const CURRENCY_STORAGE_KEY = 'xandcastle_currency';
export const EXCHANGE_RATES_STORAGE_KEY = 'xandcastle_exchange_rates';
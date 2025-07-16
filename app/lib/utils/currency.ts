import { SupportedCurrency, ExchangeRate } from '../types/currency';
import { CURRENCIES, EXCHANGE_RATE_CACHE_DURATION } from '../constants/currency';

// Exchange rate API endpoint (using exchangerate-api.com free tier)
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

// Mock exchange rates for development/fallback
const MOCK_EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,
  GBP: 0.79,
  EUR: 0.92,
};

/**
 * Fetch exchange rates from API
 * Falls back to mock rates if API fails
 */
export async function fetchExchangeRates(): Promise<Map<string, ExchangeRate>> {
  const exchangeRates = new Map<string, ExchangeRate>();
  const timestamp = Date.now();

  try {
    const response = await fetch(EXCHANGE_API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    const rates = data.rates;

    // Create exchange rate entries for each supported currency
    Object.entries(CURRENCIES).forEach(([currencyCode]) => {
      const code = currencyCode as SupportedCurrency;
      const rate = rates[code] || MOCK_EXCHANGE_RATES[code];
      
      // Store USD to target currency rate
      const key = `USD-${code}`;
      exchangeRates.set(key, {
        base: 'USD',
        target: code,
        rate,
        timestamp,
      });
    });
  } catch (error) {
    console.warn('Failed to fetch live exchange rates, using mock rates:', error);
    
    // Use mock rates as fallback
    Object.entries(MOCK_EXCHANGE_RATES).forEach(([code, rate]) => {
      const key = `USD-${code as SupportedCurrency}`;
      exchangeRates.set(key, {
        base: 'USD',
        target: code as SupportedCurrency,
        rate,
        timestamp,
      });
    });
  }

  return exchangeRates;
}

/**
 * Convert price from one currency to another
 * @param priceInCents - Price in cents
 * @param from - Source currency (default: USD)
 * @param to - Target currency
 * @param exchangeRates - Map of exchange rates
 */
export function convertCurrency(
  priceInCents: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  exchangeRates: Map<string, ExchangeRate>
): number {
  if (from === to) {
    return priceInCents;
  }

  // All our rates are stored as USD to X
  // So we need to convert via USD if necessary
  let priceInUsdCents = priceInCents;
  
  // Convert to USD first if source is not USD
  if (from !== 'USD') {
    const fromRate = exchangeRates.get(`USD-${from}`)?.rate || MOCK_EXCHANGE_RATES[from];
    priceInUsdCents = priceInCents / fromRate;
  }

  // Convert from USD to target currency
  if (to !== 'USD') {
    const toRate = exchangeRates.get(`USD-${to}`)?.rate || MOCK_EXCHANGE_RATES[to];
    return Math.round(priceInUsdCents * toRate);
  }

  return Math.round(priceInUsdCents);
}

/**
 * Format price with currency symbol and proper formatting
 * @param priceInCents - Price in cents
 * @param currency - Currency code
 */
export function formatCurrency(priceInCents: number, currency: SupportedCurrency): string {
  const { locale } = CURRENCIES[currency];
  const priceInUnits = priceInCents / 100;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInUnits);
}

/**
 * Check if exchange rates are stale and need refreshing
 */
export function areExchangeRatesStale(exchangeRates: Map<string, ExchangeRate>): boolean {
  if (exchangeRates.size === 0) return true;

  const firstRate = exchangeRates.values().next().value;
  if (!firstRate) return true;

  const age = Date.now() - firstRate.timestamp;
  return age > EXCHANGE_RATE_CACHE_DURATION;
}

/**
 * Serialize exchange rates for localStorage
 */
export function serializeExchangeRates(exchangeRates: Map<string, ExchangeRate>): string {
  const ratesArray = Array.from(exchangeRates.entries());
  return JSON.stringify(ratesArray);
}

/**
 * Deserialize exchange rates from localStorage
 */
export function deserializeExchangeRates(serialized: string): Map<string, ExchangeRate> {
  try {
    const ratesArray = JSON.parse(serialized);
    return new Map(ratesArray);
  } catch {
    return new Map();
  }
}
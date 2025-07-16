// Currency Type Definitions

export type SupportedCurrency = 'USD' | 'GBP' | 'EUR';

export interface Currency {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
}

export interface ExchangeRate {
  base: SupportedCurrency;
  target: SupportedCurrency;
  rate: number;
  timestamp: number;
}

export interface CurrencyContextType {
  currentCurrency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  exchangeRates: Map<string, ExchangeRate>;
  isLoading: boolean;
  convertPrice: (priceInCents: number, from?: SupportedCurrency, to?: SupportedCurrency) => number;
  formatPrice: (priceInCents: number, currency?: SupportedCurrency) => string;
}

export interface GeolocationResponse {
  country_code: string;
  country_name: string;
  currency?: string;
}
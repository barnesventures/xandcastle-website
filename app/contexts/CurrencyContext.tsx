'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SupportedCurrency, 
  CurrencyContextType, 
  ExchangeRate 
} from '@/app/lib/types/currency';
import { 
  DEFAULT_CURRENCY, 
  CURRENCY_STORAGE_KEY, 
  EXCHANGE_RATES_STORAGE_KEY 
} from '@/app/lib/constants/currency';
import { 
  fetchExchangeRates, 
  convertCurrency, 
  formatCurrency,
  areExchangeRatesStale,
  serializeExchangeRates,
  deserializeExchangeRates
} from '@/app/lib/utils/currency';
import { autoDetectCurrency } from '@/app/lib/utils/currency-detection';

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<SupportedCurrency>(DEFAULT_CURRENCY);
  const [exchangeRates, setExchangeRates] = useState<Map<string, ExchangeRate>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Load exchange rates from localStorage or fetch new ones
  const loadExchangeRates = useCallback(async () => {
    try {
      // Check localStorage first
      const savedRates = localStorage.getItem(EXCHANGE_RATES_STORAGE_KEY);
      let rates: Map<string, ExchangeRate>;

      if (savedRates) {
        rates = deserializeExchangeRates(savedRates);
        
        // Check if rates are stale
        if (areExchangeRatesStale(rates)) {
          rates = await fetchExchangeRates();
          localStorage.setItem(EXCHANGE_RATES_STORAGE_KEY, serializeExchangeRates(rates));
        }
      } else {
        rates = await fetchExchangeRates();
        localStorage.setItem(EXCHANGE_RATES_STORAGE_KEY, serializeExchangeRates(rates));
      }

      setExchangeRates(rates);
    } catch (error) {
      console.error('Error loading exchange rates:', error);
      // Will use mock rates as fallback
    }
  }, []);

  // Initialize currency and exchange rates
  useEffect(() => {
    const initializeCurrency = async () => {
      setIsLoading(true);
      
      try {
        // Load exchange rates
        await loadExchangeRates();
        
        // Auto-detect currency
        const detectedCurrency = await autoDetectCurrency(CURRENCY_STORAGE_KEY);
        setCurrentCurrency(detectedCurrency);
      } catch (error) {
        console.error('Error initializing currency:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, [loadExchangeRates]);

  // Refresh exchange rates periodically (every hour)
  useEffect(() => {
    const interval = setInterval(() => {
      loadExchangeRates();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [loadExchangeRates]);

  // Set currency and save to localStorage
  const setCurrency = useCallback((currency: SupportedCurrency) => {
    setCurrentCurrency(currency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, []);

  // Convert price utility
  const convertPrice = useCallback(
    (priceInCents: number, from: SupportedCurrency = 'USD', to?: SupportedCurrency) => {
      const targetCurrency = to || currentCurrency;
      return convertCurrency(priceInCents, from, targetCurrency, exchangeRates);
    },
    [currentCurrency, exchangeRates]
  );

  // Format price utility
  const formatPrice = useCallback(
    (priceInCents: number, currency?: SupportedCurrency) => {
      const targetCurrency = currency || currentCurrency;
      return formatCurrency(priceInCents, targetCurrency);
    },
    [currentCurrency]
  );

  const value: CurrencyContextType = {
    currentCurrency,
    setCurrency,
    exchangeRates,
    isLoading,
    convertPrice,
    formatPrice,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
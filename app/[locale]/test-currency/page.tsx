'use client';

import { useCurrency } from '@/app/contexts/CurrencyContext';
import { CURRENCIES } from '@/app/lib/constants/currency';
import { SupportedCurrency } from '@/app/lib/types/currency';

export default function TestCurrencyPage() {
  const { currentCurrency, setCurrency, convertPrice, formatPrice, isLoading, exchangeRates } = useCurrency();

  // Test prices in USD cents
  const testPrices = [
    { name: 'Basic T-Shirt', price: 2499 }, // $24.99
    { name: 'Premium Hoodie', price: 4999 }, // $49.99
    { name: 'Kids Shirt', price: 1999 }, // $19.99
    { name: 'Windsor Castle Tee', price: 2999 }, // $29.99
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Currency System Test</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Settings</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="mb-2">
            <strong>Selected Currency:</strong> {CURRENCIES[currentCurrency].name} ({currentCurrency})
          </p>
          <p className="mb-2">
            <strong>Currency Symbol:</strong> {CURRENCIES[currentCurrency].symbol}
          </p>
          <p>
            <strong>Exchange Rates Loaded:</strong> {exchangeRates.size > 0 ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Currency Selector</h2>
        <div className="flex gap-2">
          {Object.entries(CURRENCIES).map(([code, currency]) => (
            <button
              key={code}
              onClick={() => setCurrency(code as SupportedCurrency)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentCurrency === code
                  ? 'bg-xandcastle-purple text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {currency.symbol} {currency.code}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testPrices.map((product) => (
            <div key={product.name} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  USD Price: {formatPrice(product.price, 'USD')}
                </p>
                <p className="text-lg font-semibold text-xandcastle-purple">
                  {currentCurrency} Price: {formatPrice(convertPrice(product.price))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Exchange Rates</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {Array.from(exchangeRates.entries()).map(([key, rate]) => (
            <p key={key} className="mb-1">
              <strong>{key}:</strong> {rate.rate.toFixed(4)} (Updated: {new Date(rate.timestamp).toLocaleString()})
            </p>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Conversion Examples</h2>
        <div className="space-y-2">
          <p>$100 USD = {formatPrice(convertPrice(10000, 'USD', 'GBP'), 'GBP')}</p>
          <p>$100 USD = {formatPrice(convertPrice(10000, 'USD', 'EUR'), 'EUR')}</p>
          <p>£100 GBP = {formatPrice(convertPrice(10000, 'GBP', 'USD'), 'USD')}</p>
          <p>€100 EUR = {formatPrice(convertPrice(10000, 'EUR', 'USD'), 'USD')}</p>
        </div>
      </div>
    </div>
  );
}
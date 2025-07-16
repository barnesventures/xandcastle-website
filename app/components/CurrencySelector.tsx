'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { CURRENCIES } from '@/app/lib/constants/currency';
import { SupportedCurrency } from '@/app/lib/types/currency';

export default function CurrencySelector() {
  const { currentCurrency, setCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    setCurrency(currency);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-20 h-9 bg-gray-100 animate-pulse rounded-md"></div>
    );
  }

  const currentCurrencyData = CURRENCIES[currentCurrency];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-xandcastle-purple focus:ring-offset-2"
        aria-label="Select currency"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="font-semibold">{currentCurrencyData.symbol}</span>
        <span>{currentCurrencyData.code}</span>
        <svg
          className={`w-4 h-4 ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1" role="listbox">
            {Object.entries(CURRENCIES).map(([code, currency]) => (
              <li key={code}>
                <button
                  onClick={() => handleCurrencyChange(code as SupportedCurrency)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                    currentCurrency === code ? 'bg-xandcastle-purple bg-opacity-10 text-xandcastle-purple' : 'text-gray-700'
                  }`}
                  role="option"
                  aria-selected={currentCurrency === code}
                >
                  <span className="flex items-center">
                    <span className="font-semibold mr-2">{currency.symbol}</span>
                    <span>{currency.name}</span>
                  </span>
                  {currentCurrency === code && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
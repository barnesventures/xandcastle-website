'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface RestockNotificationProps {
  productId: string;
  variantId: number;
  variantTitle: string;
  className?: string;
}

export function RestockNotification({ 
  productId, 
  variantId, 
  variantTitle,
  className = '' 
}: RestockNotificationProps) {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/restock-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          productId,
          variantId,
          variantTitle,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'You will be notified when this item is back in stock');
        setEmail(''); // Clear form
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to register for notifications');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        Out of Stock - Get Notified
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Enter your email to be notified when {variantTitle} is back in stock.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isSubmitting || status === 'success'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xandcastle-purple focus:border-transparent disabled:bg-gray-100"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || status === 'success'}
          className={`w-full py-2 px-4 rounded-md font-medium transition ${
            isSubmitting || status === 'success'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-xandcastle-purple text-white hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 
           status === 'success' ? 'Notification Set!' : 
           'Notify Me'}
        </button>

        {/* Status Messages */}
        {status === 'success' && (
          <p className="text-sm text-green-600 mt-2">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
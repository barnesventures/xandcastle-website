'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface NewsletterSubscriber {
  id: string;
  email: string;
  status: string;
  subscribedAt: Date;
  confirmedAt: Date | null;
  source: string | null;
  metadata: any;
}

interface SubscribersClientProps {
  initialSubscribers: NewsletterSubscriber[];
}

export default function SubscribersClient({ initialSubscribers }: SubscribersClientProps) {
  const [subscribers] = useState(initialSubscribers);
  const t = useTranslations('admin.newsletter');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('email', { defaultValue: 'Email' })}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { defaultValue: 'Status' })}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('subscribedAt', { defaultValue: 'Subscribed At' })}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('source', { defaultValue: 'Source' })}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscribers.map((subscriber) => (
            <tr key={subscriber.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {subscriber.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  subscriber.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscriber.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(subscriber.subscribedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subscriber.source || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
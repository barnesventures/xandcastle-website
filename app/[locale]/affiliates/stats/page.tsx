'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { formatCurrency } from '@/app/lib/utils';

interface AffiliateStats {
  affiliate: {
    code: string;
    name: string;
    commissionRate: number;
    totalEarned: number;
    totalPaid: number;
    balance: number;
  };
  stats: {
    clicks: number;
    conversions: number;
    totalSales: number;
    totalCommission: number;
    conversionRate: string;
  };
  recentOrders: Array<{
    orderNumber: string;
    total: number;
    commission: number;
    status: string;
    date: string;
  }>;
}

export default function AffiliateStatsPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStats(null);

    try {
      const params = new URLSearchParams();
      if (code) params.append('code', code);
      if (email) params.append('email', email);

      const response = await fetch(`/api/affiliate/stats?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Affiliate Dashboard</h1>

      {!stats && (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-6">Access Your Stats</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Affiliate Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your code"
              />
            </div>

            <div className="text-center text-sm text-gray-600">OR</div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!code && !email)}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-md font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'View Stats'}
            </button>
          </form>
        </div>
      )}

      {stats && (
        <div className="space-y-8">
          {/* Affiliate Info */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome, {stats.affiliate.name}!</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Your Code</p>
                <p className="text-xl font-bold text-purple-600">{stats.affiliate.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Commission Rate</p>
                <p className="text-xl font-bold">{stats.affiliate.commissionRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(stats.affiliate.balance, 'USD')}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.stats.clicks}</p>
                <p className="text-sm text-gray-600">Clicks</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.stats.conversions}</p>
                <p className="text-sm text-gray-600">Conversions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{stats.stats.conversionRate}%</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{formatCurrency(stats.stats.totalSales, 'USD')}</p>
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(stats.stats.totalCommission, 'USD')}
                </p>
                <p className="text-sm text-gray-600">Total Earned</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          {stats.recentOrders.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Your Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.orderNumber}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.total, 'USD')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(order.commission, 'USD')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Referral Link */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Your Referral Link</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/?ref=${stats.affiliate.code}`}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-md"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/?ref=${stats.affiliate.code}`);
                  alert('Link copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link with your audience to start earning commission!
            </p>
          </div>

          <button
            onClick={() => {
              setStats(null);
              setCode('');
              setEmail('');
            }}
            className="text-purple-600 hover:text-purple-800 underline"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
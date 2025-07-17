'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/app/lib/utils';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface Affiliate {
  id: string;
  code: string;
  name: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'INACTIVE';
  commissionRate: number;
  clicks: number;
  conversions: number;
  totalSales: number;
  totalCommission: number;
  totalPaid: number;
  balance: number;
  lastClickAt: string | null;
  lastConversionAt: string | null;
  createdAt: string;
}

interface AffiliateResponse {
  affiliates: Affiliate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AffiliatesClient() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAffiliates();
  }, [statusFilter, searchQuery, page]);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/admin/affiliates?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch affiliates');
      }
      
      const data: AffiliateResponse = await response.json();
      setAffiliates(data.affiliates);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (affiliateId: string, action: string, data?: any) => {
    try {
      const response = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliateId, action, ...data }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to perform action');
      }
      
      // Refresh the list
      fetchAffiliates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusBadge = (status: Affiliate['status']) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-orange-100 text-orange-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading && affiliates.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or code..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {affiliate.name}
                      </div>
                      <div className="text-sm text-gray-500">{affiliate.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="px-2 py-1 text-sm bg-gray-100 rounded">
                      {affiliate.code}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(affiliate.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {affiliate.commissionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div>Clicks: {affiliate.clicks}</div>
                      <div>Conversions: {affiliate.conversions}</div>
                      <div>
                        Rate: {affiliate.clicks > 0 
                          ? ((affiliate.conversions / affiliate.clicks) * 100).toFixed(1) 
                          : '0.0'}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div>Sales: {formatCurrency(affiliate.totalSales, 'USD')}</div>
                      <div>Commission: {formatCurrency(affiliate.totalCommission, 'USD')}</div>
                      <div className="font-medium">
                        Balance: {formatCurrency(affiliate.balance, 'USD')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col gap-1">
                      {affiliate.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleAction(affiliate.id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(affiliate.id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {affiliate.status === 'APPROVED' && (
                        <button
                          onClick={() => handleAction(affiliate.id, 'suspend')}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Suspend
                        </button>
                      )}
                      {affiliate.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleAction(affiliate.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Reactivate
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const newRate = prompt('Enter new commission rate (%)', affiliate.commissionRate.toString());
                          if (newRate) {
                            handleAction(affiliate.id, 'update', { commissionRate: parseFloat(newRate) });
                          }
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit Rate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
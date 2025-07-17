'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InventoryActions() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncError, setSyncError] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    setSyncError('');

    try {
      const response = await fetch('/api/admin/inventory/sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSyncMessage(
          `Successfully synced ${data.data.productsUpdated} products, checked ${data.data.variantsChecked} variants${
            data.data.restockDetected > 0 ? `, detected ${data.data.restockDetected} restocked items` : ''
          }`
        );
        
        // Refresh the page after successful sync
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        setSyncError(data.error || 'Failed to sync inventory');
      }
    } catch (error) {
      setSyncError('Failed to sync inventory. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Inventory Sync</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sync inventory data from Printify to update stock levels
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isSyncing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-xandcastle-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
          }`}
        >
          {isSyncing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Syncing...
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Sync Now
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {syncMessage && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">{syncMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {syncError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{syncError}</p>
        </div>
      )}
    </div>
  );
}
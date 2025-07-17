'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ErrorMessage } from '@/app/components/ErrorMessage';

interface OrderItem {
  product_id: string;
  variant_id: number;
  quantity: number;
  title: string;
  variant_label: string;
  price: number;
}

interface Shipment {
  carrier: string;
  number: string;
  url: string;
  delivered_at?: string;
}

interface OrderData {
  orderNumber: string;
  status: string;
  fulfillmentStatus: string;
  customerName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  shipping: {
    address: {
      first_name: string;
      last_name: string;
      address1: string;
      address2?: string;
      city: string;
      region?: string;
      country: string;
      zip: string;
    };
    trackingNumber?: string;
    trackingCarrier?: string;
    trackingUrl?: string;
    shipments: Shipment[];
  };
}

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Auto-fetch if URL params are provided
  useEffect(() => {
    if (orderNumber && email) {
      handleTrackOrder();
    }
  }, []);

  const handleTrackOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!orderNumber || !email) {
      setError('Please enter both order number and email');
      return;
    }

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      );
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      setOrderData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      FULFILLED: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusText: Record<string, string> = {
      PENDING: 'Order Pending',
      PROCESSING: 'Processing',
      PAID: 'Payment Confirmed',
      FULFILLED: 'Order Fulfilled',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
      REFUNDED: 'Refunded',
    };
    return statusText[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number and email to check your order status</p>
        </div>

        {/* Tracking Form */}
        {!orderData && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., XC-ABC123-XYZ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner /> : 'Track Order'}
              </button>
            </form>
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order {orderData.orderNumber}
                  </h2>
                  <p className="text-gray-600">
                    Placed on {formatDate(orderData.createdAt)}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  {getStatusText(orderData.status)}
                </span>
              </div>

              {/* Tracking Info */}
              {orderData.shipping.trackingNumber && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tracking Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Carrier</p>
                      <p className="font-medium">{orderData.shipping.trackingCarrier || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium">{orderData.shipping.trackingNumber}</p>
                    </div>
                  </div>
                  {orderData.shipping.trackingUrl && (
                    <a
                      href={orderData.shipping.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Track Package
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.variant_label}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity, orderData.pricing.currency)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(orderData.pricing.subtotal, orderData.pricing.currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{formatPrice(orderData.pricing.shipping, orderData.pricing.currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(orderData.pricing.tax, orderData.pricing.currency)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(orderData.pricing.total, orderData.pricing.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{orderData.shipping.address.first_name} {orderData.shipping.address.last_name}</p>
                <p>{orderData.shipping.address.address1}</p>
                {orderData.shipping.address.address2 && <p>{orderData.shipping.address.address2}</p>}
                <p>
                  {orderData.shipping.address.city}, {orderData.shipping.address.region} {orderData.shipping.address.zip}
                </p>
                <p>{orderData.shipping.address.country}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setOrderData(null);
                  setOrderNumber('');
                  setEmail('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Track Another Order
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Print Order Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
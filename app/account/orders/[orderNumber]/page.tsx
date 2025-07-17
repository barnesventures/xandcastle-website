import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { ChevronLeftIcon, TruckIcon } from '@heroicons/react/24/outline'

function getStatusColor(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800'
    case 'CANCELLED':
    case 'REFUNDED':
      return 'bg-red-100 text-red-800'
    case 'PROCESSING':
    case 'PAID':
    case 'FULFILLED':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatOrderStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')
}

export default async function OrderDetailPage({
  params
}: {
  params: { orderNumber: string }
}) {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: params.orderNumber,
      email: session.user.email
    }
  })

  if (!order) {
    notFound()
  }

  const items = order.items as any[]
  const shippingAddress = order.shippingAddress as any
  const billingAddress = order.billingAddress as any

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="mt-2 text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {formatOrderStatus(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order Items
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <li key={index} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded-md object-cover mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              {Object.entries(item.variant).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {order.currency} {item.price}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Tracking Information
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.trackingCarrier || 'Carrier'}: {order.trackingNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Track your package for delivery updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* Price Summary */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order Summary
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Subtotal</dt>
                    <dd className="text-gray-900">{order.currency} {order.subtotal.toString()}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Shipping</dt>
                    <dd className="text-gray-900">{order.currency} {order.shipping.toString()}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Tax</dt>
                    <dd className="text-gray-900">{order.currency} {order.tax.toString()}</dd>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <dt className="text-base font-medium text-gray-900">Total</dt>
                    <dd className="text-base font-medium text-gray-900">
                      {order.currency} {order.total.toString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Shipping Address
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <p className="text-sm text-gray-900">
                  {shippingAddress.name}<br />
                  {shippingAddress.line1}<br />
                  {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                  {shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Billing Address */}
            {billingAddress && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Billing Address
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-sm text-gray-900">
                    {billingAddress.name}<br />
                    {billingAddress.line1}<br />
                    {billingAddress.line2 && <>{billingAddress.line2}<br /></>}
                    {billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}<br />
                    {billingAddress.country}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import type { Order } from '@prisma/client'

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

export default async function OrdersPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const orders = await prisma.order.findMany({
    where: {
      email: session.user.email
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-gray-600">
            View and track all your orders
          </p>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {orders.map((order: Order) => {
                const items = order.items as any[]
                const itemCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0)
                const firstItem = items[0]
                
                return (
                  <li key={order.id}>
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {firstItem?.image && (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              className="h-16 w-16 rounded-md object-cover mr-4"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-xandcastle-purple">
                              Order #{order.orderNumber}
                            </p>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                {itemCount} item{itemCount !== 1 ? 's' : ''}
                              </div>
                              {order.trackingNumber && (
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  Tracking: {order.trackingNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium text-gray-900">
                              {order.currency} {order.total.toString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {formatOrderStatus(order.status)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven&apos;t placed any orders yet.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-xandcastle-purple hover:bg-xandcastle-pink"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
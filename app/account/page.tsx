import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { 
  UserIcon, 
  ShoppingBagIcon, 
  TruckIcon,
  ArrowRightIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

export default async function AccountPage() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get user's order stats
  const orderStats = await prisma.order.aggregate({
    where: {
      email: session.user.email
    },
    _count: true,
  })

  const recentOrders = await prisma.order.findMany({
    where: {
      email: session.user.email
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 3,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      currency: true,
      createdAt: true,
      items: true
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-12 w-12 text-xandcastle-purple" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session.user.name || 'there'}!
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <ShoppingBagIcon className="h-8 w-8 text-xandcastle-pink" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats._count}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-xandcastle-purple" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentOrders.filter(o => 
                    ['PENDING', 'PROCESSING', 'PAID', 'FULFILLED'].includes(o.status)
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <CreditCardIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Account Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/account/orders"
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">View All Orders</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Track your orders and view order history
                </p>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-gray-400" />
            </div>
          </Link>

          <Link
            href="/account/settings"
            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Update your profile and preferences
                </p>
              </div>
              <ArrowRightIcon className="h-6 w-6 text-gray-400" />
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => {
                const items = order.items as any[]
                const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
                
                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.orderNumber}`}
                    className="block px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {itemCount} item{itemCount !== 1 ? 's' : ''} • {' '}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {order.currency} {order.total.toString()}
                        </p>
                        <p className={`text-sm ${
                          order.status === 'DELIVERED' ? 'text-green-600' :
                          order.status === 'CANCELLED' ? 'text-red-600' :
                          order.status === 'SHIPPED' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
            {orderStats._count > 3 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <Link
                  href="/account/orders"
                  className="text-sm font-medium text-xandcastle-purple hover:text-xandcastle-pink"
                >
                  View all orders →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {recentOrders.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start shopping to see your orders here.
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
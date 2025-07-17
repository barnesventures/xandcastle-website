import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

async function getDashboardStats() {
  const [
    totalOrders,
    recentOrders,
    publishedPosts,
    totalUsers,
    pendingOrders,
    totalRevenue
  ] = await Promise.all([
    // Total orders count
    prisma.order.count(),
    // Recent orders (last 5)
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
        currency: true
      }
    }),
    // Published blog posts count
    prisma.blogPost.count({
      where: { published: true }
    }),
    // Total users
    prisma.user.count(),
    // Pending orders
    prisma.order.count({
      where: { status: 'PENDING' }
    }),
    // Total revenue (simplified - just summing order totals)
    prisma.order.aggregate({
      _sum: {
        total: true
      }
    })
  ]);

  return {
    totalOrders,
    recentOrders,
    publishedPosts,
    totalUsers,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      link: '/admin/blog'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      link: null
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      link: '/admin/orders?status=pending'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );

          return stat.link ? (
            <Link key={stat.title} href={stat.link}>
              {content}
            </Link>
          ) : (
            <div key={stat.title}>{content}</div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/admin/orders/${order.orderNumber}`}
                      className="text-sm font-medium text-xandcastle-purple hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.currency} {order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stats.recentOrders.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No orders yet. Orders will appear here once customers start purchasing.
          </div>
        )}
        {stats.recentOrders.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 text-center">
            <Link 
              href="/admin/orders" 
              className="text-sm text-xandcastle-purple hover:underline"
            >
              View all orders →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/blog/new"
            className="flex items-center justify-center space-x-2 bg-xandcastle-purple text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>Create Blog Post</span>
          </Link>
          <Link
            href="/admin/products/sync"
            className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition"
          >
            <ArrowsRightLeftIcon className="h-5 w-5" />
            <span>Sync Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
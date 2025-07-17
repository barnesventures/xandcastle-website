'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ShoppingBagIcon, 
  ArrowsRightLeftIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface AdminNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: AdminNavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
  { name: 'Blog Posts', href: '/admin/blog', icon: DocumentTextIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'Products Sync', href: '/admin/products', icon: ArrowsRightLeftIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Xandcastle Admin</h1>
            <span className="text-sm text-gray-500">
              Welcome, {session?.user?.name || session?.user?.email}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <HomeIcon className="h-5 w-5" />
              <span>View Store</span>
            </Link>
            <Link
              href="/auth/signout"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-md min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg transition
                        ${isActive 
                          ? 'bg-xandcastle-purple text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
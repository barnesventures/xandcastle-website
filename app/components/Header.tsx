'use client';

import Link from "next/link";
import Image from "next/image";
import { useCart } from '@/app/contexts/CartContext';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import CurrencySelector from './CurrencySelector';

export default function Header() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Xandcastle Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="font-bold text-xl">Xandcastle</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="hover:text-xandcastle-purple transition">
              Shop
            </Link>
            <Link href="/windsor" className="hover:text-xandcastle-purple transition">
              Windsor Collection
            </Link>
            <Link href="/about" className="hover:text-xandcastle-purple transition">
              About
            </Link>
            <Link href="/blog" className="hover:text-xandcastle-purple transition">
              Blog
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <CurrencySelector />
            <Link href="/account" className="hover:text-xandcastle-purple transition">
              Account
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:text-xandcastle-purple transition p-2"
              aria-label="Open cart"
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-xandcastle-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
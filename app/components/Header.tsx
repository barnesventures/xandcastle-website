'use client';

import Link from "next/link";
import Image from "next/image";
import { useCart } from '@/app/contexts/CartContext';
import { ShoppingBagIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CurrencySelector from './CurrencySelector';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>
            
            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="flex items-center space-x-2 hover:text-xandcastle-purple transition"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">{session.user?.name || 'Account'}</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Order History
                    </Link>
                    {session.user?.isAdmin && (
                      <>
                        <hr className="my-1" />
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <hr className="my-1" />
                    <Link
                      href="/auth/signout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="flex items-center space-x-1 hover:text-xandcastle-purple transition"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            
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
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="/shop" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/windsor" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Windsor Collection
              </Link>
              <Link 
                href="/about" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/blog" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <CurrencySelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
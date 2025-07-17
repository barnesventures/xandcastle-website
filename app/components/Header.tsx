'use client';

import LocalizedLink from "./LocalizedLink";
import Image from "next/image";
import { useCart } from '@/app/contexts/CartContext';
import { ShoppingBagIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CurrencySelector from './CurrencySelector';
import LanguageSwitcher from './LanguageSwitcher';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Header() {
  const { itemCount, setIsOpen } = useCart();
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <LocalizedLink href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Xandcastle - Cool t-shirts for kids and teens"
              width={40}
              height={40}
              className="mr-2"
              priority
            />
            <span className="font-bold text-xl">Xandcastle</span>
          </LocalizedLink>
          
          <div className="hidden md:flex items-center space-x-8">
            <LocalizedLink href="/shop" className="hover:text-xandcastle-purple transition">
              {t('shop')}
            </LocalizedLink>
            <LocalizedLink href="/windsor" className="hover:text-xandcastle-purple transition">
              {t('windsorCollection')}
            </LocalizedLink>
            <LocalizedLink href="/about" className="hover:text-xandcastle-purple transition">
              {t('about')}
            </LocalizedLink>
            <LocalizedLink href="/blog" className="hover:text-xandcastle-purple transition">
              {t('blog')}
            </LocalizedLink>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
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
                  <span className="hidden sm:inline">{session.user?.name || t('account')}</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <LocalizedLink
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('myAccount')}
                    </LocalizedLink>
                    <LocalizedLink
                      href="/account/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('orderHistory')}
                    </LocalizedLink>
                    {session.user?.isAdmin && (
                      <>
                        <hr className="my-1" />
                        <LocalizedLink
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                        >
                          {t('adminDashboard')}
                        </LocalizedLink>
                      </>
                    )}
                    <hr className="my-1" />
                    <LocalizedLink
                      href="/auth/signout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('signOut')}
                    </LocalizedLink>
                  </div>
                )}
              </div>
            ) : (
              <LocalizedLink 
                href="/auth/signin" 
                className="flex items-center space-x-1 hover:text-xandcastle-purple transition"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">{t('signIn')}</span>
              </LocalizedLink>
            )}
            
            <button
              onClick={() => setIsOpen(true)}
              className="relative hover:text-xandcastle-purple transition p-2"
              aria-label={t('cart')}
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
              <LocalizedLink 
                href="/shop" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('shop')}
              </LocalizedLink>
              <LocalizedLink 
                href="/windsor" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('windsorCollection')}
              </LocalizedLink>
              <LocalizedLink 
                href="/about" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('about')}
              </LocalizedLink>
              <LocalizedLink 
                href="/blog" 
                className="block py-2 hover:text-xandcastle-purple transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('blog')}
              </LocalizedLink>
              <div className="pt-4 border-t border-gray-200">
                <LanguageSwitcher />
              </div>
              <div className="pt-4">
                <CurrencySelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
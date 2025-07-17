'use client';

import LocalizedLink from './LocalizedLink';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import * as gtag from '@/app/utils/analytics';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const t = useTranslations('footer');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'footer',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Track newsletter signup
        gtag.signUp('newsletter');
        
        setSubscribeStatus('success');
        setEmail('');
        
        // Keep success message visible for longer since it's important
        setTimeout(() => setSubscribeStatus('idle'), 5000);
      } else {
        setSubscribeStatus('error');
        setTimeout(() => setSubscribeStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-xandcastle-purple to-xandcastle-pink py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('newsletter')}
            </h3>
            <p className="mb-6 opacity-90">
              {t('newsletterText')}
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder', { defaultValue: 'Enter your email' })}
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
                disabled={subscribeStatus === 'loading'}
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="bg-white text-xandcastle-purple px-6 py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {subscribeStatus === 'loading' ? t('subscribing', { defaultValue: 'Subscribing...' }) : t('subscribe')}
              </button>
            </form>
            
            {subscribeStatus === 'success' && (
              <p className="mt-4 text-green-300">{t('subscribeSuccess', { defaultValue: 'Almost there! Check your email to confirm your subscription!' })}</p>
            )}
            {subscribeStatus === 'error' && (
              <p className="mt-4 text-red-300">{t('subscribeError', { defaultValue: 'Oops! Something went wrong. Please try again.' })}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <LocalizedLink href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="Xandcastle Logo"
                  width={40}
                  height={40}
                />
                <span className="font-bold text-xl">Xandcastle</span>
              </LocalizedLink>
              <p className="text-gray-400 text-sm">
                {t('tagline', { defaultValue: 'Cool threads for creative kids! Where imagination meets awesome fashion.' })}
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-xandcastle-purple transition"
                  aria-label="Instagram"
                >
                  <span className="text-lg">📷</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-xandcastle-pink transition"
                  aria-label="Twitter"
                >
                  <span className="text-lg">🐦</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-xandcastle-blue transition"
                  aria-label="Facebook"
                >
                  <span className="text-lg">📘</span>
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('shop', { defaultValue: 'Shop' })}</h4>
              <ul className="space-y-2">
                <li>
                  <LocalizedLink href="/shop" className="text-gray-400 hover:text-white transition">
                    All Products
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/windsor" className="text-gray-400 hover:text-white transition">
                    Windsor Collection
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/shop?category=tshirts" className="text-gray-400 hover:text-white transition">
                    T-Shirts
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/shop?category=hoodies" className="text-gray-400 hover:text-white transition">
                    Hoodies
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/shop?sort=new" className="text-gray-400 hover:text-white transition">
                    New Arrivals
                  </LocalizedLink>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('customerService')}</h4>
              <ul className="space-y-2">
                <li>
                  <LocalizedLink href="/about" className="text-gray-400 hover:text-white transition">
                    About Us
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/contact" className="text-gray-400 hover:text-white transition">
                    Contact Us
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/orders/track" className="text-gray-400 hover:text-white transition">
                    Track Order
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/shipping" className="text-gray-400 hover:text-white transition">
                    Shipping Info
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/returns" className="text-gray-400 hover:text-white transition">
                    Returns & Exchanges
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/affiliates" className="text-gray-400 hover:text-white transition">
                    Become an Affiliate
                  </LocalizedLink>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold text-lg mb-4">My Account</h4>
              <ul className="space-y-2">
                <li>
                  <LocalizedLink href="/auth/signin" className="text-gray-400 hover:text-white transition">
                    Sign In
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/auth/signup" className="text-gray-400 hover:text-white transition">
                    Create Account
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/account" className="text-gray-400 hover:text-white transition">
                    My Profile
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/account/orders" className="text-gray-400 hover:text-white transition">
                    Order History
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog" className="text-gray-400 hover:text-white transition">
                    Castle Blog
                  </LocalizedLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile-friendly quick links */}
          <div className="mt-8 pt-8 border-t border-gray-800 lg:hidden">
            <div className="grid grid-cols-2 gap-4">
              <LocalizedLink href="/shop" className="bg-gray-800 text-center py-3 rounded-lg hover:bg-gray-700 transition">
                Shop Now
              </LocalizedLink>
              <LocalizedLink href="/orders/track" className="bg-gray-800 text-center py-3 rounded-lg hover:bg-gray-700 transition">
                Track Order
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Xandcastle. All rights reserved. Made with 💜 for creative kids everywhere!
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <LocalizedLink href="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </LocalizedLink>
              <span className="text-gray-600">•</span>
              <LocalizedLink href="/terms" className="text-gray-400 hover:text-white transition">
                Terms of Service
              </LocalizedLink>
              <span className="text-gray-600">•</span>
              <LocalizedLink href="/cookies" className="text-gray-400 hover:text-white transition">
                Cookie Policy
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
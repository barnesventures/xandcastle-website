'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const handleLocaleChange = (newLocale: Locale) => {
    // Get the current pathname without the locale
    const segments = pathname.split('/');
    const currentLocale = segments[1];
    
    // Check if the first segment is a locale
    const hasLocale = locales.includes(currentLocale as Locale);
    
    // Build the new path
    let newPath: string;
    if (hasLocale) {
      // Replace the locale
      segments[1] = newLocale;
      newPath = segments.join('/');
    } else {
      // Add the locale
      newPath = `/${newLocale}${pathname}`;
    }
    
    // Handle default locale (English)
    if (newLocale === 'en' && hasLocale) {
      // Remove the locale prefix for English
      newPath = '/' + segments.slice(2).join('/');
      if (newPath === '/') {
        newPath = '/';
      }
    }
    
    router.push(newPath);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors">
          <GlobeAltIcon className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline">{localeFlags[locale]} {localeNames[locale]}</span>
          <span className="sm:hidden">{localeFlags[locale]}</span>
          <ChevronDownIcon className="ml-1 h-4 w-4" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {locales.map((loc) => (
              <Menu.Item key={loc}>
                {({ active }) => (
                  <button
                    onClick={() => handleLocaleChange(loc)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } ${
                      locale === loc ? 'bg-gray-50 font-medium' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <span className="mr-2">{localeFlags[loc]}</span>
                    {localeNames[loc]}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
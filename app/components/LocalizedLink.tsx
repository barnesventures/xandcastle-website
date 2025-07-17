'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export default function LocalizedLink({ href, ...props }: Props) {
  const locale = useLocale();
  
  // Don't add locale prefix for external links or API routes
  if (href.startsWith('http') || href.startsWith('/api')) {
    return <Link href={href} {...props} />;
  }
  
  // For English (default locale), don't add prefix
  const localizedHref = locale === 'en' ? href : `/${locale}${href}`;
  
  return <Link href={localizedHref} {...props} />;
}
import { locales, defaultLocale, type Locale } from '@/i18n';

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }
  
  return defaultLocale;
}

export function localizePathname(pathname: string, locale: Locale): string {
  // Remove any existing locale from the pathname
  const segments = pathname.split('/');
  const currentLocale = segments[1];
  
  let cleanPathname = pathname;
  if (locales.includes(currentLocale as Locale)) {
    cleanPathname = '/' + segments.slice(2).join('/');
  }
  
  // Add the new locale (if not default)
  if (locale === defaultLocale) {
    return cleanPathname || '/';
  }
  
  return `/${locale}${cleanPathname}`;
}

export function getAlternateLinks(pathname: string) {
  const cleanPathname = pathname.replace(/^\/[a-z]{2}\//, '/').replace(/^\/[a-z]{2}$/, '/');
  
  return locales.map(locale => ({
    locale,
    url: localizePathname(cleanPathname, locale)
  }));
}
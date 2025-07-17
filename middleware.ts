import { auth } from "./auth"
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // Only add locale prefix when not default locale
});

// Create a wrapper that combines auth and intl middleware
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.isAdmin === true
  
  // Extract pathname without locale prefix
  const pathname = req.nextUrl.pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  const pathnameWithoutLocale = pathnameHasLocale
    ? pathname.replace(/^\/[^\/]+/, '')
    : pathname
  
  const isOnAccountPage = pathnameWithoutLocale.startsWith("/account")
  const isOnAuthPage = pathnameWithoutLocale.startsWith("/auth")
  const isOnAdminPage = pathnameWithoutLocale.startsWith("/admin")

  // Protect admin routes
  if (isOnAdminPage) {
    if (!isLoggedIn) {
      const locale = pathname.split('/')[1]
      const isValidLocale = locales.includes(locale as any)
      const redirectUrl = new URL(
        isValidLocale ? `/${locale}/auth/signin` : "/auth/signin", 
        req.nextUrl
      )
      redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return Response.redirect(redirectUrl)
    }
    if (!isAdmin) {
      const locale = pathname.split('/')[1]
      const isValidLocale = locales.includes(locale as any)
      return Response.redirect(new URL(isValidLocale ? `/${locale}` : "/", req.nextUrl))
    }
  }

  if (isOnAccountPage) {
    if (!isLoggedIn) {
      const locale = pathname.split('/')[1]
      const isValidLocale = locales.includes(locale as any)
      const redirectUrl = new URL(
        isValidLocale ? `/${locale}/auth/signin` : "/auth/signin", 
        req.nextUrl
      )
      redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return Response.redirect(redirectUrl)
    }
  }

  if (isOnAuthPage) {
    if (isLoggedIn) {
      const locale = pathname.split('/')[1]
      const isValidLocale = locales.includes(locale as any)
      return Response.redirect(new URL(
        isValidLocale ? `/${locale}/account` : "/account", 
        req.nextUrl
      ))
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(req as NextRequest)
})

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, including the ones with a dot
    '/users/(.*)'
  ]
}
import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.isAdmin === true
  const isOnAccountPage = req.nextUrl.pathname.startsWith("/account")
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")
  const isOnAdminPage = req.nextUrl.pathname.startsWith("/admin")

  // Protect admin routes
  if (isOnAdminPage) {
    if (!isLoggedIn) {
      const redirectUrl = new URL("/auth/signin", req.nextUrl)
      redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    if (!isAdmin) {
      // Non-admin users trying to access admin pages get redirected to home
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }

  if (isOnAccountPage) {
    if (!isLoggedIn) {
      const redirectUrl = new URL("/auth/signin", req.nextUrl)
      redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  if (isOnAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/account", req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
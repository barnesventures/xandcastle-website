import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAccountPage = req.nextUrl.pathname.startsWith("/account")
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")

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
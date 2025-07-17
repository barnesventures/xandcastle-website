'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function SignOutPage() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <Image
              src="/logo.png"
              alt="Xandcastle Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign out of your account?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You'll need to sign in again to access your account and order history.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-xandcastle-purple hover:bg-xandcastle-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xandcastle-purple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
          
          <Link
            href="/account"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xandcastle-purple"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}
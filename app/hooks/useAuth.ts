'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(redirectTo?: string) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, redirectTo, router])
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session
  }
}

export function useRequireAuth(redirectTo = '/auth/signin') {
  const { user, isLoading, isAuthenticated } = useAuth(redirectTo)
  
  return {
    user,
    isLoading,
    isAuthenticated
  }
}
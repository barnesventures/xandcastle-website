import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Admin email addresses - in production, this should be stored in the database
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@xandcastle.com']

export async function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}

export async function requireAdmin() {
  const session = await auth()
  
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect('/auth/signin')
  }
  
  return session.user
}

export async function checkAdminAccess() {
  const session = await auth()
  
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return false
  }
  
  return true
}

// API route middleware for admin access
export async function withAdminAuth(
  handler: (req: NextRequest, params?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, params?: any) => {
    const session = await auth()
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return handler(req, params)
  }
}
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  return user
}

export async function getAuthenticatedUser() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return null
  }
  
  return {
    id: session.user.id as string,
    email: session.user.email,
    name: session.user.name || null,
    image: session.user.image || null
  }
}
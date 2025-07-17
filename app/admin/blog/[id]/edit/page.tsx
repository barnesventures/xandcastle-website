import { requireAdmin } from '@/app/lib/admin-auth'
import EditBlogPostForm from './EditBlogPostForm'

async function getBlogPost(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/admin/blog/${id}`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch blog post')
  }

  return response.json()
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  
  const { id } = await params
  const post = await getBlogPost(id)

  return <EditBlogPostForm post={post} />
}
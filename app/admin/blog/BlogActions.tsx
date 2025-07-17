'use client'

import Link from 'next/link'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface BlogActionsProps {
  postId: string
}

export default function BlogActions({ postId }: BlogActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <Link
        href={`/admin/blog/${postId}/edit`}
        className="text-indigo-600 hover:text-indigo-900"
      >
        <PencilIcon className="h-5 w-5" />
        <span className="sr-only">Edit</span>
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-900"
      >
        <TrashIcon className="h-5 w-5" />
        <span className="sr-only">Delete</span>
      </button>
    </div>
  )
}
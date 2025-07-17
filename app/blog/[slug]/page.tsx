import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { marked } from 'marked'
import { CalendarIcon, TagIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

async function getBlogPost(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
    next: { revalidate: 60 }, // Revalidate every minute
  })

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch blog post')
  }

  return response.json()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || `Read ${post.title} on Xandcastle Blog`,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  // Configure marked for secure HTML
  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  const htmlContent = marked(post.content)

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to blog
          </Link>
        </div>

        {post.coverImage && (
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {post.authorName}
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  <TagIcon className="h-4 w-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </article>
  )
}
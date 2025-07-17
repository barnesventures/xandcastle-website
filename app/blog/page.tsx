import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

async function getBlogPosts(page: number = 1, limit: number = 9) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(
    `${baseUrl}/api/blog?page=${page}&limit=${limit}`,
    {
      next: { revalidate: 60 }, // Revalidate every minute
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch blog posts')
  }

  return response.json()
}

export const metadata: Metadata = {
  title: 'Blog - Latest News & Updates | Xandcastle',
  description: 'Read the latest news, updates, and stories from Xandcastle. Discover fashion tips, design inspiration, and behind-the-scenes content from our kids and teens clothing brand.',
  keywords: ['Xandcastle blog', 'kids fashion blog', 'teens clothing news', 'design stories', 'Windsor fashion', 'clothing brand updates'],
  openGraph: {
    title: 'Blog - Latest News & Updates | Xandcastle',
    description: 'Read the latest news, updates, and stories from Xandcastle. Fashion tips and design inspiration for kids and teens.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Xandcastle Blog',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Latest News & Updates | Xandcastle',
    description: 'Read the latest news and stories from Xandcastle.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://xandcastle.com/blog',
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const { posts, pagination } = await getBlogPosts(page)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Xandcastle Blog</h1>
          <p className="text-lg text-gray-600">
            Latest news, updates, and stories from our creative journey
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.coverImage && (
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.coverImage}
                          alt={`${post.title} - Blog post cover image`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  )}
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/blog?page=${pageNum}`}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNum === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ))}
                  </div>

                  {page < pagination.totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
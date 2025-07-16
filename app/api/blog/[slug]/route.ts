import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/blog/[slug] - Get a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: slug,
        published: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Failed to fetch blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}
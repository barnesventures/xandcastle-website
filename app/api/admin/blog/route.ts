import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { auth } from '@/auth'

// Admin email addresses - in production, this should be stored in the database
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@xandcastle.com']

async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}

// GET /api/admin/blog - Get all blog posts (including drafts)
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email || !await isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit
    const published = searchParams.get('published')

    const where = published !== null 
      ? { published: published === 'true' }
      : {}

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip,
    })

    const totalPosts = await prisma.blogPost.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/admin/blog - Create a new blog post
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email || !await isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      authorName,
      tags,
      metaTitle,
      metaDesc,
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published,
        publishedAt: published ? new Date() : null,
        authorName: authorName || 'Xandcastle Team',
        tags: tags || [],
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Failed to create blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
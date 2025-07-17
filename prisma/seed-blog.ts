import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding blog posts...')

  const blogPost = await prisma.blogPost.create({
    data: {
      title: 'Welcome to Xandcastle Blog',
      slug: 'welcome-to-xandcastle-blog',
      content: `# Welcome to Xandcastle Blog!

We're excited to launch our blog where we'll share stories about our creative journey, new product launches, and the inspiration behind our designs.

## What to Expect

Here's what you can look forward to on our blog:

- **Behind the Scenes**: Get an exclusive look at how we create our designs
- **New Product Announcements**: Be the first to know about our latest collections
- **Style Tips**: Learn how to style our pieces for different occasions
- **Windsor Collection Spotlights**: Discover the stories behind our Windsor-themed designs
- **Community Features**: Meet our amazing customers and see how they style Xandcastle

## Our Mission

At Xandcastle, we believe in creating clothing that sparks joy and imagination for kids and teens. Every design tells a story, and we can't wait to share those stories with you.

Stay tuned for more exciting content!

*The Xandcastle Team*`,
      excerpt: 'Welcome to our new blog! Discover the stories behind our designs, get style tips, and be the first to know about new collections.',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop',
      published: true,
      publishedAt: new Date(),
      authorName: 'Xandcastle Team',
      tags: ['welcome', 'announcement', 'news'],
      metaTitle: 'Welcome to Xandcastle Blog - Stories Behind Our Designs',
      metaDesc: 'Discover the creative journey of Xandcastle. Read about new products, style tips, and the inspiration behind our kids and teens clothing designs.',
    },
  })

  console.log('Created blog post:', blogPost.title)

  const draftPost = await prisma.blogPost.create({
    data: {
      title: 'Introducing the Windsor Castle Collection',
      slug: 'introducing-windsor-castle-collection',
      content: `# Introducing the Windsor Castle Collection

We're thrilled to announce our special Windsor Castle themed collection...

## The Inspiration

Windsor Castle has always been a source of wonder and imagination...

## Featured Designs

- Royal Guard Bears
- Castle Tower Tees
- Knight Adventure Hoodies

More details coming soon!`,
      excerpt: 'Get ready for our magical Windsor Castle themed collection, perfect for young adventurers and castle enthusiasts!',
      published: false,
      authorName: 'Xandcastle Team',
      tags: ['windsor', 'collection', 'preview'],
      metaTitle: 'Windsor Castle Collection - Coming Soon to Xandcastle',
      metaDesc: 'Preview our upcoming Windsor Castle themed collection featuring royal guards, castles, and knights. Perfect for kids who love adventure!',
    },
  })

  console.log('Created draft post:', draftPost.title)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
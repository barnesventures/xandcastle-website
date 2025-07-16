import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed initial blog post
  const welcomePost = await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-xandcastle' },
    update: {},
    create: {
      title: 'Welcome to Xandcastle!',
      slug: 'welcome-to-xandcastle',
      content: `# Welcome to Xandcastle!

We're thrilled to launch our online store featuring fun and creative clothing designs for kids and teens. 

## What We Offer

- Unique and playful designs
- High-quality print-on-demand products
- Sizes for all ages
- Special Windsor tourist collection

Stay tuned for more exciting updates!`,
      excerpt: 'Welcome to our new online store featuring fun clothing for kids and teens.',
      published: true,
      publishedAt: new Date(),
      tags: ['announcement', 'welcome'],
      metaTitle: 'Welcome to Xandcastle - Fun Clothing for Kids & Teens',
      metaDesc: 'Discover unique and playful clothing designs for kids and teens at Xandcastle. High-quality print-on-demand products.'
    },
  })

  console.log('Database has been seeded. 🌱')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
import { MetadataRoute } from 'next'
import { prisma } from '@/app/lib/prisma'
import { locales, defaultLocale } from '@/i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://xandcastle.com'
  
  // Static pages with their relative importance and update frequency
  const staticPaths = [
    {
      path: '',
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      path: '/shop',
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      path: '/windsor',
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      path: '/blog',
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      path: '/about',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      path: '/contact',
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      path: '/cart',
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      path: '/account',
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      path: '/shipping',
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      path: '/returns',
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      path: '/privacy',
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      path: '/terms',
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
    {
      path: '/cookies',
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    },
  ]

  const staticPages: MetadataRoute.Sitemap = []
  
  // Generate URLs for all locales
  for (const locale of locales) {
    for (const page of staticPaths) {
      const url = locale === defaultLocale 
        ? `${baseUrl}${page.path}`
        : `${baseUrl}/${locale}${page.path}`
      
      staticPages.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: locales.reduce((acc, loc) => {
            const langUrl = loc === defaultLocale 
              ? `${baseUrl}${page.path}`
              : `${baseUrl}/${loc}${page.path}`
            acc[loc] = langUrl
            return acc
          }, {} as Record<string, string>)
        }
      })
    }
  }

  // Fetch dynamic content
  try {
    // Get all published blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const blogUrls: MetadataRoute.Sitemap = []
    
    for (const locale of locales) {
      for (const post of blogPosts) {
        const url = locale === defaultLocale 
          ? `${baseUrl}/blog/${post.slug}`
          : `${baseUrl}/${locale}/blog/${post.slug}`
        
        blogUrls.push({
          url,
          lastModified: post.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: locales.reduce((acc, loc) => {
              const langUrl = loc === defaultLocale 
                ? `${baseUrl}/blog/${post.slug}`
                : `${baseUrl}/${loc}/blog/${post.slug}`
              acc[loc] = langUrl
              return acc
            }, {} as Record<string, string>)
          }
        })
      }
    }

    return [...staticPages, ...blogUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages even if dynamic content fails
    return staticPages
  }
}
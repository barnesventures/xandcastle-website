import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/success',
          '/orders/confirmation',
          '/auth/',
          '/account/orders/',
          '/test-currency',
        ],
      },
    ],
    sitemap: 'https://xandcastle.com/sitemap.xml',
  }
}
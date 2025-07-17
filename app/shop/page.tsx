import { Metadata } from 'next';
import { ShopClient } from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop All Products - Cool T-Shirts for Kids & Teens',
  description: 'Browse our complete collection of cool t-shirts, hoodies, and castle-themed clothing for kids and teens. Unique designs, high-quality print-on-demand apparel.',
  keywords: ['kids clothing shop', 'teens fashion store', 'cool t-shirts', 'castle-themed apparel', 'print on demand clothing', 'youth fashion UK'],
  openGraph: {
    title: 'Shop All Products - Xandcastle',
    description: 'Browse our complete collection of cool t-shirts and clothing for kids and teens.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Xandcastle Shop - Cool clothing for kids and teens',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products - Xandcastle',
    description: 'Browse our complete collection of cool t-shirts and clothing for kids and teens.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://xandcastle.com/shop',
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products | Xandcastle',
  description: 'Discover our collection of fun and creative clothing designs for kids and teens. Shop unique t-shirts, hoodies, and more at Xandcastle.',
  keywords: 'kids clothing, teen fashion, cool t-shirts, hoodies, creative designs, Xandcastle',
  openGraph: {
    title: 'Shop All Products | Xandcastle',
    description: 'Discover our collection of fun and creative clothing designs for kids and teens.',
    type: 'website',
    url: 'https://xandcastle.com/shop',
    images: [
      {
        url: 'https://xandcastle.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'Xandcastle Shop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products | Xandcastle',
    description: 'Discover our collection of fun and creative clothing designs for kids and teens.',
    images: ['https://xandcastle.com/logo.png'],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
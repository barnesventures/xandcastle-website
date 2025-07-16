import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Windsor Tourist Collection | Xandcastle',
  description: 'Celebrate your visit to Windsor with our exclusive collection of castle-themed apparel and souvenirs. Perfect gifts and memories from Windsor Castle.',
  keywords: 'Windsor souvenirs, Windsor Castle gifts, tourist merchandise, castle clothing, Windsor tourist collection',
  openGraph: {
    title: 'Windsor Tourist Collection | Xandcastle',
    description: 'Celebrate your visit to Windsor with our exclusive collection of castle-themed apparel and souvenirs.',
    type: 'website',
    url: 'https://xandcastle.com/windsor',
    images: [
      {
        url: 'https://xandcastle.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'Windsor Tourist Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Windsor Tourist Collection | Xandcastle',
    description: 'Celebrate your visit to Windsor with our exclusive collection of castle-themed apparel and souvenirs.',
    images: ['https://xandcastle.com/logo.png'],
  },
};

export default function WindsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
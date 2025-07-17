import { Metadata } from 'next';
import { WindsorClient } from './WindsorClient';

export const metadata: Metadata = {
  title: 'Windsor Tourist Collection - Castle-Themed Souvenirs & Apparel',
  description: 'Shop our exclusive Windsor tourist collection featuring castle-themed clothing and souvenirs. Perfect gifts and memorabilia from your Windsor Castle visit. Kids and teens sizes available.',
  keywords: ['Windsor souvenirs', 'Windsor Castle merchandise', 'castle-themed clothing', 'Windsor tourist gifts', 'British heritage apparel', 'Windsor collection', 'tourist souvenirs UK'],
  openGraph: {
    title: 'Windsor Tourist Collection - Xandcastle',
    description: 'Exclusive castle-themed clothing and souvenirs inspired by Windsor Castle. Perfect memorabilia from your visit.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Windsor Tourist Collection - Castle-themed souvenirs',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Windsor Tourist Collection - Xandcastle',
    description: 'Exclusive castle-themed clothing and souvenirs inspired by Windsor Castle.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://xandcastle.com/windsor',
  },
};

export default function WindsorCollectionPage() {
  return <WindsorClient />;
}
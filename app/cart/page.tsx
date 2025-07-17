import { Metadata } from 'next';
import { CartClient } from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart - Xandcastle',
  description: 'Review your selected items and proceed to checkout. Shop cool t-shirts for kids and teens, plus Windsor tourist souvenirs.',
  keywords: ['shopping cart', 'checkout', 'kids clothing cart', 'Windsor souvenirs cart'],
  openGraph: {
    title: 'Shopping Cart - Xandcastle',
    description: 'Review your selected items and proceed to checkout.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xandcastle.com/cart',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartPage() {
  return <CartClient />;
}
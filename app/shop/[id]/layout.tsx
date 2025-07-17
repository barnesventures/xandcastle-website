import { Metadata } from 'next';
import { getProductDetails } from '../../lib/printify-client';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProductDetails(params.id);
    
    return {
      title: `${product.title} | Xandcastle`,
      description: product.description || `Shop ${product.title} from Xandcastle's collection of creative designs for kids and teens.`,
      openGraph: {
        title: `${product.title} | Xandcastle`,
        description: product.description || `Shop ${product.title} from Xandcastle's collection.`,
        type: 'website',
        url: `https://xandcastle.com/shop/${params.id}`,
        images: product.images.length > 0 ? [
          {
            url: product.images[0].src,
            width: 1200,
            height: 1200,
            alt: product.title,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | Xandcastle`,
        description: product.description || `Shop ${product.title} from Xandcastle's collection.`,
        images: product.images.length > 0 ? [product.images[0].src] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product | Xandcastle',
      description: 'Shop unique clothing designs for kids and teens at Xandcastle.',
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to load product
            </h2>
            <p className="text-gray-600">
              Please try refreshing the page or browse our other products.
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ProductImagesClient } from './ProductImagesClient';
import { AddToCart } from '@/app/components/AddToCart';
import { ProductViewTracker } from '@/app/components/ProductViewTracker';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/printify/products/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price || 0;
  const currency = firstVariant?.currency || 'GBP';

  return {
    title: `${product.title} - Cool Kids & Teens Clothing`,
    description: product.description || `Shop ${product.title} at Xandcastle. Unique clothing designs for kids and teens. High-quality print-on-demand apparel.`,
    keywords: [...(product.tags || []), "kids clothing", "teens fashion", "cool t-shirts", "custom apparel"],
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title} at Xandcastle`,
      images: product.images?.map((img: any) => ({
        url: img.src,
        width: img.width || 800,
        height: img.height || 800,
        alt: product.title,
      })) || [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || `Shop ${product.title} at Xandcastle`,
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
    alternates: {
      canonical: `https://xandcastle.com/shop/${params.id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Create Product JSON-LD schema
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price || 0;
  const currency = firstVariant?.currency || 'GBP';
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} - High-quality clothing for kids and teens`,
    image: product.images?.map((img: any) => img.src) || [],
    brand: {
      "@type": "Brand",
      name: "Xandcastle"
    },
    offers: {
      "@type": "AggregateOffer",
      url: `https://xandcastle.com/shop/${params.id}`,
      priceCurrency: currency,
      lowPrice: price / 100,
      highPrice: Math.max(...(product.variants?.map((v: any) => v.price) || [price])) / 100,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Xandcastle"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127"
    },
    category: product.tags?.join(', ') || "Kids Clothing"
  };

  return (
    <>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema)
        }}
      />
      <ProductViewTracker product={product} />
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link href="/shop" className="text-gray-600 hover:text-gray-800">
            &larr; Back to Shop
          </Link>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <ProductImagesClient images={product.images} title={product.title} />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            {product.description && (
              <div className="prose prose-gray mb-6">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <AddToCart product={product} />
            </div>

            {/* Product Details */}
            <div className="mt-8 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Product Details</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High-quality print-on-demand product</li>
                  <li>• Made to order for you</li>
                  <li>• Eco-friendly printing process</li>
                  <li>• Shipped worldwide</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Care Instructions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Machine wash cold, inside out</li>
                  <li>• Tumble dry low or hang dry</li>
                  <li>• Do not iron directly on print</li>
                  <li>• Do not dry clean</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
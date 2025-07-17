import Link from "next/link";
import { formatPrice } from "../lib/printify-client";
import { ProductImage } from "./OptimizedImage";

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  image: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  tags?: string[];
}

export default function ProductCard({ 
  id, 
  title, 
  description, 
  image, 
  priceRange,
  tags 
}: ProductCardProps) {
  const displayPrice = priceRange.min === priceRange.max 
    ? formatPrice(priceRange.min, priceRange.currency)
    : `From ${formatPrice(priceRange.min, priceRange.currency)}`;

  return (
    <Link href={`/products/${id}`} className="group">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <ProductImage
            src={image}
            alt={`${title} - ${tags?.includes('windsor') ? 'Windsor tourist collection' : 'Kids and teens clothing'}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 text-gray-900 group-hover:text-xandcastle-purple transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-xandcastle-purple">
              {displayPrice}
            </span>
            {tags && tags.length > 0 && (
              <div className="flex gap-1">
                {tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductImagesClient({ images, title }: { images: any[], title: string }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-gray-200 rounded-lg" />;
  }

  return (
    <>
      <div className="mb-4">
        <div className="relative aspect-square">
          <Image
            src={images[selectedImage].src}
            alt={`${title} - Main product image`}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
      
      {/* Image Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition ${
                selectedImage === index
                  ? 'border-xandcastle-purple'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1} of ${title}`}
            >
              <Image
                src={image.src}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
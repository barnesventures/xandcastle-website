"use client";

import { useEffect, useState } from "react";
import { getWindsorTouristProducts, getProductDetails, type ProductListItem, type ProductDetails } from "../lib/printify-client";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

interface WindsorProductWithDetails extends ProductListItem {
  details?: ProductDetails;
}

export default function WindsorCollection() {
  const [products, setProducts] = useState<WindsorProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWindsorProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch Windsor products
        const windsorProducts = await getWindsorTouristProducts();
        
        // Take first 3 products for preview
        const previewProducts = windsorProducts.slice(0, 3);
        
        // Fetch details for each product
        const productsWithDetails = await Promise.all(
          previewProducts.map(async (product) => {
            try {
              const details = await getProductDetails(product.id);
              return { ...product, details };
            } catch (err) {
              console.error(`Failed to fetch details for Windsor product ${product.id}`, err);
              return product;
            }
          })
        );
        
        setProducts(productsWithDetails);
      } catch (err) {
        console.error("Failed to load Windsor products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWindsorProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {products.map((product) => {
          const mainImage = product.images.find(img => img.position === "front") || product.images[0];
          const priceRange = product.details?.price_range || {
            min: 2499,
            max: 4499,
            currency: "USD"
          };
          
          return (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              image={mainImage?.src || "/placeholder.svg"}
              priceRange={priceRange}
              tags={product.tags}
            />
          );
        })}
      </div>
      
      <div className="text-center">
        <Link
          href="/windsor"
          className="inline-flex items-center bg-xandcastle-blue text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-blue-600 transition transform hover:scale-105 shadow-lg"
        >
          Explore Windsor Collection
          <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </>
  );
}
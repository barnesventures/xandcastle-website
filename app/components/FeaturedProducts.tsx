"use client";

import { useEffect, useState } from "react";
import { getProducts, getProductDetails, type ProductListItem, type ProductDetails } from "../lib/printify-client";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";

interface FeaturedProductWithDetails extends ProductListItem {
  details?: ProductDetails;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products
      const productList = await getProducts();
      
      // Take first 6 products
      const featuredProducts = productList.slice(0, 6);
      
      // Fetch details for each product to get price ranges
      const productsWithDetails = await Promise.all(
        featuredProducts.map(async (product) => {
          try {
            const details = await getProductDetails(product.id);
            return { ...product, details };
          } catch (err) {
            console.error(`Failed to fetch details for product ${product.id}`, err);
            return product;
          }
        })
      );
      
      setProducts(productsWithDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProducts} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product) => {
          const mainImage = product.images.find(img => img.position === "front") || product.images[0];
          const priceRange = product.details?.price_range || {
            min: 1999,
            max: 3999,
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
      
      <div className="text-center mt-8 sm:mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-xandcastle-purple hover:bg-purple-700 transition transform hover:scale-105 shadow-md"
        >
          View All Products
          <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </>
  );
}
import { NextRequest, NextResponse } from 'next/server';
import { fetchProductCatalog } from '@/app/lib/printify';
import { PrintifyProduct } from '@/app/lib/types/printify';

export async function GET(request: NextRequest) {
  try {
    // Add caching headers - cache for 5 minutes
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    };

    // Fetch products from Printify
    const products = await fetchProductCatalog();
    
    // Transform products to include only necessary data for listing
    const transformedProducts = products.map((product: PrintifyProduct) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      tags: product.tags,
      images: product.images.filter(img => img.is_default).map(img => ({
        src: img.src,
        position: img.position,
      })),
      variant_count: product.variants,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));

    // Check if we should filter by tag (e.g., for Windsor tourist collection)
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get('tag');
    
    let filteredProducts = transformedProducts;
    if (tag) {
      filteredProducts = transformedProducts.filter(product => 
        product.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: filteredProducts,
        count: filteredProducts.length,
      },
      { headers }
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
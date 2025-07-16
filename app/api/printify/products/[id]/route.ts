import { NextRequest, NextResponse } from 'next/server';
import { getProductDetails } from '@/app/lib/printify';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params;
  
  try {
    
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // Add caching headers - cache for 5 minutes
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    };

    // Fetch detailed product information
    const product = await getProductDetails(productId);
    
    // Transform product data to include pricing and variant information
    const transformedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      tags: product.tags,
      images: product.images.map(img => ({
        src: img.src,
        variant_ids: img.variant_ids,
        position: img.position,
        is_default: img.is_default,
      })),
      variants: product.variants.map(variant => ({
        id: variant.id,
        title: variant.title,
        price: variant.price, // Price in cents (USD)
        is_available: variant.is_available,
        is_enabled: variant.is_enabled,
        options: variant.options,
      })),
      print_provider_id: product.print_provider_id,
      blueprint_id: product.blueprint_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };

    // Calculate price range for the product
    const enabledVariants = product.variants.filter(v => v.is_enabled && v.is_available);
    const prices = enabledVariants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...transformedProduct,
          price_range: {
            min: minPrice,
            max: maxPrice,
            currency: 'USD',
          },
        },
      },
      { headers }
    );
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product details',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { productService } from '@/app/lib/product-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: printifyId } = await params;
  
  try {
    
    if (!printifyId) {
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

    // First, find the product in our database by printifyId
    const dbProduct = await prisma.product.findUnique({
      where: { printifyId },
      select: { id: true }
    });

    if (!dbProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Get product with inventory data
    const productWithInventory = await productService.getProductDetailsWithInventory(dbProduct.id);

    return NextResponse.json(
      {
        success: true,
        data: productWithInventory,
      },
      { headers }
    );
  } catch (error) {
    console.error(`Failed to fetch product ${printifyId}:`, error);
    
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
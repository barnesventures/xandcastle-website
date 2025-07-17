import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, CheckoutSessionData } from '@/app/lib/stripe';
import { CartItem } from '@/app/contexts/CartContext';
import { prisma } from '@/app/lib/prisma';
import { inventorySyncService } from '@/app/lib/inventory-sync';
import { ProductInventory } from '@/app/lib/types/inventory';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.cartItems || !Array.isArray(body.cartItems) || body.cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    if (!body.currency) {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 }
      );
    }

    // Validate inventory availability
    const unavailableItems: Array<{ title: string; variant: string }> = [];
    
    for (const item of body.cartItems as CartItem[]) {
      // Find product in database
      const product = await prisma.product.findUnique({
        where: { printifyId: item.productId },
        select: { 
          id: true, 
          inventoryData: true,
          lastInventorySync: true
        }
      });

      if (!product) {
        unavailableItems.push({ 
          title: item.title, 
          variant: item.variantTitle 
        });
        continue;
      }

      // Check if inventory needs to be synced (older than 1 hour)
      const shouldSync = !product.lastInventorySync || 
        product.lastInventorySync < new Date(Date.now() - 60 * 60 * 1000);

      if (shouldSync) {
        try {
          await inventorySyncService.syncProductInventory(product.id, item.productId);
          
          // Re-fetch updated product
          const updatedProduct = await prisma.product.findUnique({
            where: { id: product.id },
            select: { inventoryData: true }
          });
          
          if (updatedProduct) {
            product.inventoryData = updatedProduct.inventoryData;
          }
        } catch (error) {
          console.error('Failed to sync inventory during checkout:', error);
        }
      }

      // Check variant availability
      const inventory = product.inventoryData as ProductInventory | null;
      const variantInventory = inventory?.variants[item.variantId];
      
      if (!variantInventory?.isAvailable) {
        unavailableItems.push({ 
          title: item.title, 
          variant: item.variantTitle 
        });
      }
    }

    // If any items are unavailable, return error
    if (unavailableItems.length > 0) {
      return NextResponse.json(
        { 
          error: 'Some items are no longer available',
          unavailableItems,
          message: 'Please update your cart and try again.'
        },
        { status: 400 }
      );
    }

    // Get the base URL for success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (request.headers.get('origin') || 
      `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}`);

    // Prepare checkout session data
    const checkoutData: CheckoutSessionData = {
      cartItems: body.cartItems as CartItem[],
      currency: body.currency,
      customerEmail: body.customerEmail,
      shippingAddress: body.shippingAddress,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/cart`,
      affiliateCode: body.affiliateCode,
    };

    // Create the checkout session
    const session = await createCheckoutSession(checkoutData);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
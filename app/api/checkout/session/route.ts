import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, CheckoutSessionData } from '@/app/lib/stripe';
import { CartItem } from '@/app/contexts/CartContext';

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
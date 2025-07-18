import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession } from '@/app/lib/stripe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the checkout session
    const session = await getCheckoutSession(sessionId);

    // Return relevant session information
    return NextResponse.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      shipping_details: session.shipping_details,
      line_items: session.line_items?.data,
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping } from '@/app/lib/printify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.line_items || !Array.isArray(body.line_items) || body.line_items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Line items are required',
        },
        { status: 400 }
      );
    }

    if (!body.address_to || !body.address_to.country) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Shipping address country is required',
        },
        { status: 400 }
      );
    }

    // Calculate shipping rates
    const shippingRates = await calculateShipping(
      body.line_items,
      {
        country: body.address_to.country,
        region: body.address_to.region,
        zip: body.address_to.zip,
      }
    );

    // Return shipping options with rates in cents (USD)
    return NextResponse.json({
      success: true,
      data: {
        standard: {
          method: 1,
          name: 'Standard Shipping',
          price: shippingRates.standard * 100, // Convert to cents
          estimated_delivery: '7-14 business days',
        },
        ...(shippingRates.express && {
          express: {
            method: 2,
            name: 'Express Shipping',
            price: shippingRates.express * 100, // Convert to cents
            estimated_delivery: '3-5 business days',
          },
        }),
        currency: 'USD',
      },
    });
  } catch (error) {
    console.error('Failed to calculate shipping:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate shipping',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
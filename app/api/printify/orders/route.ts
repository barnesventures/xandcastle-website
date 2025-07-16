import { NextRequest, NextResponse } from 'next/server';
import { createOrder, submitOrderForFulfillment } from '@/app/lib/printify';
import { CreateOrderRequest } from '@/app/lib/types/printify';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
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

    if (!body.address_to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Shipping address is required',
        },
        { status: 400 }
      );
    }

    // Validate address fields
    const requiredAddressFields = ['first_name', 'last_name', 'address1', 'city', 'country'];
    const missingFields = requiredAddressFields.filter(field => !body.address_to[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid address',
          message: `Missing required address fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Create order data with defaults
    const orderData: CreateOrderRequest = {
      external_id: body.external_id || `xandcastle_${Date.now()}`,
      line_items: body.line_items.map((item: any) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity || 1,
      })),
      shipping_method: body.shipping_method || 1, // Default to standard shipping
      send_shipping_notification: body.send_shipping_notification !== false, // Default to true
      address_to: {
        first_name: body.address_to.first_name,
        last_name: body.address_to.last_name,
        email: body.address_to.email,
        phone: body.address_to.phone,
        country: body.address_to.country,
        region: body.address_to.region,
        address1: body.address_to.address1,
        address2: body.address_to.address2,
        city: body.address_to.city,
        zip: body.address_to.zip,
      },
    };

    // Create the order
    const order = await createOrder(orderData);
    
    // If auto_submit is true, submit the order for fulfillment immediately
    if (body.auto_submit) {
      try {
        await submitOrderForFulfillment(order.id);
        console.log(`Order ${order.id} auto-submitted for fulfillment`);
      } catch (submitError) {
        console.error('Failed to auto-submit order:', submitError);
        // Don't fail the entire request if auto-submit fails
        // The order was created successfully
      }
    }

    // Return order details
    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        external_id: order.external_id,
        status: order.status,
        line_items: order.line_items,
        total_price: order.total_price,
        total_shipping: order.total_shipping,
        total_tax: order.total_tax,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check order status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('id');
  
  if (!orderId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Order ID is required',
      },
      { status: 400 }
    );
  }

  try {
    const { getOrderStatus } = await import('@/app/lib/printify');
    const orderStatus = await getOrderStatus(orderId);
    
    return NextResponse.json({
      success: true,
      data: orderStatus,
    });
  } catch (error) {
    console.error(`Failed to fetch order status for ${orderId}:`, error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order status',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
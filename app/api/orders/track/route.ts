import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getOrderStatus } from '@/app/lib/printify';
import { Prisma, OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    // Validate required parameters
    if (!orderNumber || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both order number and email are required',
        },
        { status: 400 }
      );
    }

    // Find order in database
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber,
        email: email.toLowerCase(),
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found. Please check your order number and email.',
        },
        { status: 404 }
      );
    }

    // If we have a Printify order ID, fetch latest status from Printify
    let latestStatus = null;
    let shipments = order.shipments as Prisma.JsonArray || [];
    
    if (order.printifyOrderId) {
      try {
        const printifyStatus = await getOrderStatus(order.printifyOrderId);
        
        // Update order with latest status from Printify
        const updateData: Prisma.OrderUpdateInput = {
          status: mapPrintifyStatusToOrderStatus(printifyStatus.status),
          fulfillmentStatus: printifyStatus.fulfillment_status,
        };

        // Update shipments if available
        if (printifyStatus.shipments && printifyStatus.shipments.length > 0) {
          shipments = printifyStatus.shipments as unknown as Prisma.JsonArray;
          updateData.shipments = shipments;
          
          // Update tracking info from first shipment
          const firstShipment = printifyStatus.shipments[0];
          if (firstShipment) {
            updateData.trackingNumber = firstShipment.number;
            updateData.trackingCarrier = firstShipment.carrier;
            updateData.trackingUrl = firstShipment.url;
          }
        }

        // Update order in database with latest status
        await prisma.order.update({
          where: { id: order.id },
          data: updateData,
        });

        latestStatus = printifyStatus;
      } catch (error) {
        console.error('Failed to fetch Printify status:', error);
        // Continue with cached data if Printify fetch fails
      }
    }

    // Parse items and shipping address for response
    const items = order.items as Prisma.JsonArray;
    const shippingAddress = order.shippingAddress as Prisma.JsonObject;

    // Format response
    const response = {
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus,
        customerName: order.customerName,
        email: order.email,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: items,
        pricing: {
          subtotal: order.subtotal.toNumber(),
          shipping: order.shipping.toNumber(),
          tax: order.tax.toNumber(),
          total: order.total.toNumber(),
          currency: order.currency,
        },
        shipping: {
          address: shippingAddress,
          trackingNumber: order.trackingNumber,
          trackingCarrier: order.trackingCarrier,
          trackingUrl: order.trackingUrl,
          shipments: shipments,
        },
        // Include Printify order ID for internal use
        printifyOrderId: order.printifyOrderId,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to track order:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve order information',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * Map Printify status to our OrderStatus enum
 */
function mapPrintifyStatusToOrderStatus(printifyStatus: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    'pending': OrderStatus.PENDING,
    'processing': OrderStatus.PROCESSING,
    'fulfilled': OrderStatus.FULFILLED,
    'cancelled': OrderStatus.CANCELLED,
    'on-hold': OrderStatus.PROCESSING,
    'partially-fulfilled': OrderStatus.PROCESSING,
  };

  return statusMap[printifyStatus.toLowerCase()] || OrderStatus.PENDING;
}
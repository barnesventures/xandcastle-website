import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { createOrder as createPrintifyOrder } from '@/app/lib/printify';
import { sendOrderConfirmationEmail, OrderConfirmationData } from '@/app/lib/email';
import { CreateOrderRequest } from '@/app/lib/types/printify';
import { Prisma } from '@prisma/client';

interface CreateOrderBody {
  userId?: string;
  email: string;
  stripePaymentId: string;
  lineItems: Array<{
    product_id: string;
    variant_id: number;
    quantity: number;
    metadata?: {
      title: string;
      price: number;
      variant_label: string;
    };
  }>;
  shippingAddress: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    country: string;
    region?: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
  billingAddress?: {
    first_name: string;
    last_name: string;
    country: string;
    region?: string;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  shippingMethod?: 1 | 2;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderBody = await request.json();

    // Validate required fields
    if (!body.email || !body.stripePaymentId || !body.lineItems || !body.shippingAddress || !body.pricing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: body.userId || null,
        email: body.email.toLowerCase(),
        status: 'PENDING',
        stripePaymentId: body.stripePaymentId,
        subtotal: new Prisma.Decimal(body.pricing.subtotal / 100), // Convert from cents
        shipping: new Prisma.Decimal(body.pricing.shipping / 100),
        tax: new Prisma.Decimal(body.pricing.tax / 100),
        total: new Prisma.Decimal(body.pricing.total / 100),
        currency: body.pricing.currency || 'USD',
        customerName: `${body.shippingAddress.first_name} ${body.shippingAddress.last_name}`,
        customerPhone: body.shippingAddress.phone || null,
        shippingAddress: body.shippingAddress as Prisma.InputJsonObject,
        billingAddress: body.billingAddress ? body.billingAddress as Prisma.InputJsonObject : Prisma.JsonNull,
        items: body.lineItems.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          title: item.metadata?.title || 'Product',
          variant_label: item.metadata?.variant_label || '',
          price: item.metadata?.price || 0,
        })) as Prisma.InputJsonArray,
      },
    });

    // Create Printify order
    let printifyOrderId = null;
    try {
      const printifyOrderData: CreateOrderRequest = {
        external_id: order.orderNumber,
        line_items: body.lineItems.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        shipping_method: body.shippingMethod || 1,
        send_shipping_notification: false, // We'll send our own
        address_to: body.shippingAddress,
      };

      const printifyOrder = await createPrintifyOrder(printifyOrderData);
      printifyOrderId = printifyOrder.id;

      // Update order with Printify order ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          printifyOrderId: printifyOrder.id,
          status: 'PROCESSING',
        },
      });
    } catch (printifyError) {
      console.error('Failed to create Printify order:', printifyError);
      // Continue - we'll handle fulfillment manually if needed
    }

    // Send confirmation email
    try {
      const emailData: OrderConfirmationData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        email: order.email,
        items: body.lineItems.map(item => ({
          title: item.metadata?.title || 'Product',
          variant_label: item.metadata?.variant_label || '',
          quantity: item.quantity,
          price: item.metadata?.price || 0,
        })),
        subtotal: body.pricing.subtotal,
        shipping: body.pricing.shipping,
        tax: body.pricing.tax,
        total: body.pricing.total,
        currency: body.pricing.currency || 'USD',
        shippingAddress: body.shippingAddress,
      };

      await sendOrderConfirmationEmail(emailData);
      
      // Mark email as sent
      await prisma.order.update({
        where: { id: order.id },
        data: { emailSent: true },
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderId: order.id,
        printifyOrderId,
        status: order.status,
        trackingUrl: `https://xandcastle.com/orders/track?order=${order.orderNumber}&email=${encodeURIComponent(order.email)}`,
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

/**
 * Generate a unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `XC-${timestamp}-${random}`.toUpperCase();
}
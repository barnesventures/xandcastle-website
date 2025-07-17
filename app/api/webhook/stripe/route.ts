import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handleStripeWebhook, stripeAddressToPrintifyAddress } from '@/app/lib/stripe';
import { prisma } from '@/app/lib/prisma';
import { printifyClient } from '@/app/lib/printify-client';
import { CreateOrderRequest, PrintifyLineItem } from '@/app/lib/types/printify';
import { CartItem } from '@/app/contexts/CartContext';
import Stripe from 'stripe';

// Disable body parsing, we need the raw body for webhook verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify and parse the webhook event
    const event = await handleStripeWebhook(body, signature);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only process if payment is successful
        if (session.payment_status === 'paid') {
          await handleSuccessfulPayment(session);
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleFailedPayment(session);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Parse cart items from metadata
    const cartItems: CartItem[] = session.metadata?.cartItems 
      ? JSON.parse(session.metadata.cartItems) 
      : [];

    if (cartItems.length === 0) {
      console.error('No cart items found in session metadata');
      return;
    }

    // Get the full session with expanded data
    const fullSession = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session.id}?expand[]=line_items&expand[]=shipping_cost`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      }
    ).then(res => res.json());

    // Convert Stripe address to Printify format
    const shippingAddress = stripeAddressToPrintifyAddress(
      fullSession.shipping_details,
      fullSession.customer_details
    );

    if (!shippingAddress) {
      console.error('Could not extract shipping address from session');
      return;
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber: `XC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        email: fullSession.customer_details?.email || '',
        status: 'PENDING',
        stripePaymentId: session.payment_intent as string,
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) / 100,
        shipping: (fullSession.shipping_cost?.amount_total || 0) / 100,
        tax: (fullSession.total_details?.amount_tax || 0) / 100,
        total: (fullSession.amount_total || 0) / 100,
        currency: fullSession.currency?.toUpperCase() || 'USD',
        shippingAddress: shippingAddress as any,
        billingAddress: fullSession.customer_details?.address || null,
        items: cartItems,
        userId: null, // We'll implement user association later
      },
    });

    // Prepare Printify line items
    const printifyLineItems: PrintifyLineItem[] = cartItems.map(item => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
    }));

    // Create order in Printify
    const printifyOrderData: CreateOrderRequest = {
      external_id: order.id,
      line_items: printifyLineItems,
      shipping_method: 1, // Standard shipping
      send_shipping_notification: true,
      address_to: shippingAddress,
    };

    const printifyOrder = await printifyClient.createOrder(printifyOrderData);

    // Update order with Printify order ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        printifyOrderId: printifyOrder.id,
        status: 'PROCESSING',
      },
    });

    console.log(`Order created successfully: ${order.orderNumber} (Printify: ${printifyOrder.id})`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

async function handleFailedPayment(session: Stripe.Checkout.Session) {
  console.log(`Payment failed for session: ${session.id}`);
  
  // You could update order status in database if you created a pending order
  // For now, we'll just log it
}
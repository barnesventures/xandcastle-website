import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { sendShippingNotificationEmail } from '@/app/lib/email';
import crypto from 'crypto';
import { OrderStatus, Prisma } from '@prisma/client';

interface PrintifyWebhookEvent {
  type: string;
  created: number;
  resource: {
    id: string;
    external_id?: string;
    status?: string;
    fulfillment_status?: string;
    shipments?: Array<{
      carrier: string;
      number: string;
      url: string;
      delivered_at?: string;
    }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if secret is configured
    if (process.env.PRINTIFY_WEBHOOK_SECRET) {
      const signature = request.headers.get('x-printify-signature');
      const body = await request.text();
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.PRINTIFY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }

      // Parse body after verification
      const event: PrintifyWebhookEvent = JSON.parse(body);
      await handleWebhookEvent(event);
    } else {
      // No signature verification - parse directly
      const event: PrintifyWebhookEvent = await request.json();
      await handleWebhookEvent(event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleWebhookEvent(event: PrintifyWebhookEvent) {
  console.log('Received Printify webhook:', event.type);

  switch (event.type) {
    case 'order:created':
      await handleOrderCreated(event);
      break;
    case 'order:updated':
      await handleOrderUpdated(event);
      break;
    case 'order:shipment:created':
      await handleShipmentCreated(event);
      break;
    case 'order:shipment:delivered':
      await handleShipmentDelivered(event);
      break;
    default:
      console.log('Unhandled webhook event type:', event.type);
  }
}

async function handleOrderCreated(event: PrintifyWebhookEvent) {
  const { id, external_id, status } = event.resource;
  
  if (!external_id) return;

  // Update order status in database
  await prisma.order.updateMany({
    where: { orderNumber: external_id },
    data: {
      printifyOrderId: id,
      status: mapPrintifyStatus(status || 'pending'),
    },
  });
}

async function handleOrderUpdated(event: PrintifyWebhookEvent) {
  const { id, status, fulfillment_status } = event.resource;

  // Find order by Printify ID
  const order = await prisma.order.findFirst({
    where: { printifyOrderId: id },
  });

  if (!order) {
    console.log('Order not found for Printify ID:', id);
    return;
  }

  // Update order status
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: mapPrintifyStatus(status || order.status),
      fulfillmentStatus: fulfillment_status || order.fulfillmentStatus,
    },
  });
}

async function handleShipmentCreated(event: PrintifyWebhookEvent) {
  const { id, shipments } = event.resource;

  if (!shipments || shipments.length === 0) return;

  // Find order by Printify ID
  const order = await prisma.order.findFirst({
    where: { printifyOrderId: id },
  });

  if (!order) {
    console.log('Order not found for Printify ID:', id);
    return;
  }

  const firstShipment = shipments[0];

  // Update order with shipment info
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'SHIPPED',
      trackingNumber: firstShipment.number,
      trackingCarrier: firstShipment.carrier,
      trackingUrl: firstShipment.url,
      shipments: shipments,
    },
  });

  // Send shipping notification email
  try {
    await sendShippingNotificationEmail(
      order,
      firstShipment.number,
      firstShipment.carrier,
      firstShipment.url
    );
  } catch (error) {
    console.error('Failed to send shipping notification:', error);
  }
}

async function handleShipmentDelivered(event: PrintifyWebhookEvent) {
  const { id, shipments } = event.resource;

  // Find order by Printify ID
  const order = await prisma.order.findFirst({
    where: { printifyOrderId: id },
  });

  if (!order) {
    console.log('Order not found for Printify ID:', id);
    return;
  }

  // Update order status to delivered
  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: OrderStatus.DELIVERED,
      shipments: shipments ? shipments as Prisma.InputJsonValue : order.shipments,
    },
  });
}

function mapPrintifyStatus(printifyStatus: string): OrderStatus {
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
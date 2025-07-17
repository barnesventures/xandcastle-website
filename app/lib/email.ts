import { Resend } from 'resend';
import { Order } from '@prisma/client';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  email: string;
  items: Array<{
    title: string;
    variant_label: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    first_name: string;
    last_name: string;
    address1: string;
    address2?: string;
    city: string;
    region?: string;
    country: string;
    zip: string;
  };
  trackingUrl?: string;
}

/**
 * Generate HTML email template for order confirmation
 */
function generateOrderConfirmationHTML(data: OrderConfirmationData): string {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
    }).format(amount / 100);
  };

  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
        <strong>${item.title}</strong><br>
        <span style="color: #666; font-size: 14px;">${item.variant_label}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Xandcastle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Xandcastle</h1>
          <p style="color: #cccccc; margin: 10px 0 0;">Cool Clothes for Cool Kids</p>
        </div>

        <!-- Order Confirmation -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin: 0 0 20px;">Order Confirmed!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hi ${data.customerName},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for your order! We're excited to get your cool new clothes ready for you.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0; color: #333;">
              <strong>Order Number:</strong> ${data.orderNumber}
            </p>
            ${data.trackingUrl ? `
              <p style="margin: 10px 0 0; color: #333;">
                <a href="${data.trackingUrl}" style="color: #007bff; text-decoration: none;">Track Your Order</a>
              </p>
            ` : ''}
          </div>

          <!-- Order Items -->
          <h3 style="color: #333; margin: 30px 0 20px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Item</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Order Summary -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Subtotal:</td>
                <td style="padding: 8px 0; text-align: right; color: #666;">${formatPrice(data.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Shipping:</td>
                <td style="padding: 8px 0; text-align: right; color: #666;">${formatPrice(data.shipping)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Tax:</td>
                <td style="padding: 8px 0; text-align: right; color: #666;">${formatPrice(data.tax)}</td>
              </tr>
              <tr style="font-size: 18px; font-weight: bold;">
                <td style="padding: 12px 0; color: #333; border-top: 2px solid #e0e0e0;">Total:</td>
                <td style="padding: 12px 0; text-align: right; color: #333; border-top: 2px solid #e0e0e0;">${formatPrice(data.total)}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="margin-top: 40px;">
            <h3 style="color: #333; margin: 0 0 15px;">Shipping Address</h3>
            <div style="color: #666; line-height: 1.6;">
              ${data.shippingAddress.first_name} ${data.shippingAddress.last_name}<br>
              ${data.shippingAddress.address1}<br>
              ${data.shippingAddress.address2 ? data.shippingAddress.address2 + '<br>' : ''}
              ${data.shippingAddress.city}, ${data.shippingAddress.region || ''} ${data.shippingAddress.zip}<br>
              ${data.shippingAddress.country}
            </div>
          </div>

          <!-- Track Order Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://xandcastle.com/orders/track?order=${data.orderNumber}&email=${encodeURIComponent(data.email)}" 
               style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: 600;">
              Track Your Order
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0 0 10px;">
            Questions? Email us at <a href="mailto:support@xandcastle.com" style="color: #007bff; text-decoration: none;">support@xandcastle.com</a>
          </p>
          <p style="margin: 0;">
            © ${new Date().getFullYear()} Xandcastle. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email for order confirmation
 */
function generateOrderConfirmationText(data: OrderConfirmationData): string {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
    }).format(amount / 100);
  };

  const itemsList = data.items.map(item => 
    `- ${item.title} (${item.variant_label}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
  ).join('\n');

  return `
Order Confirmed!

Hi ${data.customerName},

Thank you for your order! We're excited to get your cool new clothes ready for you.

Order Number: ${data.orderNumber}
${data.trackingUrl ? `Track Your Order: ${data.trackingUrl}` : ''}

ORDER DETAILS
${itemsList}

SUMMARY
Subtotal: ${formatPrice(data.subtotal)}
Shipping: ${formatPrice(data.shipping)}
Tax: ${formatPrice(data.tax)}
Total: ${formatPrice(data.total)}

SHIPPING ADDRESS
${data.shippingAddress.first_name} ${data.shippingAddress.last_name}
${data.shippingAddress.address1}
${data.shippingAddress.address2 ? data.shippingAddress.address2 + '\n' : ''}${data.shippingAddress.city}, ${data.shippingAddress.region || ''} ${data.shippingAddress.zip}
${data.shippingAddress.country}

Track your order at: https://xandcastle.com/orders/track?order=${data.orderNumber}&email=${encodeURIComponent(data.email)}

Questions? Email us at support@xandcastle.com

© ${new Date().getFullYear()} Xandcastle. All rights reserved.
  `.trim();
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email send');
    return;
  }

  try {
    const result = await resend.emails.send({
      from: 'Xandcastle <orders@xandcastle.com>',
      to: data.email,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: generateOrderConfirmationHTML(data),
      text: generateOrderConfirmationText(data),
    });

    console.log('Order confirmation email sent:', result);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
}

/**
 * Send shipping notification email
 */
export async function sendShippingNotificationEmail(
  order: Order,
  trackingNumber: string,
  carrier: string,
  trackingUrl: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email send');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Shipped - Xandcastle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Xandcastle</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin: 0 0 20px;">Your Order Has Shipped!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Great news! Your order ${order.orderNumber} has been shipped and is on its way to you.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 10px; color: #333;">
              <strong>Tracking Number:</strong> ${trackingNumber}
            </p>
            <p style="margin: 0 0 10px; color: #333;">
              <strong>Carrier:</strong> ${carrier}
            </p>
            <p style="margin: 0;">
              <a href="${trackingUrl}" style="color: #007bff; text-decoration: none; font-weight: 600;">
                Track Your Package
              </a>
            </p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${trackingUrl}" 
               style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: 600;">
              Track Your Package
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9f9f9; padding: 30px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">
            © ${new Date().getFullYear()} Xandcastle. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Your Order Has Shipped!

Great news! Your order ${order.orderNumber} has been shipped and is on its way to you.

Tracking Number: ${trackingNumber}
Carrier: ${carrier}
Track Your Package: ${trackingUrl}

© ${new Date().getFullYear()} Xandcastle. All rights reserved.
  `.trim();

  try {
    const result = await resend.emails.send({
      from: 'Xandcastle <orders@xandcastle.com>',
      to: order.email,
      subject: `Your Order Has Shipped - ${order.orderNumber}`,
      html,
      text,
    });

    console.log('Shipping notification email sent:', result);
  } catch (error) {
    console.error('Failed to send shipping notification email:', error);
    throw error;
  }
}
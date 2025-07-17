import Stripe from 'stripe';
import { CartItem } from '@/app/contexts/CartContext';
import { CreateOrderRequest, PrintifyAddress } from '@/app/lib/types/printify';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Stripe types for checkout session
export interface CheckoutSessionData {
  customerEmail?: string;
  cartItems: CartItem[];
  shippingAddress?: PrintifyAddress;
  currency: string;
  successUrl: string;
  cancelUrl: string;
  affiliateCode?: string;
}

// Create a Stripe product from a cart item
async function createStripeProduct(item: CartItem): Promise<Stripe.Product> {
  try {
    // Check if product already exists
    const existingProducts = await stripe.products.list({
      limit: 1,
      active: true,
    });

    const existingProduct = existingProducts.data.find(
      p => p.metadata.productId === item.productId && p.metadata.variantId === String(item.variantId)
    );

    if (existingProduct) {
      return existingProduct;
    }

    // Create new product
    return await stripe.products.create({
      name: `${item.title} - ${item.variantTitle}`,
      metadata: {
        productId: item.productId,
        variantId: String(item.variantId),
        color: item.color || '',
        size: item.size || '',
      },
      images: item.image ? [item.image] : undefined,
    });
  } catch (error) {
    console.error('Error creating Stripe product:', error);
    throw error;
  }
}

// Create a Stripe price for a product
async function createStripePrice(
  productId: string,
  priceInCents: number,
  currency: string
): Promise<Stripe.Price> {
  try {
    return await stripe.prices.create({
      product: productId,
      unit_amount: priceInCents,
      currency: currency.toLowerCase(),
    });
  } catch (error) {
    console.error('Error creating Stripe price:', error);
    throw error;
  }
}

// Create a checkout session
export async function createCheckoutSession(data: CheckoutSessionData): Promise<Stripe.Checkout.Session> {
  try {
    // Create line items from cart items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = await Promise.all(
      data.cartItems.map(async (item) => {
        const product = await createStripeProduct(item);
        const price = await createStripePrice(product.id, item.price, data.currency);

        return {
          price: price.id,
          quantity: item.quantity,
        };
      })
    );

    // Calculate shipping (this is a placeholder - you should get real shipping rates from Printify)
    const shippingRate = await stripe.shippingRates.create({
      display_name: 'Standard Shipping',
      type: 'fixed_amount',
      fixed_amount: {
        amount: 500, // $5.00 in cents
        currency: data.currency.toLowerCase(),
      },
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 5,
        },
        maximum: {
          unit: 'business_day',
          value: 10,
        },
      },
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,
      shipping_address_collection: data.shippingAddress ? undefined : {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI'],
      },
      shipping_options: [
        {
          shipping_rate: shippingRate.id,
        },
      ],
      metadata: {
        cartItems: JSON.stringify(data.cartItems),
        currency: data.currency,
        affiliateCode: data.affiliateCode || '',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Retrieve a checkout session
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'payment_intent'],
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}

// Handle webhook events
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return event;
  } catch (error) {
    console.error('Error validating webhook signature:', error);
    throw error;
  }
}

// Convert Stripe address to Printify address format
export function stripeAddressToPrintifyAddress(
  shippingDetails: Stripe.Checkout.Session.ShippingDetails | null,
  customerDetails: Stripe.Checkout.Session.CustomerDetails | null
): PrintifyAddress | null {
  if (!shippingDetails?.address || !customerDetails) {
    return null;
  }

  const { address } = shippingDetails;
  const nameParts = (shippingDetails.name || customerDetails.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    first_name: firstName,
    last_name: lastName,
    email: customerDetails.email || undefined,
    phone: customerDetails.phone || undefined,
    country: address.country || '',
    region: address.state || undefined,
    address1: address.line1 || '',
    address2: address.line2 || undefined,
    city: address.city || '',
    zip: address.postal_code || '',
  };
}

// Create a payment intent for custom payment flow (alternative to checkout session)
export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export default stripe;
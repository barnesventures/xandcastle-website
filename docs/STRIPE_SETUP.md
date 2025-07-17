# Stripe Integration Setup Guide

This guide documents the Stripe integration for the Xandcastle website, including checkout flow, webhook handling, and order processing.

## Overview

The Stripe integration handles:
- Creating checkout sessions for cart items
- Processing payments securely
- Handling webhooks for order fulfillment
- Creating orders in both our database and Printify

## Setup Instructions

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..." # Your Stripe publishable key
STRIPE_SECRET_KEY="sk_test_..."             # Your Stripe secret key
STRIPE_WEBHOOK_SECRET="whsec_..."           # Your webhook endpoint secret

# Base URL (for redirects)
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # Change for production
```

### 2. Stripe Dashboard Configuration

1. **Create Products**: Products are automatically created when checkout sessions are initiated
2. **Configure Webhooks**:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhook/stripe`
   - Select events:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
     - `checkout.session.async_payment_failed`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 3. Testing Locally

For local webhook testing, use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local endpoint
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Copy the webhook signing secret shown and use it as STRIPE_WEBHOOK_SECRET
```

## Architecture

### Files Created

1. **`app/lib/stripe.ts`**
   - Core Stripe integration library
   - Functions for creating checkout sessions
   - Webhook handling utilities
   - Type definitions

2. **`app/api/checkout/session/route.ts`**
   - POST endpoint to create checkout sessions
   - Validates cart items and creates Stripe session

3. **`app/api/checkout/session/[id]/route.ts`**
   - GET endpoint to retrieve session status
   - Used by success page to verify payment

4. **`app/api/webhook/stripe/route.ts`**
   - Handles Stripe webhook events
   - Creates orders in database and Printify
   - Updates order status

5. **`app/checkout/page.tsx`**
   - Checkout form with customer information
   - Integrates with Stripe for payment
   - Supports guest checkout

6. **`app/checkout/success/page.tsx`**
   - Success page after payment
   - Retrieves and displays order details
   - Clears cart after successful payment

## Checkout Flow

1. **Cart Page** → User clicks "Proceed to Checkout"
2. **Checkout Page** → User enters customer information
3. **Stripe Checkout** → User enters payment details on Stripe-hosted page
4. **Success Page** → Order confirmation displayed
5. **Webhook Processing** → Order created in database and Printify

## Order Processing

When a payment succeeds:

1. Stripe sends `checkout.session.completed` webhook
2. Webhook handler:
   - Creates order in database with status `PENDING`
   - Sends order to Printify API
   - Updates order status to `PROCESSING`
   - Stores Printify order ID for tracking

## Security Considerations

- All payment processing happens on Stripe's secure servers
- Webhook signatures are verified to prevent forgery
- No credit card details are stored in our database
- Customer data is encrypted in transit

## Testing

### Test Cards

Use these test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### Test Flow

1. Add items to cart
2. Go to checkout
3. Fill in test customer information
4. Use test card for payment
5. Verify order created in database
6. Check Printify API for order creation

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Ensure server is accessible from internet

2. **Checkout session creation fails**
   - Verify Stripe keys are correct
   - Check cart items have valid data
   - Ensure prices are in cents

3. **Orders not created in Printify**
   - Verify Printify API credentials
   - Check product/variant IDs match
   - Review webhook logs for errors

## Future Enhancements

- [ ] Add support for promotional codes
- [ ] Implement subscription products
- [ ] Add Apple Pay and Google Pay
- [ ] Create customer portal for order history
- [ ] Add automated tax calculation
- [ ] Implement dynamic shipping rates from Printify
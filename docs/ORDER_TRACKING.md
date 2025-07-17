# Order Tracking Documentation

## Overview

The Xandcastle website includes comprehensive order tracking functionality that integrates with Printify's fulfillment system and provides email notifications to customers.

## Features

### 1. Order Creation & Storage
- Orders are created in the local database with full customer and item details
- Each order receives a unique order number (format: `XC-TIMESTAMP-RANDOM`)
- Orders are synchronized with Printify for fulfillment
- Support for both guest and logged-in customers

### 2. Email Notifications
- **Order Confirmation Email**: Sent immediately after successful order creation
- **Shipping Notification Email**: Sent when order ships (via webhook)
- Beautiful HTML email templates with order details and tracking links
- Powered by Resend email service

### 3. Order Tracking Page
- Located at `/orders/track`
- Customers can look up orders using order number + email
- Real-time status updates from Printify API
- Displays:
  - Order status and fulfillment progress
  - Order items with pricing
  - Shipping address
  - Tracking information (when available)
  - Direct tracking links to carrier websites

### 4. Webhook Integration
- Endpoint at `/api/webhooks/printify`
- Handles Printify events:
  - Order status updates
  - Shipment creation
  - Delivery notifications
- Automatically updates local database
- Triggers shipping notification emails

## Database Schema Updates

The Order model has been enhanced with:
- `customerName`: Full name for display
- `customerPhone`: Optional phone number
- `trackingUrl`: Direct tracking link
- `fulfillmentStatus`: Printify fulfillment status
- `shipments`: JSON array of shipment details
- `emailSent`: Boolean to track confirmation email status
- Composite index on `orderNumber` + `email` for guest lookups

## API Endpoints

### Create Order
`POST /api/orders/create`
- Creates order in database
- Submits to Printify
- Sends confirmation email
- Returns order number and tracking URL

### Track Order
`GET /api/orders/track?orderNumber=XC-ABC123&email=customer@email.com`
- Validates order ownership via email
- Fetches latest status from Printify
- Updates local database cache
- Returns comprehensive order details

### Printify Webhook
`POST /api/webhooks/printify`
- Verifies webhook signature (if configured)
- Processes order and shipment events
- Updates order status
- Sends shipping notifications

## Environment Variables

Required:
```env
# Database
DATABASE_URL="postgresql://..."

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Printify (existing)
PRINTIFY_API_TOKEN="..."
PRINTIFY_SHOP_ID="..."

# Optional
PRINTIFY_WEBHOOK_SECRET="..." # For webhook signature verification
```

## Email Configuration

### Resend Setup
1. Sign up at https://resend.com
2. Verify your domain
3. Add SPF/DKIM records
4. Get API key and add to `.env`

### Email Templates
- Order confirmation: Includes order details, items, pricing, and tracking link
- Shipping notification: Includes tracking number and carrier link
- Both templates are responsive and mobile-friendly

## User Flow

1. **Checkout**: Customer completes Stripe payment
2. **Order Creation**: System creates order record and sends to Printify
3. **Confirmation**: Customer receives email and sees confirmation page
4. **Tracking**: Customer can track order via:
   - Email link
   - Header navigation "Track Order"
   - Direct URL with order number + email
5. **Updates**: Printify webhooks keep status current
6. **Shipping**: Customer receives email when order ships

## Testing

1. Create a test order through checkout flow
2. Check order confirmation email
3. Visit tracking page with order number + email
4. Verify order details display correctly
5. Test webhook by manually triggering Printify events

## Security Considerations

- Email validation prevents unauthorized order access
- Webhook signature verification (when configured)
- Case-insensitive email matching
- No sensitive payment details exposed
- Rate limiting on API endpoints (TODO)

## Future Enhancements

- SMS notifications option
- Order history in user accounts
- Estimated delivery dates
- Multi-language email templates
- Advanced order filtering/search
- Return/refund tracking
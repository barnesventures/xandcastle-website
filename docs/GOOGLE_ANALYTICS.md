# Google Analytics Integration

This document describes the Google Analytics 4 (GA4) integration for the Xandcastle website.

## Overview

The integration includes:
- GDPR-compliant cookie consent management
- Google Analytics 4 (GA4) tracking with gtag.js
- E-commerce event tracking
- Development mode protection (analytics only loads in production)

## Setup

### 1. Environment Variables

Add your GA4 Measurement ID to your `.env.local` file:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

You can find your Measurement ID in your Google Analytics 4 property settings.

### 2. Cookie Consent

The site includes a GDPR-compliant cookie consent banner that:
- Appears on first visit
- Allows users to accept/reject different cookie categories
- Stores preferences for 365 days
- Only loads analytics after consent is given

Users can manage their preferences at any time via the cookie policy page at `/cookies`.

## Tracked Events

The following events are automatically tracked:

### Page Views
- Tracked automatically on route changes
- Includes page path and title

### E-commerce Events

#### View Item List
- Fires when users view the shop page
- Includes up to 10 products with basic info

#### View Item
- Fires when users view a product detail page
- Includes product details and pricing

#### Add to Cart
- Fires when users add items to cart
- Includes product, variant, quantity, and price

#### Remove from Cart
- Fires when users remove items from cart
- Includes product details and quantity removed

#### Begin Checkout
- Fires when users reach the checkout page
- Includes all cart items and total value

#### Purchase (To be implemented)
- Will fire on successful order completion
- Will include transaction details and all items

### Other Events

#### Newsletter Signup
- Fires when users subscribe to the newsletter
- Method: 'newsletter'

## Implementation Details

### Components

1. **CookieConsentContext** (`/app/contexts/CookieConsentContext.tsx`)
   - Manages consent state
   - Persists consent preferences
   - Updates Google Analytics consent mode

2. **CookieConsentBanner** (`/app/components/CookieConsentBanner.tsx`)
   - GDPR-compliant consent UI
   - Allows granular consent control
   - Links to cookie policy

3. **GoogleAnalytics** (`/app/components/GoogleAnalytics.tsx`)
   - Loads gtag.js script
   - Configures consent mode
   - Tracks page views automatically

4. **Analytics Utilities** (`/app/utils/analytics.ts`)
   - Type-safe event tracking functions
   - Consent checking
   - Development mode protection

### Integration Points

Analytics events are integrated into:
- Cart context (add/remove items)
- Shop pages (view item list)
- Product pages (view item)
- Checkout page (begin checkout)
- Footer component (newsletter signup)

## Testing

To test analytics in development:
1. Temporarily comment out the production check in `/app/components/GoogleAnalytics.tsx`
2. Use the Google Analytics Debugger Chrome extension
3. Check the Network tab for `collect` requests to Google Analytics

## Privacy Compliance

The implementation follows GDPR requirements:
- Explicit consent required before loading analytics
- Granular consent options (analytics, marketing, functional)
- Easy consent withdrawal
- Clear cookie policy
- Consent preferences stored locally

## Future Enhancements

1. Add purchase completion tracking
2. Implement enhanced e-commerce tracking
3. Add custom events for user interactions
4. Implement server-side tracking for better accuracy
5. Add Google Ads conversion tracking (with marketing consent)
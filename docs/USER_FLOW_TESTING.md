# User Flow Testing Guide

This guide documents the complete user flow for the Xandcastle website, from browsing products to order tracking.

## Prerequisites

1. **Database Setup**
   ```bash
   # Run migrations
   npm run db:push
   
   # Seed test data
   npm run db:seed:test
   ```

2. **Environment Variables**
   Ensure all required environment variables are set in `.env.local`

3. **Development Server**
   ```bash
   npm run dev
   ```

## Test Accounts

- **Regular User**: test@example.com / testpassword123
- **Admin User**: admin@xandcastle.com / testpassword123

## Complete User Flow

### 1. Browse Products

**Path**: Homepage → Shop

1. Navigate to http://localhost:3000
2. Click "Shop Now" button or "Shop" in navigation
3. Verify:
   - Product grid loads with images
   - Prices display in selected currency
   - Loading skeletons appear while fetching
   - Product cards are clickable

### 2. Product Details

**Path**: Shop → Product Detail

1. Click on any product card
2. Verify on product page:
   - Product images load with blur placeholders
   - Image gallery is interactive
   - Product title and description display
   - Price shows correctly
   - Size/color variants are selectable
   - "Add to Cart" button is functional

### 3. Add to Cart

**Path**: Product → Cart

1. Select size and color (if applicable)
2. Set quantity
3. Click "Add to Cart"
4. Verify:
   - Success notification appears
   - Cart icon updates with item count
   - Mini cart slides out showing item
   - Item details are correct

### 4. Shopping Cart

**Path**: Mini Cart → Full Cart

1. Click "View Cart" in mini cart or cart icon
2. Verify cart page shows:
   - All added items with images
   - Correct quantities and prices
   - Update quantity functionality
   - Remove item functionality
   - Subtotal calculation
   - "Proceed to Checkout" button

### 5. Checkout Process

**Path**: Cart → Checkout

#### Guest Checkout
1. Click "Proceed to Checkout"
2. Select "Continue as Guest"
3. Fill in:
   - Email address
   - First and last name
   - Phone number
4. Click "Continue to Payment"
5. Verify Stripe checkout loads

#### Registered User Checkout
1. Sign in with test account
2. Verify user info pre-fills
3. Click "Continue to Payment"

### 6. Payment (Test Mode)

**Stripe Test Cards**:
- Success: 4242 4242 4242 4242
- Requires Auth: 4000 0025 0000 3155
- Declined: 4000 0000 0000 9995

1. Enter test card details:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Postal: Any valid postal code

2. Fill shipping address
3. Complete payment
4. Verify redirect to success page

### 7. Order Confirmation

**Path**: Checkout → Success

1. Verify success page shows:
   - Success message
   - Order summary
   - Order ID
   - Email confirmation note
   - "Continue Shopping" button

### 8. Order Tracking

**Path**: Orders → Track Order

#### For Registered Users
1. Go to Account → Orders
2. Verify order list shows:
   - Order number
   - Date
   - Status
   - Total
   - View details link

#### For Guest Users
1. Go to "Track Order" page
2. Enter:
   - Order number
   - Email address
3. Click "Track Order"
4. Verify order details display

### 9. Admin Features

**Path**: Admin Dashboard

1. Sign in as admin
2. Navigate to /admin
3. Verify access to:
   - Dashboard with statistics
   - Blog post management
   - Order management
   - Product sync functionality

### 10. Additional Features to Test

#### Currency Switching
1. Click currency selector in header
2. Select different currency
3. Verify all prices update
4. Check persistence on page refresh

#### Windsor Collection
1. Navigate to /windsor
2. Verify Windsor-specific products display
3. Test adding Windsor product to cart

#### Blog
1. Navigate to /blog
2. Click on blog post
3. Verify markdown renders correctly

#### Error Handling
1. Navigate to non-existent page
2. Verify 404 page displays
3. Test "Back to Home" button

## Performance Checklist

- [ ] Images load with blur placeholders
- [ ] Loading skeletons appear for dynamic content
- [ ] Page transitions are smooth
- [ ] Cart updates without page refresh
- [ ] Error states handle gracefully

## Mobile Testing

Repeat key flows on mobile viewport:
- [ ] Navigation menu works
- [ ] Product grid responds correctly
- [ ] Cart drawer is usable
- [ ] Checkout form is mobile-friendly
- [ ] Images scale appropriately

## Accessibility Testing

- [ ] All interactive elements are keyboard accessible
- [ ] Images have appropriate alt text
- [ ] Form labels are properly associated
- [ ] Error messages are announced
- [ ] Color contrast meets WCAG standards

## Common Issues & Solutions

### Cart Not Updating
- Check browser console for errors
- Verify localStorage is enabled
- Clear cart and try again

### Payment Failing
- Ensure using test card numbers
- Check Stripe webhook configuration
- Verify environment variables

### Images Not Loading
- Check Printify API connection
- Verify image URLs are valid
- Check for CORS issues

## Test Data Reset

To reset test data:
```bash
# Clear database
npm run db:push -- --force-reset

# Re-seed test data
npm run db:seed:test
```
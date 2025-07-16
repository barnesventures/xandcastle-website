# CLAUDE.md - Project Context for Xandcastle Website

## Project Overview
Xandcastle is a clothing brand for kids and teens designed by a 12-year-old, featuring a custom storefront that integrates with Printify for product fulfillment. The site also includes a sub-brand for Windsor tourist merchandise.

## Tech Stack
- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (Hobby Plan)
- **Database**: Neon PostgreSQL
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Print-on-Demand**: Printify API
- **Currency**: ExchangeRate API
- **Email**: SendGrid or Resend

## Key Features
1. Custom storefront replacing default Printify shop
2. Dynamic product display via Printify API
3. Local currency conversion based on user location
4. Customer accounts and guest checkout
5. Stripe-powered on-site checkout
6. Admin dashboard for blog/CMS content
7. Windsor tourist merchandise sub-brand

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Environment Variables
Required in `.env.local`:
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `PRINTIFY_API_KEY` - Printify API key
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

## Project Structure
```
/app                 # Next.js App Router
  /api              # API routes (Stripe, Printify)
  /components       # Reusable UI components
  /(routes)         # Page routes
/lib                # Utilities and helpers
/public             # Static assets
/prisma             # Database schema
```

## Development Guidelines
1. Use TypeScript for all new code
2. Follow mobile-first responsive design
3. Keep founder identity anonymous
4. Target keywords: "cool t-shirts for kids", "Windsor souvenirs", "castle-themed clothing"
5. All prices should be converted from USD (Printify) to user's local currency
6. Support both guest checkout and customer accounts
7. Windsor tourist collection should have distinct visual treatment

## Testing Checklist
- [ ] Product catalog loads from Printify
- [ ] Cart functionality (add, remove, update)
- [ ] Currency conversion works correctly
- [ ] Stripe checkout completes successfully
- [ ] Order syncs to Printify
- [ ] Customer can track orders
- [ ] Admin can create/edit blog posts
- [ ] Site is responsive on all devices
- [ ] SEO meta tags are present
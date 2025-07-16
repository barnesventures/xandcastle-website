# Xandcastle Web Store

Xandcastle is a clothing brand designed by a 12-year-old, offering unique t-shirts and fashion for kids and teens. This custom-built storefront integrates with Printify for product fulfillment and allows customers to shop in their local currency.

## 🔗 Live Site

[https://xandcastle.com](https://xandcastle.com)

---

## ✨ Features

- Custom storefront using Next.js + Tailwind
- Printify product sync and order fulfillment
- Stripe-powered checkout on-site
- Currency localization (GBP + others)
- Customer accounts and guest checkout
- Admin dashboard for blog and CMS
- Sub-brand for Windsor tourist merchandise
- Hosted on Vercel with Neon PostgreSQL database

---

## 🔧 Tech Stack

| Feature        | Stack                          |
|----------------|-------------------------------|
| Frontend       | Next.js, Tailwind CSS          |
| Hosting        | Vercel (Hobby Plan)            |
| Database       | Neon PostgreSQL                |
| Auth           | NextAuth.js                    |
| CMS            | Custom dashboard               |
| Payments       | Stripe                         |
| API            | Printify                       |
| Currency FX    | ExchangeRate.host or similar   |
| Emails         | Resend or SendGrid             |

---

## 📁 Folder Structure

```
/app
  /api         ← Stripe, Printify endpoints
  /components  ← UI components
  /pages       ← Product, cart, blog, admin
  /styles      ← Tailwind setup
  /utils       ← Currency conversion, auth, API helpers
/public
  /media       ← Logo, assets
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then update `.env.local` with your actual API keys and credentials:

#### API Key Setup Guide

**NextAuth.js Configuration:**
- `NEXTAUTH_SECRET`: Generate a secure random string (32+ characters)
  ```bash
  # Generate using OpenSSL:
  openssl rand -base64 32
  ```
- `NEXTAUTH_URL`: Set to `http://localhost:3000` for development

**Stripe API Keys:**
1. Sign up for a [Stripe account](https://dashboard.stripe.com/register)
2. Navigate to [API Keys](https://dashboard.stripe.com/test/apikeys) in your dashboard
3. Copy your test keys:
   - `STRIPE_SECRET_KEY`: Your secret key (starts with `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your publishable key (starts with `pk_test_`)

**Printify API Key:**
1. Create a [Printify account](https://printify.com/app/register)
2. Go to your [Printify account settings](https://printify.com/app/account/api)
3. Generate a new API token
4. Copy the token to `PRINTIFY_API_KEY`

**Database URL:**
1. Sign up for [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from your dashboard
4. Update `DATABASE_URL` with your connection string

**Email Service (Choose One):**

*Option A - SendGrid:*
1. Sign up for [SendGrid](https://signup.sendgrid.com/)
2. Go to Settings → [API Keys](https://app.sendgrid.com/settings/api_keys)
3. Create a new API key with "Full Access"
4. Copy to `SENDGRID_API_KEY`

*Option B - Resend:*
1. Sign up for [Resend](https://resend.com/signup)
2. Go to [API Keys](https://resend.com/api-keys)
3. Copy your API key to `RESEND_API_KEY`

**Exchange Rate API:**
1. Sign up for [ExchangeRate-API](https://app.exchangerate-api.com/sign-up) (free tier available)
2. Or use [Fixer.io](https://fixer.io/signup/free) as an alternative
3. Copy your API key to `EXCHANGE_RATE_API_KEY`

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 🧭 Roadmap

See [PRD.md](./PRD.md) for detailed roadmap and feature spec.

---

## 🧵 Brand Assets

- Logo: ![Xandcastle Logo](https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/22236584/78d920cb-3197-45ba-b476-03c3bde060fc)

---

## 📬 Contact

For questions or contributions, please contact the creator’s parent at [info@xandcastle.com](mailto:info@xandcastle.com).

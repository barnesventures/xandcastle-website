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

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=...
PRINTIFY_API_KEY=...
DATABASE_URL=...

# 3. Run dev server
npm run dev
```

---

## 🧭 Roadmap

See [PRD.md](./PRD.md) for detailed roadmap and feature spec.

---

## 🧵 Brand Assets

- Logo: ![Xandcastle Logo](https://pfy-prod-image-storage.s3.us-east-2.amazonaws.com/22236584/78d920cb-3197-45ba-b476-03c3bde060fc)

---

## 📬 Contact

For questions or contributions, please contact the creator’s parent at [info@xandcastle.com](mailto:info@xandcastle.com).

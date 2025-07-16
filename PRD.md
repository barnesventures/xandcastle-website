# 📄 Product Requirements Document (PRD): Xandcastle Web Store

## 🧁 Overview

**Project**: Xandcastle – a clothing brand for kids and teens, with a Windsor tourist merchandise sub-brand 
**Owner**: Xanthippe Barnes
**Domain**: https://xandcastle.com 
**Stack**: Built using Claude Code CLI, deployed to Vercel, powered by Printify API 
**Goal**: Build a fun, responsive storefront that allows customers to browse and order print-on-demand designs in their local currency with integrated customer accounts, blog content, Stripe-powered checkout, and a sub-brand targeting Windsor tourists.

---

## 🎯 Objectives

- Replace the default Printify shopfront with a custom site
- Display products and prices dynamically via the Printify API
- Show prices in local currencies based on user location
- Support customer accounts, order tracking, and guest checkout
- Accept payments via Stripe on-site
- Provide an admin interface for blog/news content
- Create and promote a sub-brand for Windsor tourist-themed merchandise

---

## 🧱 Technical Stack

| Component            | Technology                         |
|----------------------|-------------------------------------|
| Frontend Framework   | Next.js (via Claude Code CLI)       |
| Hosting              | Vercel (Hobby Plan)                 |
| Styling              | Tailwind CSS                        |
| Auth & Accounts      | NextAuth.js with Stripe integration |
| CMS                  | Custom CMS using Neon PostgreSQL   |
| Database             | Neon database via Vercel integration |
| Payment              | Stripe Checkout (custom integration)|
| Print on Demand API  | Printify API                        |
| Currency Conversion  | Real-time via exchange rate API     |

---

## 🛍️ E-Commerce Functionality

| Feature                         | Requirement                                                                 |
|----------------------------------|------------------------------------------------------------------------------|
| Product Catalog                 | Sync with Printify API (both catalog & fulfillment)                         |
| Product Variants                | Support sizes, colors, quantity                                             |
| Price Display                   | Fetch USD price from Printify, convert/display in user’s native currency   |
| Currency Detection              | Auto-detect based on geolocation or browser language                       |
| Add to Cart                     | Standard cart flow with update/remove/edit                                 |
| Checkout                        | Handled on-site with Stripe                                                |
| Guest Checkout                  | Yes                                                                         |
| Customer Accounts               | Sign up / login with order tracking                                        |
| Order Tracking                  | Pull order status via Printify API                                         |
| Shipping & Tax                  | Fetched dynamically from Printify or calculated manually as fallback       |
| Windsor Tourist Brand           | Separate collection with location-specific designs                         |

---

## 🧾 Admin & Content

| Feature                         | Requirement                                                       |
|----------------------------------|-------------------------------------------------------------------|
| Admin Interface                 | Simple dashboard for blog posts, order lookup, inventory tracking |
| Blog/News                       | Markdown-based or WYSIWYG editor (e.g., tiptap)                  |
| Brand Story                     | Include section with anonymized backstory                        |

---

## 🌍 Localization & UX

- **Language**: English only at launch
- **Currency Display**: GBP and others, auto-converted via exchange rate API (e.g., ExchangeRate.host)
- **Responsive Design**: Mobile-first layout for all pages
- **Anonymous Branding**: No personal details, generic tone
- **Tourist Collection Visibility**: Home page featured section and separate category

---

## 📬 Notifications

| Trigger                 | Method           | Notes                                 |
|------------------------|------------------|---------------------------------------|
| Order Confirmation     | Email            | Sent from own system (e.g., Resend, SendGrid) |
| Shipping Notification  | Email (optional) | Hooked via Printify webhook           |
| Blog Post Subscription | (Future)         | Optional mailing list                 |

---

## 🔌 Integrations

- **Printify API**
  - Catalog retrieval
  - Order creation
  - Order tracking
- **Stripe API**
  - Payment processing
  - Customer receipts
- **Exchange Rate API**
  - Convert Printify USD pricing to local currencies
- **Email Provider** (SendGrid or Resend)
  - Transactional emails

---

## 🔍 Analytics & SEO

| Area                | Plan                                                                 |
|---------------------|----------------------------------------------------------------------|
| Google Analytics    | Add in v2 or post-launch                                             |
| SEO Meta Tags       | Implement per-page title, description, and alt tags                 |
| Sitemap             | Auto-generate with Next.js sitemap generator                        |
| Robots.txt          | Included with basic crawl config                                    |
| Performance         | Optimize images and bundle size                                     |
| Blog Optimization   | Use H1-H3 tags, proper semantic HTML for blog posts                 |

**SEO Recommendations**:
- Target keywords like "cool t-shirts for kids", "Windsor souvenirs", "castle-themed clothing"
- Make each product page indexable
- Include alt text for every image
- Encourage organic links via blog/news updates

---

## 🗺️ Roadmap

### Phase 1 – MVP (2-4 weeks)
- [ ] Set up Next.js app with Tailwind, deploy to Vercel
- [ ] Connect Printify API for catalog and orders
- [ ] Implement cart and checkout flow (Stripe)
- [ ] Add currency detection and conversion
- [ ] Build product listing + detail pages
- [ ] Enable guest checkout and customer accounts
- [ ] Add order tracking via Printify API
- [ ] Add admin interface for blog posts
- [ ] Add Windsor tourist collection category

### Phase 2 – Polish & Launch
- [ ] Add email confirmation and shipping notifications
- [ ] Add blog section with WYSIWYG editor
- [ ] Add SEO meta tags and sitemap
- [ ] Add Google Analytics
- [ ] Launch to production


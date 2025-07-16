# TASKS.md – Xandcastle Web Store Development Plan

This task file is designed for ClaudeNightsWatch to guide the development of the Xandcastle custom storefront in weekly sprints.

---

## 🏗️ Sprint 1: Project Setup & API Integration

- [x] Initialize Next.js app with TypeScript via Claude CLI
- [x] Install Tailwind CSS and configure project styles
- [x] Set up GitHub repository and Vercel deployment
- [x] Configure environment variables (.env.local)
- [x] Connect to Neon database (PostgreSQL via Vercel integration)
- [x] Integrate Printify API: product catalog sync
- [x] Display products with variant options (size, color)

---

## 🎨 Sprint 2: UI & Cart Logic

- [ ] Build responsive homepage and product grid
- [ ] Product detail pages with variant selectors
- [ ] Implement shopping cart (add, remove, update items)
- [ ] Show converted prices using ExchangeRate API
- [ ] Auto-detect user currency via geolocation or browser
- [ ] Add Windsor Tourist sub-brand section with distinct layout
- [ ] Integrate site-wide navigation and footer

---

## 💳 Sprint 3: Checkout & User Accounts

- [ ] Integrate Stripe checkout for on-site payments
- [ ] Add customer account system using NextAuth.js
- [ ] Support guest checkout (email only)
- [ ] Enable order tracking via Printify API
- [ ] Send order confirmation email via SendGrid or Resend
- [ ] Store user orders in Neon DB for lookup

---

## 📝 Sprint 4: CMS & Admin Dashboard

- [ ] Build admin dashboard for blog/news management
- [ ] Use markdown or WYSIWYG (e.g., tiptap) editor
- [ ] Enable blog post creation and editing
- [ ] Add generic brand story and About page
- [ ] Restrict admin access to authorized users only

---

## 📢 Sprint 5: Polish, SEO & Launch

- [ ] Add meta tags (title, description) per page
- [ ] Optimize all images with alt text
- [ ] Generate sitemap.xml and robots.txt
- [ ] Add Google Analytics tracking
- [ ] Test all user flows: browse → cart → checkout → email
- [ ] Final visual QA and responsive testing
- [ ] Launch site on xandcastle.com

---

## 🧼 Post-Launch / Future

- [ ] Add mailing list opt-in
- [ ] Add multi-language support (i18n)
- [ ] Add inventory visibility and restock notices
- [ ] Explore affiliate/influencer integrations

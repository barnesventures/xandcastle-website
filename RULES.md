# RULES.md – ClaudeNightsWatch Guide for Xandcastle Project

These rules define how ClaudeNightsWatch should assist in building and maintaining the Xandcastle web store. Follow these principles when interpreting tasks, answering questions, or generating code.

---

## 🔧 General Development Rules

1. **Framework**: Use Next.js (TypeScript) with Tailwind CSS.
2. **Hosting**: Deploy on Vercel (Hobby Plan).
3. **CMS**: Use Neon PostgreSQL for blog and admin data.
4. **APIs**: Integrate Printify for products and orders; use Stripe for payments.
5. **Currency**: Always convert and display Printify prices in user’s local currency.
6. **Design**: Use clean, playful aesthetics suitable for a kids/teens fashion brand.
7. **Brand Story**: Keep founder anonymous; focus on creativity and positivity.
8. **Sub-brand**: Include Windsor tourist merchandise under a distinct category.

---

## 🛒 E-Commerce Rules

9. **Product Data**: Fetch from Printify API; allow variant selection (size, color).
10. **Cart**: Build a persistent cart stored in local storage or user session.
11. **Checkout**: Use Stripe on-site checkout, not redirection to Printify.
12. **Accounts**: Support both guest checkout and account registration.
13. **Orders**: Sync orders to Printify and track status via their API.

---

## ✉️ Communication Rules

14. **Emails**: Use own provider (SendGrid or Resend) for confirmations.
15. **Admin**: Allow blog/news updates from secure dashboard only.
16. **Content**: Blog posts should use markdown or a lightweight editor.

---

## 🌍 Localization & UX

17. **Language**: English-only at launch.
18. **Currency**: Auto-detect from geolocation or browser locale.
19. **Accessibility**: Follow WCAG guidelines for contrast, alt tags, keyboard nav.
20. **Responsiveness**: Ensure smooth UX across mobile, tablet, and desktop.

---

## 📈 SEO & Analytics

21. **SEO**: Add meta titles/descriptions per page; alt text on all images.
22. **Sitemap**: Include sitemap.xml and robots.txt for crawling.
23. **Analytics**: Add Google Analytics after MVP launch.

---

## 🤖 Claude Behavior Rules

24. **Focus on Action**: Always propose the next best step when asked questions.
25. **Be Specific**: Generate full files or snippets that can be pasted into code.
26. **Use Context**: Rely on TASKS.md and PRD.md before making assumptions.
27. **Refactor Readably**: Prefer clear, well-structured output over cleverness.
28. **Validate**: When relevant, show test cases, dummy inputs, or usage examples.
29. **Say What You Changed**: When editing, always list what was changed and why.

---

## ✅ Completion Criteria

30. **Done** = deployed feature that passes all checks, including:
   - Functional in dev and prod
   - Styled and responsive
   - Reviewed in browser manually
   - Connected to data/API (if needed)


# 🚀 Xandcastle Launch Checklist

This checklist ensures all critical items are completed before launching the Xandcastle website to production.

## 📋 Pre-Launch Requirements

### 1. Environment & Configuration

#### Vercel Setup
- [ ] Vercel account created and project linked
- [ ] Domain configured (xandcastle.com)
- [ ] SSL certificate active
- [ ] Environment variables set in Vercel dashboard

#### Environment Variables
```env
# Required for production
DATABASE_URL=
NEXTAUTH_URL=https://xandcastle.com
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
PRINTIFY_API_TOKEN=
PRINTIFY_SHOP_ID=
PRINTIFY_WEBHOOK_SECRET=
RESEND_API_KEY=
ADMIN_EMAILS=
```

### 2. Database

- [ ] Production database provisioned (Neon)
- [ ] Connection string updated
- [ ] Migrations run on production
- [ ] Initial admin user created
- [ ] Database backups configured

### 3. Third-Party Services

#### Printify
- [ ] API token valid for production
- [ ] Shop ID configured
- [ ] Products synced
- [ ] Webhook endpoints configured
- [ ] Test order placed and fulfilled

#### Stripe
- [ ] Production API keys set
- [ ] Webhook endpoint registered
- [ ] Webhook secret configured
- [ ] Payment methods enabled
- [ ] Tax settings configured
- [ ] Test live payment flow

#### Email (Resend)
- [ ] Domain verified
- [ ] Email templates tested
- [ ] From address configured
- [ ] SPF/DKIM records added

### 4. Security

- [ ] All API keys are production keys
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] Admin routes protected
- [ ] Secure headers configured

### 5. Performance

- [ ] Images optimized with Next.js Image
- [ ] Bundle size analyzed and optimized
- [ ] Core Web Vitals meet targets:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] CDN configured for static assets
- [ ] Database queries optimized
- [ ] API response caching implemented

### 6. SEO & Analytics

- [ ] Meta tags on all pages
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Google Analytics installed
- [ ] Google Search Console verified
- [ ] Open Graph images configured
- [ ] Structured data implemented

### 7. Legal & Compliance

- [ ] Privacy Policy page live
- [ ] Terms of Service page live
- [ ] Cookie Policy implemented
- [ ] GDPR compliance verified
- [ ] Return/Refund policy clear
- [ ] Shipping information accurate
- [ ] Age verification (if needed)

### 8. Content

- [ ] All placeholder content replaced
- [ ] Product descriptions complete
- [ ] About page finalized
- [ ] Contact information accurate
- [ ] Blog posts published
- [ ] Windsor collection populated

### 9. Testing

- [ ] Cross-browser testing completed:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Mobile responsiveness verified
- [ ] Payment flow tested with real cards
- [ ] Order tracking functional
- [ ] Email notifications working
- [ ] Error pages tested
- [ ] Load testing performed

### 10. Monitoring & Support

- [ ] Error tracking configured (e.g., Sentry)
- [ ] Uptime monitoring active
- [ ] Support email configured
- [ ] Admin notifications working
- [ ] Backup procedures documented
- [ ] Incident response plan ready

## 🚦 Launch Day Tasks

### Pre-Launch (Night Before)
1. [ ] Final database backup
2. [ ] Remove test data
3. [ ] Clear caches
4. [ ] Verify all services are up
5. [ ] Team communication plan ready

### Launch Steps
1. [ ] Deploy to production
2. [ ] Verify deployment successful
3. [ ] Test critical paths:
   - [ ] Homepage loads
   - [ ] Products display
   - [ ] Cart functionality
   - [ ] Checkout process
   - [ ] Order placement
4. [ ] Monitor error logs
5. [ ] Check performance metrics
6. [ ] Announce launch on social media

### Post-Launch (First 24 Hours)
1. [ ] Monitor error rates
2. [ ] Check order processing
3. [ ] Review user feedback
4. [ ] Address critical issues
5. [ ] Celebrate! 🎉

## 📊 Success Metrics

Track these KPIs post-launch:
- Page load times
- Conversion rate
- Cart abandonment rate
- Error rates
- User registrations
- Order volume
- Customer feedback

## 🔧 Rollback Plan

If critical issues arise:
1. Document the issue
2. Assess impact
3. If severe:
   - Revert to previous deployment
   - Communicate with users
   - Fix issues
   - Re-deploy when ready

## 📞 Emergency Contacts

- **Technical Lead**: [Contact Info]
- **Printify Support**: [Support URL]
- **Stripe Support**: [Support URL]
- **Vercel Support**: [Support URL]
- **Domain Registrar**: [Support Info]

## 📝 Notes

- Keep this checklist updated
- Document any deviations
- Save completion date/time
- Archive for future reference

---

**Launch Date**: _____________
**Completed By**: _____________
**Sign-off**: _____________
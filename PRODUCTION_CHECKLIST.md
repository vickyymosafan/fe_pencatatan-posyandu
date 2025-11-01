# Production Deployment Checklist

Use this checklist to ensure all steps are completed before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All ESLint warnings/errors fixed (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] All tests passing (if tests exist)
- [ ] No console.log statements in production code
- [ ] No commented-out code blocks

### Environment Configuration
- [ ] `.env.production.example` reviewed and updated
- [ ] All required environment variables documented
- [ ] Backend API URL confirmed and accessible
- [ ] Environment variables set in hosting platform
- [ ] No sensitive data in environment variables exposed to client

### Security
- [ ] HTTPS enabled on hosting platform
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] CORS properly configured on backend
- [ ] Authentication flow tested
- [ ] Session timeout configured appropriately
- [ ] No API keys or secrets in client-side code
- [ ] Input validation implemented on all forms
- [ ] XSS protection in place

### Performance
- [ ] Production build tested locally (`npm run build && npm run start`)
- [ ] Images optimized (WebP format where possible)
- [ ] Lazy loading implemented for heavy components
- [ ] Code splitting configured
- [ ] Bundle size analyzed and optimized
- [ ] Lighthouse score > 90 for all categories
- [ ] Core Web Vitals meet targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Functionality
- [ ] Login/logout functionality works
- [ ] All admin features tested
  - [ ] User management (CRUD)
  - [ ] Lansia management (CRUD)
  - [ ] QR code generation and display
  - [ ] Reports generation
  - [ ] Dashboard statistics
- [ ] All petugas features tested
  - [ ] QR code scanning
  - [ ] Pemeriksaan input
  - [ ] Riwayat viewing
  - [ ] Dashboard statistics
- [ ] Form validation working correctly
- [ ] Error handling working properly
- [ ] Toast notifications displaying correctly
- [ ] Loading states showing appropriately

### Browser Compatibility
- [ ] Tested on Chrome (latest)
- [ ] Tested on Firefox (latest)
- [ ] Tested on Safari (latest)
- [ ] Tested on Edge (latest)
- [ ] Tested on mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Design
- [ ] Tested on mobile devices (< 768px)
- [ ] Tested on tablets (768px - 1024px)
- [ ] Tested on desktop (> 1024px)
- [ ] Navigation works on all screen sizes
- [ ] Forms usable on mobile devices
- [ ] Tables responsive or scrollable

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested (basic functionality)
- [ ] Alt text on all images
- [ ] Proper heading hierarchy
- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels properly associated

### Backend Integration
- [ ] Backend API accessible from frontend domain
- [ ] CORS configured correctly
- [ ] API endpoints tested and working
- [ ] Error responses handled gracefully
- [ ] Authentication tokens working
- [ ] File uploads working (if applicable)

## Deployment

### Platform Setup
- [ ] Hosting platform account created
- [ ] Project created on hosting platform
- [ ] Git repository connected
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

### Deployment Process
- [ ] Code pushed to production branch
- [ ] Build completed successfully
- [ ] No build warnings or errors
- [ ] Deployment preview tested
- [ ] Production deployment triggered
- [ ] Deployment completed successfully

## Post-Deployment

### Verification
- [ ] Production URL accessible
- [ ] Homepage loads correctly
- [ ] Login functionality works
- [ ] API calls successful
- [ ] All pages accessible
- [ ] No console errors
- [ ] Images loading correctly
- [ ] QR scanner works (HTTPS required)

### Monitoring Setup
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Google Analytics, Vercel Analytics, etc.)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alert notifications set up

### Documentation
- [ ] Deployment documentation updated
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] User guide created/updated
- [ ] Admin guide created/updated
- [ ] Troubleshooting guide updated

### Team Communication
- [ ] Team notified of deployment
- [ ] Deployment notes shared
- [ ] Known issues documented
- [ ] Support team briefed
- [ ] Rollback plan documented

## Maintenance

### Regular Tasks
- [ ] Monitor error logs daily
- [ ] Review performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Backup verification monthly

### Emergency Procedures
- [ ] Rollback procedure documented
- [ ] Emergency contacts listed
- [ ] Incident response plan ready
- [ ] Backup restoration tested

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| Tech Lead | | | |
| QA | | | |
| Product Owner | | | |

## Notes

Add any additional notes or observations:

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: _______________
**Environment**: Production

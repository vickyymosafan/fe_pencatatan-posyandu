# Deployment Guide - Posyandu Lansia Frontend

This guide provides step-by-step instructions for deploying the Posyandu Lansia frontend application to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Production Build](#local-production-build)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [Docker](#docker)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Backend API deployed and accessible**
   - Backend URL (e.g., `https://api.posyandu-lansia.com`)
   - CORS configured to allow your frontend domain

2. **Node.js and npm installed** (for local testing)
   - Node.js 18.x or higher
   - npm 9.x or higher

3. **Git repository** (for platform deployments)
   - Code pushed to GitHub, GitLab, or Bitbucket

4. **Environment variables ready**
   - Backend API URL
   - Any additional configuration values

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://api.posyandu-lansia.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | Application name | `Sistem Rekam Medis Digital Posyandu Lansia` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |
| `NEXT_PUBLIC_DEBUG` | Enable debug mode | `false` |
| `NEXT_PUBLIC_SESSION_TIMEOUT` | Session timeout (ms) | `86400000` (24 hours) |

### Setting Environment Variables

#### Development
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values
# Windows: notepad .env.local
# Mac/Linux: nano .env.local
```

#### Production
Set environment variables in your hosting platform's dashboard (see platform-specific instructions below).

## Local Production Build

Test your production build locally before deploying:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Type Check
```bash
npm run type-check
```

### 3. Run Linter
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm run start
```

### 6. Test the Application
Open `http://localhost:3000` in your browser and test all features.

### Full Production Build Command
```bash
npm run build:production
```
This command runs type-check, lint, and build in sequence.

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications with zero-configuration deployment.

#### Prerequisites
- Vercel account (free tier available)
- Git repository connected to Vercel

#### Deployment Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: `fe` (if monorepo)
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL
   - Click "Deploy"

3. **Deploy via CLI**
   ```bash
   cd fe
   vercel
   ```
   Follow the prompts to configure and deploy.

4. **Configure Custom Domain** (optional)
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

#### Environment Variables in Vercel

1. Go to Project Settings > Environment Variables
2. Add each variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend.vercel.app`
   - Environment: Production, Preview, Development
3. Redeploy to apply changes

#### Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### Netlify

Netlify is another excellent platform for Next.js applications.

#### Deployment Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider and repository

2. **Configure Build Settings**
   - Base directory: `fe` (if monorepo)
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   - Go to Site settings > Build & deploy > Environment
   - Add variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

#### Netlify Configuration File

Create `fe/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### Docker

Deploy using Docker for more control over the environment.

#### Dockerfile

Create `fe/Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create `fe/docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://your-backend.com
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker build -t posyandu-lansia-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend.com \
  posyandu-lansia-frontend

# Or use docker-compose
docker-compose up -d
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Application loads successfully
- [ ] Login functionality works
- [ ] API calls to backend succeed
- [ ] All pages are accessible
- [ ] QR code scanning works (if using HTTPS)
- [ ] Images load correctly
- [ ] No console errors

### 2. Configure Backend CORS

Ensure your backend allows requests from your frontend domain:

```javascript
// Backend CORS configuration example
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

### 3. Setup Custom Domain (Optional)

#### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records:
   - Type: `A` or `CNAME`
   - Name: `@` or `www`
   - Value: Provided by Vercel

#### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records as instructed

### 4. Enable HTTPS

Both Vercel and Netlify automatically provide SSL certificates via Let's Encrypt.

For custom domains:
- Vercel: Automatic SSL
- Netlify: Automatic SSL
- Docker: Use reverse proxy (Nginx, Caddy) with Let's Encrypt

### 5. Setup Monitoring

#### Vercel Analytics
- Enable in Project Settings > Analytics
- Free tier includes basic metrics

#### Google Analytics (Optional)
Add to `app/layout.tsx`:

```typescript
import Script from 'next/script';

// Add in <head>
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 6. Performance Optimization

- [ ] Enable caching headers
- [ ] Optimize images
- [ ] Enable compression
- [ ] Use CDN for static assets
- [ ] Monitor Core Web Vitals

## Troubleshooting

### Build Fails

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Run type check locally
npm run type-check

# Fix errors and commit
git add .
git commit -m "fix: resolve TypeScript errors"
git push
```

**Problem**: Build fails with ESLint errors

**Solution**:
```bash
# Run linter locally
npm run lint

# Auto-fix issues
npm run lint:fix

# Commit fixes
git add .
git commit -m "fix: resolve linting errors"
git push
```

### API Connection Issues

**Problem**: Frontend cannot connect to backend

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend CORS configuration
3. Ensure backend is accessible from frontend domain
4. Check browser console for CORS errors

### Environment Variables Not Working

**Problem**: Environment variables are undefined

**Solution**:
1. Ensure variables are prefixed with `NEXT_PUBLIC_`
2. Redeploy after adding variables
3. Clear build cache and rebuild
4. Check variable names for typos

### Images Not Loading

**Problem**: QR code images or other images fail to load

**Solution**:
1. Check `next.config.ts` image domains configuration
2. Add backend domain to `remotePatterns`
3. Verify image URLs are correct
4. Check CORS headers on image requests

### QR Scanner Not Working

**Problem**: Camera access denied or scanner fails

**Solution**:
1. Ensure site is served over HTTPS (required for camera access)
2. Check browser permissions for camera
3. Test on different browsers
4. Verify `html5-qrcode` library is loaded

### Slow Performance

**Problem**: Application loads slowly

**Solution**:
1. Run Lighthouse audit
2. Optimize images (use WebP format)
3. Enable code splitting
4. Use dynamic imports for heavy components
5. Enable caching headers
6. Use CDN for static assets

### Session Expires Too Quickly

**Problem**: Users are logged out frequently

**Solution**:
1. Increase `NEXT_PUBLIC_SESSION_TIMEOUT` value
2. Implement token refresh mechanism
3. Check backend JWT expiration settings

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring

- Monitor error logs in hosting platform
- Track performance metrics
- Review user feedback
- Monitor API response times

### Backup

- Keep Git repository up to date
- Document configuration changes
- Maintain environment variable documentation

## Support

For issues or questions:
- Check [Next.js Documentation](https://nextjs.org/docs)
- Review [Vercel Documentation](https://vercel.com/docs)
- Contact your development team

## Checklist

Before going live:

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Production build succeeds
- [ ] Environment variables configured
- [ ] Backend CORS configured
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

**Last Updated**: 2024
**Version**: 1.0.0

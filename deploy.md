# 🚀 DeFi Yield Calculator - Deployment Guide

## 🎯 Deployment Options

### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Or connect to GitHub for automatic deployments
vercel --github
```

**Benefits:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Free tier available

### **Option 2: Netlify**
```bash
# Build the project
npm run build

# Deploy to Netlify
# Drag and drop the .next folder to Netlify dashboard
# Or use Netlify CLI
netlify deploy --prod --dir=.next
```

**Benefits:**
- Easy deployment
- Form handling
- Serverless functions
- Free tier available

### **Option 3: AWS Amplify**
```bash
# Connect your GitHub repository
# Amplify will automatically build and deploy
# No additional commands needed
```

**Benefits:**
- AWS integration
- CI/CD pipeline
- Scalable infrastructure
- Enterprise features

### **Option 4: Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Deploy with Docker:**
```bash
# Build the image
docker build -t defi-calculator .

# Run the container
docker run -p 3000:3000 defi-calculator

# Or use Docker Compose
docker-compose up -d
```

## 🔧 Environment Configuration

### **Production Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_APP_NAME="DeFi Yield Calculator"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_ENVIRONMENT="production"
```

### **Build Optimization**
```bash
# Optimize build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Export static files (if needed)
npm run export
```

## 📱 Performance Optimization

### **Lighthouse Score Optimization**
- Optimize images
- Minimize CSS/JS
- Enable compression
- Use CDN for static assets

### **Core Web Vitals**
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

## 🚀 Quick Start Commands

### **Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
```

### **Production**
```bash
# Build and start
npm run build && npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "defi-calculator" -- start
pm2 save
pm2 startup
```

## 🌐 Domain & SSL

### **Custom Domain Setup**
1. Add custom domain in hosting platform
2. Update DNS records
3. Enable SSL certificate
4. Configure redirects if needed

### **SSL Configuration**
- Automatic SSL with Let's Encrypt
- Force HTTPS redirects
- HSTS headers for security

## 📊 Monitoring & Analytics

### **Performance Monitoring**
- Vercel Analytics
- Google Analytics
- Hotjar for user behavior
- Sentry for error tracking

### **Health Checks**
```bash
# Health check endpoint
curl https://your-domain.com/api/health

# Performance metrics
curl https://your-domain.com/api/metrics
```

## 🔒 Security Considerations

### **Security Headers**
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

### **Content Security Policy**
```javascript
// Add CSP headers for security
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
}
```

## 💰 Cost Optimization

### **Free Tier Options**
- **Vercel**: 100GB bandwidth/month
- **Netlify**: 100GB bandwidth/month
- **GitHub Pages**: Free hosting
- **Cloudflare Pages**: Free tier available

### **Paid Options**
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **AWS Amplify**: Pay per use

## 🎯 Recommended Deployment Strategy

### **For Portfolio/Demo**
1. Use Vercel (free tier)
2. Connect to GitHub repository
3. Automatic deployments on push
4. Custom domain (optional)

### **For Production/Client**
1. Use Vercel Pro or Netlify Pro
2. Custom domain with SSL
3. Performance monitoring
4. Backup deployment strategy

### **For Enterprise**
1. AWS Amplify or Azure Static Web Apps
2. Custom CI/CD pipeline
3. Multi-region deployment
4. Advanced monitoring and analytics

---

**Your DeFi calculator is now ready for deployment! Choose the option that best fits your needs and budget.**

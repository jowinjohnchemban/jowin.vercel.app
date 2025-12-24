# Jowin John Chemban -  Website

A modern, high-performance website and blog built with Next.js 16, React 19, and Tailwind CSS 4. Features animated UI, Hashnode blog integration, and a secure contact system.

## 🎨 Key Features
- Lazy-loaded GSAP for fast paint
- Optimized images (WebP, fetchPriority)
- Blog: Hashnode integration, tag filtering, SEO, responsive grid
- Contact: Secure form with geolocation, HTML email
- Centralized config for site, SEO, security, email
- All SEO metadata defined locally per page (recommended)
- Security headers, input validation, and sanitization
- **PWA Support**: Installable app with offline functionality, service worker, and install prompt
- Production-ready: console logs removed, React Compiler enabled

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation
```bash
# Clone repository
https://github.com/jowinjohnchemban/jowin.vercel.app.git
cd jowin.vercel.app
npm install
cp .env.example .env.local
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## 🔒 Security
- Zod validation, DOMPurify sanitization
- Security headers, HTTPS-only links

## 📱 Progressive Web App (PWA)
The website is fully PWA-enabled with the following features:
- **Installable**: Users can install the app on their devices
- **Offline Support**: Service worker caches essential resources for offline browsing
- **Install Prompt**: Smart popup that appears when the app can be installed
- **App Shortcuts**: Quick access to Blog and Contact pages from the app icon
- **Offline Page**: Dedicated offline page when users lose internet connection

### PWA Installation
Users will see an install prompt automatically after visiting the site. The prompt can be:
- Dismissed (won't show again)
- Accepted to install the app
- The app works offline once installed

## 👤 Author
Jowin John Chemban
[jowinjc.in](https://jowinjc.in)

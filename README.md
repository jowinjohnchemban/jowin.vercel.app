# Jowin John Chemban -  Website

A modern, high-performance website and blog built with Next.js 16, React 19, and Tailwind CSS 4. Features animated UI, Hashnode blog integration, and a secure contact system.

## 🎨 Key Features
- Lazy-loaded GSAP for fast paint
- Optimized images (WebP, fetchPriority)
- Blog: Hashnode integration, tag filtering, SEO, responsive grid
- Contact: Secure form, Turnstile captcha, geolocation, HTML email
- Centralized config for site, SEO, security, email
- All SEO metadata defined locally per page (recommended)
- Security headers, input validation, and sanitization
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
- Cloudflare Turnstile captcha
- Zod validation, DOMPurify sanitization
- Security headers, HTTPS-only links

## 👤 Author
Jowin John Chemban
[jowinjc.in](https://jowinjc.in)

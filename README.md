# Jowin John Chemban - Portfolio & Blog

A modern, high-performance portfolio and blog built with Next.js 16, React 19, and Tailwind CSS 4. Features animated UI, Hashnode blog integration, and a secure contact system.

## ✨ Key Features

### Performance & Optimization
- **Fast Loading**: Lazy-loaded GSAP animations for optimal First Paint
- **Image Optimization**: WebP format with `fetchPriority` hints
- **Smart Caching**: Immutable cache for static assets, optimized image caching
- **Standalone Build**: Docker-ready with minimal dependencies

### Blog Integration
- **Hashnode Integration**: Fetch posts dynamically via GraphQL API
- **Tag Filtering**: Browse posts by topic tags
- **SEO Optimized**: Per-page metadata, structured data, and sitemap
- **Responsive Grid**: Beautiful card-based layout

### Contact System
- **Secure Forms**: Zod validation + DOMPurify sanitization
- **IP Geolocation**: Optional location tracking for form submissions
- **HTML Emails**: Beautiful email templates with Resend/Nodemailer
- **Rate Limiting**: Protection against spam

### Architecture
- **Centralized Config**: Site, SEO, security, and email settings in one place
- **Type-Safe**: Full TypeScript with strict mode
- **Modular Design**: Clean separation of concerns with barrel exports
- **Security Headers**: CSP, X-Frame-Options, Permissions-Policy, and more

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation
```bash
# Clone repository
git clone https://github.com/jowinjohnchemban/jowinjc.in.git
cd jowinjc.in

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint       # Check for issues
npm run lint:fix   # Auto-fix issues
```

## 🔧 Configuration

### Environment Variables
Key variables to configure in `.env.local`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Your Name"
NEXT_PUBLIC_SITE_URL="https://yoursite.com"

# Hashnode Blog
HASHNODE_PUBLICATION_HOST="yourblog.hashnode.dev"

# Email (Resend recommended)
EMAIL_PROVIDER="resend"
CONTACT_EMAIL="contact@yoursite.com"
RESEND_API_KEY="re_xxxxx"

# Analytics (optional)
NEXT_PUBLIC_GTM_ID="GTM-XXXXX"
NEXT_PUBLIC_AHREFS_KEY="your-key"
```

See [.env.example](.env.example) for full configuration options.

## 🔒 Security Features
- **Input Validation**: Zod schemas for all user inputs
- **Sanitization**: DOMPurify for HTML content
- **Security Headers**: X-Frame-Options, CSP, Permissions-Policy
- **HTTPS-only**: External links forced to HTTPS
- **No X-Powered-By**: Header removed for security

## 🏗️ Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4
- **Animations**: GSAP with ScrollTrigger
- **Forms**: Zod validation, DOMPurify sanitization
- **Email**: Resend or Nodemailer
- **Blog**: Hashnode GraphQL API
- **Analytics**: Google Tag Manager, Ahrefs
- **Deployment**: Vercel (optimized for standalone builds)

## 📁 Project Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── blog/        # Blog-specific components
│   ├── home/        # Homepage sections
│   └── ui/          # Reusable UI components
├── config/          # Centralized configuration
├── lib/             # Utilities and services
│   ├── api/         # API clients (Hashnode)
│   ├── email/       # Email providers
│   ├── security/    # Security utilities
│   └── validation/  # Zod schemas
└── styles/          # Global styles
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio
```

## 👤 Author
**Jowin John Chemban**
- Website: [jowinjc.in](https://jowinjc.in)
- GitHub: [@jowinjohnchemban](https://github.com/jowinjohnchemban)

## 📄 License
This project is open source and available under the MIT License.

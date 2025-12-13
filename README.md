# Jowin John Chemban - Portfolio Website

A modern, high-performance portfolio website built with Next.js 16, featuring blog integration, animated UI, and a comprehensive contact system.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.10 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Animation**: GSAP 3.13 with ScrollTrigger (lazy loaded)
- **Blog**: Hashnode GraphQL API integration
- **Email**: Resend/Nodemailer with IP geolocation (IPInfo)
- **Security**: Cloudflare Turnstile, DOMPurify sanitization
- **Analytics**: Vercel Analytics + Speed Insights
- **Type Safety**: TypeScript (strict mode)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage with hero, blog, contact
│   ├── blog/              # Blog routes (list + [slug])
│   ├── connect/           # Contact page with social links
│   └── api/contact/       # Contact form API endpoint
├── components/
│   ├── home/              # Homepage sections (Hero, Blog, Contact)
│   ├── blog/              # Blog components (Card, Content, Tags)
│   ├── ui/                # shadcn/ui components
│   ├── Navbar.tsx         # Responsive navigation
│   └── ContactForm.tsx    # Form with Turnstile captcha
├── lib/
│   ├── api/hashnode/      # Hashnode client (reusable NPM package)
│   ├── email/             # Email service with provider pattern
│   ├── services/          # IP geolocation, utilities
│   └── validation/        # Zod schemas
└── styles/                # Global CSS, markdown styles
```

## 🎨 Key Features

### Performance Optimizations
- Lazy-loaded GSAP (~80KB saved on initial load)
- Optimized image sizes with `fetchPriority="high"` for LCP
- Fast animations (0.3-0.4s duration, 20px movement, 0.3→1 opacity)
- ISR caching for blog posts (1 hour revalidation)
- WebP image format
- React Compiler enabled

### Animation System
- **Hero**: 0.3s fade-in on load
- **Blog Section**: 0.4s scroll-triggered with stagger (0.08s)
- **Contact**: 0.4s scroll-triggered
- All animations use consistent `power2.out` easing

### Email System
- HTML template with legacy table layout (Outlook compatible)
- Metadata: IP, location (Google Maps link), timezone, ISP, user agent
- Black header/footer with jowinjc.in branding
- IPInfo API integration for rich geolocation data

### Blog Integration
- Fetches from Hashnode GraphQL API
- Tag filtering at `/blog/tag/[slug]`
- Responsive card grid (1/2/3 columns)
- Reading time, cover images, author info
- SEO-optimized with dynamic metadata

## 🛠️ Getting Started

### Prerequisites
```bash
Node.js 18+ 
npm/yarn/pnpm
```

### Installation
```bash
# Clone repository
git clone https://github.com/jowinjohnchemban/jowin.vercel.app.git
cd jowin.vercel.app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
```env
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Jowin John Chemban"
NEXT_PUBLIC_SITE_URL="https://jowinjc.in"

# Hashnode Blog
NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST="hashnode.jowinjc.in"

# Contact Form
CONTACT_EMAIL="your@email.com"
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4xxx"
TURNSTILE_SECRET_KEY="0x4xxx"
IPINFO_TOKEN="xxx"

# Social Media (optional)
NEXT_PUBLIC_GITHUB_URL="https://github.com/username"
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/in/username"
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
npm run lint
npm run lint:fix
```

## 📊 Performance Targets

- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s  
- **TBT (Total Blocking Time)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Speed Index**: < 3.0s

## 🔒 Security Features

- Cloudflare Turnstile captcha verification
- Server-side validation with Zod
- Input sanitization (DOMPurify)
- Security headers (X-Frame-Options, CSP-ready)
- HTTPS-only email links
- IP-based rate limiting (via Turnstile)

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

**Jowin John Chemban**
- Website: [jowinjc.in](https://jowinjc.in)
- GitHub: [@jowinjohnchemban](https://github.com/jowinjohnchemban)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Hashnode](https://hashnode.com) - Blog platform
- [Vercel](https://vercel.com) - Deployment
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [GSAP](https://gsap.com) - Animation library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

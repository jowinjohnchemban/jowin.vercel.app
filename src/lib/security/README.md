# Security Module

Comprehensive, standalone security module for Next.js applications with runtime threat detection, monitoring, and automated email alerts.

## Features

### 🛡️ Threat Detection
- **XSS (Cross-Site Scripting)** - Detects script injections, event handlers, and dangerous HTML
- **SQL Injection** - Identifies SQL manipulation attempts
- **Path Traversal** - Blocks directory traversal attacks
- **Command Injection** - Prevents OS command execution
- **LDAP Injection** - Detects LDAP filter manipulation
- **NoSQL Injection** - Identifies NoSQL query injection
- **Prototype Pollution** - Blocks JavaScript prototype attacks
- **Header Injection** - Prevents HTTP header manipulation

### 🔐 Authentication Security
- **Brute Force Protection** - Detects and blocks repeated failed login attempts
- **Account Enumeration Prevention** - Monitors suspicious authentication patterns
- **Automatic Lockout** - Temporarily locks accounts after excessive failures
- **Session Monitoring** - Tracks authentication events

### 🚨 Rate Limiting
- **IP-based Rate Limiting** - Prevents API abuse
- **Configurable Thresholds** - Customizable limits per endpoint
- **Automatic Blocking** - Blocks malicious IPs temporarily
- **In-memory Store** - Fast, lightweight tracking (Redis-ready)

### 🔍 Secret Leak Detection
- **Runtime Monitoring** - Detects if server secrets leak to client
- **Environment Validation** - Checks for suspicious public variables
- **Automatic Alerts** - Sends email notifications on detection

### 📧 Email Alerts
- **Comprehensive Reports** - Detailed threat information
- **Beautiful HTML Templates** - Professional alert emails
- **Action Recommendations** - Step-by-step remediation guides
- **Multiple Threat Types** - Single email for all detected threats

### 📊 Event Logging
- **Centralized Logging** - All security events in one place
- **Event Aggregation** - Summary reports and statistics
- **Identifier Tracking** - Monitor specific IPs or users
- **Threshold Alerts** - Trigger alerts based on event frequency

## Installation

This module is self-contained within your project at `src/lib/security/`.

### Dependencies
```json
{
  "dompurify": "^3.3.1",
  "zod": "^3.25.76"
}
```

## Usage

### Basic Threat Detection

```typescript
import { isInputSafe, detectAllThreats } from '@/lib/security';

// Quick check
const { safe, threats } = isInputSafe(userInput);
if (!safe) {
  console.error('Threats detected:', threats);
  return { error: 'Invalid input' };
}

// Detailed detection
const threats = detectAllThreats(userInput);
for (const threat of threats) {
  console.log(`${threat.threatType}: ${threat.description}`);
}
```

### Rate Limiting

```typescript
import { checkRateLimit } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  const rateLimit = checkRateLimit(ip, {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Process request
}
```

### Authentication Monitoring

```typescript
import { recordAuthEvent, isLockedOut } from '@/lib/security';

// Check if user is locked out
if (isLockedOut(username)) {
  return { error: 'Account temporarily locked' };
}

// Record auth attempt
const threat = recordAuthEvent({
  identifier: username,
  eventType: 'login-failure',
  timestamp: new Date(),
});

if (threat) {
  // Send alert email
  console.error('Brute force detected:', threat);
}
```

### Security Event Logging

```typescript
import { logSecurityEvent, getSecuritySummary } from '@/lib/security';

// Log a security event
logSecurityEvent(
  'threat-detected',
  'high',
  ipAddress,
  'XSS attempt blocked',
  { userAgent, url },
  threat
);

// Get summary
const summary = getSecuritySummary();
console.log(`Total events: ${summary.totalEvents}`);
console.log(`Critical: ${summary.eventsBySeverity.critical}`);
```

### Secret Leak Detection

```typescript
import { runSecurityCheck } from '@/lib/security';

const securityCheck = runSecurityCheck();

if (!securityCheck.safe) {
  console.error('Security issues detected!');
  console.error('Leaked secrets:', securityCheck.leaks.leakedSecrets);
  console.error('Warnings:', securityCheck.publicVarCheck.warnings);
}
```

### Client-Side Monitoring

Add to your `app/layout.tsx`:

```typescript
import { SecurityMonitor } from '@/lib/security';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SecurityMonitor />
        {children}
      </body>
    </html>
  );
}
```

### API Endpoint Security

```typescript
import { isInputSafe, checkRateLimit, logSecurityEvent } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limit
  const rateLimit = checkRateLimit(ip, { maxRequests: 10, windowMs: 60000 });
  if (!rateLimit.allowed) {
    logSecurityEvent('rate-limit-exceeded', 'medium', ip, 'Too many requests');
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Validate input
  const body = await request.json();
  const { safe, threats } = isInputSafe(body.message);
  
  if (!safe) {
    logSecurityEvent('threat-detected', 'high', ip, 'Malicious input', {}, threats[0]);
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Process request
}
```

## API Routes

### Security API Endpoint

**GET** `/api/security`

Query parameters:
- `secret` - Authentication token (optional)
- `alert` - Set to `true` to send email alerts

```bash
# Check security status
curl "https://yoursite.com/api/security?secret=YOUR_SECRET"

# Check and send alerts
curl "https://yoursite.com/api/security?secret=YOUR_SECRET&alert=true"
```

Response:
```json
{
  "status": "secure" | "vulnerable",
  "timestamp": "2026-01-10T12:00:00.000Z",
  "details": {
    "leaks": { ... },
    "publicVarCheck": { ... }
  },
  "alertSent": true
}
```

## Configuration

### Rate Limiting

```typescript
const config = {
  maxRequests: 10,      // Max requests allowed
  windowMs: 60 * 1000,  // Time window (1 minute)
};
```

### Authentication Monitoring

```typescript
// In auth-monitor.ts
const MAX_FAILED_ATTEMPTS = 5;           // Lock after 5 failures
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15-minute window
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30-minute lockout
```

### Event Logging

```typescript
// In event-logger.ts
const MAX_EVENTS_IN_MEMORY = 1000; // Keep last 1000 events
```

## Email Alerts

Email alerts are automatically sent when:
- Secret leaks are detected
- Multiple threats are found
- Authentication threshold is exceeded
- Critical security events occur

Configure email in your `.env`:
```env
CONTACT_EMAIL="security@yoursite.com"
RESEND_FROM_EMAIL="alerts@yoursite.com"
RESEND_API_KEY="re_xxxxx"
```

## Monitoring Dashboard

Get real-time security stats:

```typescript
import { getSecuritySummary, getAuthStats, getRateLimitStats } from '@/lib/security';

const securityStats = {
  events: getSecuritySummary(),
  auth: getAuthStats(),
  rateLimit: getRateLimitStats(),
};
```

## Production Recommendations

### 1. Use Redis for Rate Limiting
Replace in-memory store with Redis:
```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### 2. External Logging Service
Send events to external service:
```typescript
// In event-logger.ts
await sendToLoggingService(event);
```

### 3. Database Storage
Store security events in database:
```typescript
// In event-logger.ts
await db.securityEvents.create(event);
```

### 4. Cron Jobs
Set up periodic security checks:
```bash
# Vercel cron.json
{
  "crons": [{
    "path": "/api/security?alert=true&secret=YOUR_SECRET",
    "schedule": "0 */6 * * *"
  }]
}
```

### 5. WAF Integration
Integrate with Cloudflare or AWS WAF for additional protection.

## Threat Patterns

The module detects these patterns:

- **XSS**: `<script>`, `javascript:`, `onerror=`, `<iframe>`
- **SQL**: `UNION SELECT`, `DROP TABLE`, `' OR '1'='1`
- **Path Traversal**: `../`, `..%2f`, `..;`
- **Command**: `; cat`, `| ls`, `` `whoami` ``
- **NoSQL**: `$where`, `$ne`, `$gt`
- **Prototype**: `__proto__`, `constructor.prototype`

## Architecture

```
security/
├── sanitizer.ts     # Input sanitization
├── secrets.ts       # Secret leak detection
├── detector.ts      # Attack pattern detection
├── limiter.ts       # Rate limiting
├── auth.ts          # Authentication monitoring
├── events.ts        # Security event logging
├── alerts.ts        # Email alert system
├── init.ts          # Client-side initialization
├── index.ts         # Module exports
└── README.md        # Documentation

email/templates/
├── contact/
│   └── index.ts     # Contact form template
└── security/
    └── index.ts     # Security alert template
```

## License

Part of your Next.js application. Reusable and portable.

## Support

For issues or questions, check your application logs or contact your security team.

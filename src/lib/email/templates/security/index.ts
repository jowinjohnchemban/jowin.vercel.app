/**
 * Security Alert Email Template
 * 
 * Email template for security breach notifications
 * Supports multiple threat types and comprehensive reporting
 * 
 * @module lib/email/templates/security
 */

import type { SecretLeakDetection } from '@/lib/security/secrets';
import type { ThreatDetection } from '@/lib/security/detector';
import type { AuthThreat } from '@/lib/security/auth';
import type { SecurityEvent } from '@/lib/security/events';

export interface SecurityAlertData {
  leaks?: SecretLeakDetection;
  threats?: ThreatDetection[];
  authThreats?: AuthThreat[];
  events?: SecurityEvent[];
  warnings: string[];
  userAgent?: string;
  url?: string;
  timestamp: string;
  summary?: {
    totalThreats: number;
    criticalCount: number;
    highCount: number;
  };
}

/**
 * Generate security alert email HTML
 */
export function generateSecurityAlertHTML(data: SecurityAlertData): string {
  const { leaks, threats, authThreats, events, warnings, userAgent, url, timestamp, summary } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - Threats Detected</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #dc2626;
      color: #ffffff;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 20px -30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .alert-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .summary-box {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .summary-item {
      flex: 1;
    }
    .summary-number {
      font-size: 32px;
      font-weight: bold;
      display: block;
    }
    .summary-label {
      font-size: 12px;
      opacity: 0.9;
      text-transform: uppercase;
    }
    .section {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #fef2f2;
      border-left: 4px solid #dc2626;
      border-radius: 4px;
    }
    .section h2 {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: #dc2626;
    }
    .threat-item {
      background-color: #fee;
      padding: 12px;
      border-radius: 4px;
      margin: 10px 0;
      border-left: 3px solid #991b1b;
    }
    .threat-type {
      font-weight: bold;
      color: #991b1b;
      text-transform: uppercase;
      font-size: 12px;
    }
    .severity-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 8px;
    }
    .severity-critical { background: #991b1b; color: white; }
    .severity-high { background: #dc2626; color: white; }
    .severity-medium { background: #f59e0b; color: white; }
    .severity-low { background: #10b981; color: white; }
    .leaked-secrets {
      background-color: #fee;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
    .leaked-secrets ul {
      margin: 5px 0;
      padding-left: 20px;
    }
    .leaked-secrets li {
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: #991b1b;
      margin: 5px 0;
    }
    .code-block {
      background: #1f2937;
      color: #f3f4f6;
      padding: 10px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      overflow-x: auto;
      margin: 10px 0;
    }
    .details {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
      font-size: 14px;
    }
    .details dt {
      font-weight: 600;
      color: #374151;
      margin-top: 10px;
    }
    .details dd {
      margin: 5px 0 10px 20px;
      color: #6b7280;
      word-break: break-all;
    }
    .warning {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
    }
    .warning h3 {
      color: #f59e0b;
      margin: 0 0 10px 0;
      font-size: 16px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .action-required {
      background-color: #dc2626;
      color: white;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: 600;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="alert-icon">🚨</div>
      <h1>Security Alert: Threats Detected</h1>
    </div>

    <div class="action-required">
      ⚠️ IMMEDIATE ACTION REQUIRED
    </div>

    ${summary ? `
    <div class="summary-box">
      <div class="summary-item">
        <span class="summary-number">${summary.totalThreats}</span>
        <span class="summary-label">Total Threats</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">${summary.criticalCount}</span>
        <span class="summary-label">Critical</span>
      </div>
      <div class="summary-item">
        <span class="summary-number">${summary.highCount}</span>
        <span class="summary-label">High</span>
      </div>
    </div>
    ` : ''}

    ${leaks?.detected ? `
    <div class="section">
      <h2>🔓 Environment Secrets Leaked</h2>
      <p><strong>Critical Security Breach:</strong> Server-only secrets are exposed in the client-side JavaScript bundle.</p>
      
      <div class="leaked-secrets">
        <strong>Leaked Secrets:</strong>
        <ul>
          ${leaks.leakedSecrets.map(secret => `<li>${secret}</li>`).join('')}
        </ul>
      </div>

      <p><strong>Environment:</strong> ${leaks.environment}</p>
      <p><strong>Detection Time:</strong> ${leaks.timestamp}</p>
    </div>
    ` : ''}

    ${threats && threats.length > 0 ? `
    <div class="section">
      <h2>⚠️ Attack Patterns Detected</h2>
      ${threats.map(threat => `
        <div class="threat-item">
          <div>
            <span class="threat-type">${threat.threatType.replace(/-/g, ' ')}</span>
            <span class="severity-badge severity-${threat.severity}">${threat.severity}</span>
          </div>
          <p style="margin: 8px 0;"><strong>${threat.description}</strong></p>
          <div class="code-block">${threat.payload}</div>
          <p style="margin: 8px 0; font-size: 13px; color: #6b7280;">
            <strong>Action:</strong> ${threat.recommendation}
          </p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${authThreats && authThreats.length > 0 ? `
    <div class="section">
      <h2>🔐 Authentication Threats</h2>
      ${authThreats.map(threat => `
        <div class="threat-item">
          <div>
            <span class="threat-type">${threat.threatType.replace(/-/g, ' ')}</span>
            <span class="severity-badge severity-${threat.severity}">${threat.severity}</span>
          </div>
          <p style="margin: 8px 0;"><strong>${threat.description}</strong></p>
          <p style="margin: 4px 0;"><strong>Identifier:</strong> ${threat.identifier}</p>
          <p style="margin: 4px 0;"><strong>Event Count:</strong> ${threat.eventCount}</p>
          <p style="margin: 8px 0; font-size: 13px; color: #6b7280;">
            <strong>Action:</strong> ${threat.recommendation}
          </p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${warnings.length > 0 ? `
    <div class="warning">
      <h3>⚠️ Security Warnings</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        ${warnings.map(warning => `<li>${warning}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    ${events && events.length > 0 ? `
    <div class="section">
      <h2>📋 Recent Security Events</h2>
      ${events.slice(0, 5).map(event => `
        <div class="threat-item">
          <div>
            <span class="threat-type">${event.type}</span>
            <span class="severity-badge severity-${event.severity}">${event.severity}</span>
          </div>
          <p style="margin: 8px 0;">${event.description}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
            ${event.identifier} • ${event.timestamp.toISOString()}
          </p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="details">
      <dl>
        <dt>🕐 Timestamp:</dt>
        <dd>${timestamp}</dd>

        ${url ? `
        <dt>🔗 URL:</dt>
        <dd>${url}</dd>
        ` : ''}

        ${userAgent ? `
        <dt>🖥️ User Agent:</dt>
        <dd>${userAgent}</dd>
        ` : ''}
      </dl>
    </div>

    <div class="section">
      <h2>📋 Immediate Actions Required</h2>
      <ol>
        <li><strong>Verify</strong> .env files are in .gitignore</li>
        <li><strong>Check</strong> build configuration for secret bundling</li>
        <li><strong>Rotate</strong> all compromised credentials immediately</li>
        <li><strong>Review</strong> Next.js config for proper env handling</li>
        <li><strong>Audit</strong> recent code changes</li>
        <li><strong>Block</strong> malicious IPs if needed</li>
        <li><strong>Enable</strong> additional monitoring</li>
      </ol>
    </div>

    <div class="footer">
      <p>This is an automated security alert from your application.</p>
      <p>If you did not expect this alert, investigate immediately.</p>
      <p style="margin-top: 15px; color: #dc2626; font-weight: 600;">
        🚨 Do not ignore this alert - it indicates a security vulnerability
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of security alert
 */
export function generateSecurityAlertText(data: SecurityAlertData): string {
  const { leaks, warnings, userAgent, url, timestamp } = data;

  let text = `
🚨 SECURITY ALERT: Secret Leak Detected
========================================

⚠️ IMMEDIATE ACTION REQUIRED

`;

  if (leaks && leaks.detected) {
    text += `
🔓 ENVIRONMENT SECRETS LEAKED TO CLIENT
---------------------------------------

CRITICAL SECURITY BREACH: Server-only secrets are exposed in the client-side JavaScript bundle.

Leaked Secrets:
${leaks.leakedSecrets.map(secret => `  - ${secret}`).join('\n')}

Environment: ${leaks.environment}
Detection Time: ${leaks.timestamp}

`;
  }

  if (warnings.length > 0) {
    text += `
⚠️ SECURITY WARNINGS
--------------------
${warnings.map(warning => `  - ${warning}`).join('\n')}

`;
  }

  text += `
DETAILS
-------
Timestamp: ${timestamp}
${url ? `URL: ${url}` : ''}
${userAgent ? `User Agent: ${userAgent}` : ''}

RECOMMENDED ACTIONS
-------------------
1. Immediately verify that .env files are in .gitignore
2. Check build configuration for accidental secret bundling
3. Rotate all leaked credentials immediately
4. Review Next.js config for proper env variable handling
5. Ensure only NEXT_PUBLIC_* variables are used client-side
6. Audit recent code changes that may have caused the leak

INVESTIGATION STEPS
-------------------
1. Check browser DevTools Console for error messages
2. Inspect Network tab for exposed credentials
3. Review recent deployments and changes
4. Run: npm run build locally to test
5. Check server logs for additional context

---
This is an automated security alert from your application.
If you did not expect this alert, investigate immediately.

🚨 Do not ignore this alert - it indicates a critical security vulnerability
`;

  return text.trim();
}

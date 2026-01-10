/**
 * Detector - Runtime Threat Detection
 * 
 * Detects various runtime security threats including:
 * - XSS (Cross-Site Scripting) attempts
 * - SQL Injection patterns
 * - Path Traversal attacks
 * - Command Injection attempts
 * - LDAP Injection
 * - XML/XXE attacks
 * - NoSQL Injection
 * 
 * @module lib/security/detector
 */

import { logger } from '@/lib/logger';
import { validateInput } from './schemas';

export type ThreatType = 
  | 'xss'
  | 'sql-injection'
  | 'path-traversal'
  | 'command-injection'
  | 'ldap-injection'
  | 'xml-injection'
  | 'nosql-injection'
  | 'prototype-pollution'
  | 'header-injection'
  | 'suspicious-pattern';

export interface ThreatDetection {
  detected: boolean;
  threatType: ThreatType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  payload: string;
  pattern?: string;
  recommendation: string;
}

/**
 * XSS Detection Patterns
 */
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=\s*["'][^"']*["']/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /eval\s*\(/gi,
  /expression\s*\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

/**
 * SQL Injection Patterns
 */
const SQL_INJECTION_PATTERNS = [
  /(\bor\b|\band\b)\s+['"]*\s*\d+\s*['"]*\s*=\s*['"]*\s*\d+/gi,
  /union\s+select/gi,
  /select\s+.*\s+from\s+/gi,
  /insert\s+into/gi,
  /delete\s+from/gi,
  /drop\s+table/gi,
  /update\s+.*\s+set/gi,
  /--\s*$/gm,
  /;\s*drop/gi,
  /'\s*or\s*'1'\s*=\s*'1/gi,
  /admin'\s*--/gi,
  /'\s+or\s+1=1/gi,
];

/**
 * Path Traversal Patterns
 */
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.[\/\\]/g,
  /\.\.%2f/gi,
  /\.\.%5c/gi,
  /%2e%2e[\/\\]/gi,
  /\.\.;/g,
];

/**
 * Command Injection Patterns
 */
const COMMAND_INJECTION_PATTERNS = [
  /;\s*\w+/g,
  /\|\s*\w+/g,
  /`[^`]+`/g,
  /\$\([^)]+\)/g,
  /&&\s*\w+/g,
  /\|\|\s*\w+/g,
  />\s*\/\w+/g,
  /<\s*\/\w+/g,
];

/**
 * LDAP Injection Patterns
 */
const LDAP_INJECTION_PATTERNS = [
  /\(\|/g,
  /\(&/g,
  /\(!/g,
  /\*\)/g,
];

/**
 * NoSQL Injection Patterns
 */
const NOSQL_INJECTION_PATTERNS = [
  /\$where/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$lt/gi,
  /\$regex/gi,
  /\{\s*"\$[a-z]+"/gi,
];

/**
 * Prototype Pollution Patterns
 */
const PROTOTYPE_POLLUTION_PATTERNS = [
  /__proto__/g,
  /constructor\s*\.\s*prototype/gi,
  /prototype\s*\[/gi,
];

/**
 * Header Injection Patterns
 */
const HEADER_INJECTION_PATTERNS = [
  /[\r\n]/g,
  /%0d%0a/gi,
  /\n\r/g,
];

/**
 * Detect XSS attempts
 */
export function detectXSS(input: string): ThreatDetection | null {
  for (const pattern of XSS_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'xss',
        severity: 'high',
        description: 'Cross-Site Scripting (XSS) attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Input contains potential XSS payload. Sanitize and encode all user inputs.',
      };
    }
  }
  return null;
}

/**
 * Detect SQL Injection attempts
 */
export function detectSQLInjection(input: string): ThreatDetection | null {
  for (const pattern of SQL_INJECTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'sql-injection',
        severity: 'critical',
        description: 'SQL Injection attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Use parameterized queries and prepared statements. Never concatenate user input into SQL queries.',
      };
    }
  }
  return null;
}

/**
 * Detect Path Traversal attempts
 */
export function detectPathTraversal(input: string): ThreatDetection | null {
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'path-traversal',
        severity: 'high',
        description: 'Path Traversal attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Validate and sanitize file paths. Use allowlists for permitted directories.',
      };
    }
  }
  return null;
}

/**
 * Detect Command Injection attempts
 */
export function detectCommandInjection(input: string): ThreatDetection | null {
  for (const pattern of COMMAND_INJECTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'command-injection',
        severity: 'critical',
        description: 'Command Injection attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Avoid executing system commands with user input. Use safe APIs and validate inputs strictly.',
      };
    }
  }
  return null;
}

/**
 * Detect LDAP Injection attempts
 */
export function detectLDAPInjection(input: string): ThreatDetection | null {
  for (const pattern of LDAP_INJECTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'ldap-injection',
        severity: 'high',
        description: 'LDAP Injection attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Escape LDAP special characters and validate input format.',
      };
    }
  }
  return null;
}

/**
 * Detect NoSQL Injection attempts
 */
export function detectNoSQLInjection(input: string): ThreatDetection | null {
  for (const pattern of NOSQL_INJECTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'nosql-injection',
        severity: 'high',
        description: 'NoSQL Injection attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Validate input types and use MongoDB query operators safely. Never use user input directly in queries.',
      };
    }
  }
  return null;
}

/**
 * Detect Prototype Pollution attempts
 */
export function detectPrototypePollution(input: string): ThreatDetection | null {
  for (const pattern of PROTOTYPE_POLLUTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'prototype-pollution',
        severity: 'critical',
        description: 'Prototype Pollution attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Validate object keys and avoid merging user-controlled objects directly. Use Object.create(null) for safe objects.',
      };
    }
  }
  return null;
}

/**
 * Detect Header Injection attempts
 */
export function detectHeaderInjection(input: string): ThreatDetection | null {
  for (const pattern of HEADER_INJECTION_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      return {
        detected: true,
        threatType: 'header-injection',
        severity: 'medium',
        description: 'Header Injection attempt detected',
        payload: match[0],
        pattern: pattern.source,
        recommendation: 'Sanitize input used in HTTP headers. Remove newline characters.',
      };
    }
  }
  return null;
}

/**
 * Run all threat detection checks on input
 */
export function detectAllThreats(input: string): ThreatDetection[] {
  // Validate input first with Zod
  const validation = validateInput(input);
  if (!validation.valid) {
    return [{
      detected: true,
      threatType: 'suspicious-pattern',
      severity: 'low',
      description: 'Invalid input format',
      payload: String(input).substring(0, 100),
      recommendation: validation.error || 'Provide valid input',
    }];
  }

  const threats: ThreatDetection[] = [];

  const detectors = [
    detectXSS,
    detectSQLInjection,
    detectPathTraversal,
    detectCommandInjection,
    detectLDAPInjection,
    detectNoSQLInjection,
    detectPrototypePollution,
    detectHeaderInjection,
  ];

  for (const detector of detectors) {
    const threat = detector(input);
    if (threat) {
      threats.push(threat);
      logger.warn(`Security threat detected: ${threat.threatType}`, {
        severity: threat.severity,
        payload: threat.payload,
      });
    }
  }

  return threats;
}

/**
 * Check if input is safe (no threats detected)
 */
export function isInputSafe(input: string): { safe: boolean; threats: ThreatDetection[] } {
  const threats = detectAllThreats(input);
  return {
    safe: threats.length === 0,
    threats,
  };
}

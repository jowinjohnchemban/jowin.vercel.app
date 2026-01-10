/**
 * Events - Security Event Logger
 * 
 * Centralized logging and monitoring for all security events
 * Aggregates events and triggers alerts when thresholds are exceeded
 * 
 * @module lib/security/events
 */

import { logger } from '@/lib/logger';
import type { ThreatDetection } from './detector';
import type { AuthThreat } from './auth';
import type { SecretLeakDetection } from './secrets';

export type SecurityEventType = 
  | 'threat-detected'
  | 'rate-limit-exceeded'
  | 'auth-failure'
  | 'secret-leak'
  | 'suspicious-activity'
  | 'blocked-request';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  identifier: string; // IP, user ID, or session ID
  description: string;
  metadata: Record<string, unknown>;
  threat?: ThreatDetection | AuthThreat | SecretLeakDetection;
}

export interface SecurityEventSummary {
  totalEvents: number;
  eventsBySeverity: Record<string, number>;
  eventsByType: Record<string, number>;
  topIdentifiers: Array<{ identifier: string; count: number }>;
  recentEvents: SecurityEvent[];
}

/**
 * In-memory event store (use database in production)
 */
const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS_IN_MEMORY = 1000;

/**
 * Log a security event
 */
export function logSecurityEvent(
  type: SecurityEventType,
  severity: SecurityEvent['severity'],
  identifier: string,
  description: string,
  metadata: Record<string, unknown> = {},
  threat?: ThreatDetection | AuthThreat | SecretLeakDetection
): SecurityEvent {
  const event: SecurityEvent = {
    id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    timestamp: new Date(),
    identifier,
    description,
    metadata,
    threat,
  };

  securityEvents.push(event);

  // Keep only recent events in memory
  if (securityEvents.length > MAX_EVENTS_IN_MEMORY) {
    securityEvents.shift();
  }

  // Log to console/external service
  const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  logger[logLevel]('Security event', {
    type,
    severity,
    identifier,
    description,
  });

  return event;
}

/**
 * Get recent security events
 */
export function getRecentEvents(limit: number = 50): SecurityEvent[] {
  return securityEvents.slice(-limit).reverse();
}

/**
 * Get events by severity
 */
export function getEventsBySeverity(
  severity: SecurityEvent['severity']
): SecurityEvent[] {
  return securityEvents.filter(e => e.severity === severity);
}

/**
 * Get events by type
 */
export function getEventsByType(type: SecurityEventType): SecurityEvent[] {
  return securityEvents.filter(e => e.type === type);
}

/**
 * Get events for a specific identifier
 */
export function getEventsForIdentifier(identifier: string): SecurityEvent[] {
  return securityEvents.filter(e => e.identifier === identifier);
}

/**
 * Get security event summary
 */
export function getSecuritySummary(): SecurityEventSummary {
  const eventsBySeverity: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  const eventsByType: Record<string, number> = {};
  const identifierCounts: Record<string, number> = {};

  for (const event of securityEvents) {
    eventsBySeverity[event.severity]++;
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    identifierCounts[event.identifier] = (identifierCounts[event.identifier] || 0) + 1;
  }

  const topIdentifiers = Object.entries(identifierCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([identifier, count]) => ({ identifier, count }));

  return {
    totalEvents: securityEvents.length,
    eventsBySeverity,
    eventsByType,
    topIdentifiers,
    recentEvents: getRecentEvents(10),
  };
}

/**
 * Clear all events (use with caution)
 */
export function clearEvents(): void {
  securityEvents.length = 0;
  logger.info('Security events cleared');
}

/**
 * Check if identifier has exceeded alert threshold
 */
export function shouldAlertForIdentifier(
  identifier: string,
  threshold: number = 5,
  timeWindowMs: number = 60 * 60 * 1000 // 1 hour
): boolean {
  const now = Date.now();
  const recentEvents = securityEvents.filter(
    e => e.identifier === identifier && 
         now - e.timestamp.getTime() < timeWindowMs
  );

  return recentEvents.length >= threshold;
}

/**
 * Security Initialization
 * 
 * Initialize security monitoring on application startup
 * Runs checks and sends alerts if secrets are leaked
 * 
 * @module lib/security/init
 */

'use client';

import { useEffect } from 'react';
import { detectSecretLeaks, validatePublicVariables } from './secrets';
import { logger } from '@/lib/logger';

let hasRunCheck = false;

/**
 * Client-side security monitor hook
 * Runs once on application mount to detect secret leaks
 */
export function useSecurityMonitor() {
  useEffect(() => {
    // Only run once
    if (hasRunCheck) return;
    hasRunCheck = true;

    // Run security checks on client
    const leaks = detectSecretLeaks();
    const publicVarCheck = validatePublicVariables();

    if (leaks.detected || !publicVarCheck.valid) {
      // Log to console for immediate visibility
      console.error('🚨 SECURITY ALERT: Secret leak detected!');
      console.error('Leaked secrets:', leaks.leakedSecrets);
      console.error('Warnings:', publicVarCheck.warnings);

      // Send alert to server endpoint
      fetch('/api/security?alert=true', {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          logger.info('Security API response', data);
        })
        .catch(error => {
          logger.error('Failed to trigger security alert', { error });
        });
    }
  }, []);
}

/**
 * Security Monitor Component
 * Add this to your root layout to enable monitoring
 */
export function SecurityMonitor() {
  useSecurityMonitor();
  return null;
}

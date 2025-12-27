"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

// Extend Navigator interface for iOS standalone property
declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

// More accurate interface for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Safe localStorage access
  const getStorageItem = (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('localStorage access failed:', error);
    }
    return null;
  };

  const setStorageItem = (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage write failed:', error);
    }
  };

  useEffect(() => {
    // Check if PWA install is supported
    const isSupported = typeof window !== 'undefined' &&
                       'serviceWorker' in navigator &&
                       'BeforeInstallPromptEvent' in window;

    let timeoutId: ReturnType<typeof setTimeout>;

    // Callback to check installation status and update state only in event
    const checkAndSetInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      if (isStandalone || isInWebAppiOS) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Only proceed if supported and not installed
    if (!isSupported || checkAndSetInstalled()) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Show prompt after a short delay to not be intrusive
      timeoutId = setTimeout(() => {
        if (!getStorageItem('pwa-install-dismissed')) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Clear the dismissal flag on successful install
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('pwa-install-dismissed');
        }
      } catch (error) {
        console.warn('localStorage remove failed:', error);
      }
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.warn('No deferred prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log('PWA install outcome:', outcome);

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Install prompt failed:', error);
      // Reset state on error
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setStorageItem('pwa-install-dismissed', 'true');
    // Clear the deferred prompt when dismissed
    setDeferredPrompt(null);
  };

  // Don't show if not supported, already installed, or no prompt available
  const isSupported = typeof window !== 'undefined' &&
                     'serviceWorker' in navigator &&
                     'BeforeInstallPromptEvent' in window;

  if (!isSupported || isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-1/2 translate-x-1/2 sm:bottom-4 sm:right-4 sm:translate-x-0 z-50 w-[90vw] max-w-[280px] sm:max-w-[320px] animate-in slide-in-from-bottom-2"
      style={{ pointerEvents: 'auto' }}
    >
      <Card
        className="border border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-2xl shadow-2xl p-0 rounded-xl"
        style={{ 
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25), 0 2px 16px 0 rgba(31,38,135,0.15)',
          borderRadius: '0.75rem' 
        }}
      >
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground font-semibold">
              <Download className="h-4 w-4 text-primary drop-shadow-sm" />
              Install App
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 rounded-full bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 backdrop-blur-sm"
              aria-label="Dismiss install prompt"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
          <CardDescription className="text-muted-foreground mt-1">
            <span className="block text-xs font-medium leading-relaxed">
              Install PWA for offline access and faster loading!
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-4">
          <Button
            onClick={handleInstallClick}
            className="w-full bg-primary/90 hover:bg-primary text-white font-medium shadow-lg backdrop-blur-sm rounded-md py-1.5 text-sm"
            disabled={!deferredPrompt}
            size="sm"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Install
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
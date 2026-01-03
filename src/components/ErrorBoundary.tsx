'use client';

import Link from 'next/link';
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Optional fallback UI component */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Optional callback when error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Provides error logging and recovery mechanism.
 * 
 * @component
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Something went wrong</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details when error is caught
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    logger.error('Error boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error boundary state
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default fallback UI
      return <DefaultErrorFallback error={this.state.error} reset={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback UI
 * Shows error message and recovery button
 */
interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4 py-8">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-xl font-bold text-center mb-2">Something went wrong</h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <p className="text-xs font-mono text-gray-700 wrap-break-word">
              {error.message}
            </p>
          </div>
        )}

        {/* Recovery Button */}
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>

        {/* Home Link */}
        <Link
          href="/"
          className="block mt-3 text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

/**
 * Segment-specific error boundary for pages
 * Wraps individual page segments for granular error handling
 */
export class PageErrorBoundary extends ErrorBoundary {
  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Unable to load this page</h1>
          <p className="text-gray-600 mb-6">Please try refreshing the page.</p>
          <button
            onClick={this.resetError}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

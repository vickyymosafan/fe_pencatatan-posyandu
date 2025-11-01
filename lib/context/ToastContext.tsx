/**
 * Toast Context
 * Provides toast notification functionality across the application
 * Manages toast state and provides methods to show/hide toasts
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Toast type variants
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast item interface
 */
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Toast context value interface
 */
interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

/**
 * Toast context
 */
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Toast Provider Component
 * Wraps the application to provide toast functionality
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Hide a toast notification
   */
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Show a toast notification
   */
  const showToast = useCallback(
    (type: ToastType, message: string, duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  /**
   * Convenience method for success toast
   */
  const success = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration);
    },
    [showToast]
  );

  /**
   * Convenience method for error toast
   */
  const error = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration);
    },
    [showToast]
  );

  /**
   * Convenience method for warning toast
   */
  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration);
    },
    [showToast]
  );

  /**
   * Convenience method for info toast
   */
  const info = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration);
    },
    [showToast]
  );

  const value: ToastContextValue = {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

/**
 * Hook to use toast context
 * Must be used within ToastProvider
 * @throws Error if used outside ToastProvider
 */
export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}

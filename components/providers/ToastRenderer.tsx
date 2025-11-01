/**
 * Toast Renderer
 * Client component that renders toasts from ToastContext
 */

'use client';

import { useToast } from '@/lib/hooks';
import { ToastContainer } from '@/components/ui';

export function ToastRenderer() {
  const { toasts, hideToast } = useToast();

  return <ToastContainer toasts={toasts} onClose={hideToast} />;
}

/**
 * useToast Hook
 * Convenience hook to access toast functionality
 * Re-exports the useToastContext for easier imports
 */

export { useToastContext as useToast } from '../context/ToastContext';
export type { Toast, ToastType } from '../context/ToastContext';

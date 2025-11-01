/**
 * Error Messages Utility
 * Provides user-friendly error messages for different error scenarios
 * Maps technical errors to human-readable messages
 */

/**
 * Error code to message mapping
 */
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Koneksi gagal. Periksa koneksi internet Anda dan coba lagi.',
  TIMEOUT_ERROR: 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
  
  // Authentication errors
  UNAUTHORIZED: 'Sesi Anda telah berakhir. Silakan login kembali.',
  FORBIDDEN: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
  INVALID_CREDENTIALS: 'Email atau password salah.',
  
  // Validation errors
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid. Periksa kembali form Anda.',
  REQUIRED_FIELD: 'Field ini wajib diisi.',
  INVALID_EMAIL: 'Format email tidak valid.',
  INVALID_NIK: 'NIK harus berupa 16 digit angka.',
  INVALID_PASSWORD: 'Password minimal 8 karakter dengan kombinasi huruf dan angka.',
  
  // Resource errors
  NOT_FOUND: 'Data yang Anda cari tidak ditemukan.',
  ALREADY_EXISTS: 'Data sudah ada dalam sistem.',
  
  // Server errors
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  SERVICE_UNAVAILABLE: 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.',
  
  // QR Code errors
  QR_SCAN_ERROR: 'Gagal memindai QR Code. Pastikan kamera berfungsi dengan baik.',
  QR_INVALID: 'QR Code tidak valid atau tidak terdaftar dalam sistem.',
  
  // Generic errors
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
  OPERATION_FAILED: 'Operasi gagal. Silakan coba lagi.',
} as const;

/**
 * Get user-friendly error message based on error type or HTTP status
 */
export function getUserFriendlyMessage(
  error: Error | string | number,
  fallback?: string
): string {
  // Handle Error object
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    if (message.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    
    // Auth errors
    if (message.includes('unauthorized') || message.includes('session expired')) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }
    
    if (message.includes('forbidden')) {
      return ERROR_MESSAGES.FORBIDDEN;
    }
    
    // QR errors
    if (message.includes('qr') || message.includes('scan')) {
      return ERROR_MESSAGES.QR_SCAN_ERROR;
    }
    
    // Return original message if it's already user-friendly
    if (message.length > 10 && !message.includes('error')) {
      return error.message;
    }
  }
  
  // Handle HTTP status codes
  if (typeof error === 'number') {
    switch (error) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 409:
        return ERROR_MESSAGES.ALREADY_EXISTS;
      case 429:
        return 'Terlalu banyak permintaan. Silakan tunggu beberapa saat dan coba lagi.';
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      case 503:
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    // Check if it's already a user-friendly message
    if (error.length > 20 && !error.toLowerCase().includes('error')) {
      return error;
    }
  }
  
  // Return fallback or default message
  return fallback || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    error.name === 'NetworkError'
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: Error | number): boolean {
  if (typeof error === 'number') {
    return error === 401 || error === 403;
  }
  
  const message = error.message.toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('session')
  );
}

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

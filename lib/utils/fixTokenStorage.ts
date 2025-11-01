/**
 * Token Storage Fix Utility
 * 
 * This utility helps fix double-stringified tokens in localStorage
 * Run this once to clean up existing tokens
 */

/**
 * Fix double-stringified token in localStorage
 * Checks if token is JSON-stringified and fixes it
 */
export function fixTokenStorage(): void {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('No token found in localStorage');
    return;
  }
  
  // Check if token is JSON-stringified (starts and ends with quotes)
  if (token.startsWith('"') && token.endsWith('"')) {
    try {
      const parsedToken = JSON.parse(token);
      localStorage.setItem('token', parsedToken);
      console.log('✅ Token fixed! Removed extra quotes.');
      console.log('Please refresh the page.');
    } catch (error) {
      console.error('❌ Failed to fix token:', error);
    }
  } else {
    console.log('✅ Token is already in correct format');
  }
}

/**
 * Clear all auth data and force re-login
 * Use this if you want to start fresh
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Clear cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  console.log('✅ Auth data cleared. Please login again.');
  window.location.href = '/login';
}

// Make functions available in browser console for debugging
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).fixTokenStorage = fixTokenStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).clearAuthData = clearAuthData;
}

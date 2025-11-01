/**
 * API Module Exports
 * Central export point for all API functions
 * Provides clean imports: import { login, getAllUsers } from '@/lib/api'
 */

// Export base client
export { apiClient } from './client';

// Export auth functions
export * from './auth';

// Export users functions
export * from './users';

// Export lansia functions
export * from './lansia';

// Export pemeriksaan functions
export * from './pemeriksaan';

// Export laporan functions
export * from './laporan';

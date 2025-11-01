/**
 * User-related type definitions
 */

import { ID, DateString } from './common';

/**
 * User role enum
 */
export enum Role {
  ADMIN = 'ADMIN',
  PETUGAS = 'PETUGAS',
}

/**
 * User entity from database
 */
export interface User {
  id: ID;
  nama: string;
  email: string;
  role: Role;
  createdAt: DateString;
  updatedAt: DateString;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Create user request payload
 */
export interface CreateUserRequest {
  nama: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * Update user request payload (all fields optional)
 */
export interface UpdateUserRequest {
  nama?: string;
  email?: string;
  password?: string;
  role?: Role;
}

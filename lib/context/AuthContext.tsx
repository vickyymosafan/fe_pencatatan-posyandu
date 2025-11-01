/**
 * Auth Context
 * Provides authentication state and methods across the application
 * Integrates with API auth layer and localStorage
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginRequest } from '@/types';
import * as authApi from '../api/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Auth state interface
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Auth context value interface
 */
interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Wraps the application to provide authentication functionality
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken, removeToken] = useLocalStorage<string | null>('token', null);
  const [user, setUser, removeUser] = useLocalStorage<User | null>('user', null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!token && !!user;

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      // Check if token exists in localStorage
      const storedToken = authApi.getStoredToken();
      const storedUser = authApi.getStoredUser() as User | null;

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      try {
        const response = await authApi.login(credentials);

        if (response.error || !response.data) {
          setIsLoading(false);
          return {
            success: false,
            error: response.error || 'Login gagal',
          };
        }

        const { token: newToken, user: newUser } = response.data;

        // Save to localStorage using API helper
        authApi.saveAuthData(newToken, newUser);

        // Update state
        setToken(newToken);
        setUser(newUser);
        setIsLoading(false);

        return { success: true };
      } catch (error) {
        setIsLoading(false);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Login gagal',
        };
      }
    },
    [setToken, setUser]
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    // Clear localStorage using API helper
    authApi.logout();

    // Clear state
    removeToken();
    removeUser();

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [removeToken, removeUser]);

  /**
   * Check if user is authenticated
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    const storedToken = authApi.getStoredToken();
    const storedUser = authApi.getStoredUser();

    if (!storedToken || !storedUser) {
      return false;
    }

    return true;
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Must be used within AuthProvider
 * @throws Error if used outside AuthProvider
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

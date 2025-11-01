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
      // Only check localStorage if state is empty
      // useLocalStorage already initializes from localStorage
      // This is just a fallback for edge cases
      if (!token && !user) {
        const storedToken = authApi.getStoredToken();
        const storedUser = authApi.getStoredUser() as User | null;

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          // Save cookies if they don't exist
          authApi.saveAuthCookies(storedUser);
        }
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

        const { token: newToken, user: newUser } = response.data.data;

        // Update state (useLocalStorage will handle localStorage)
        setToken(newToken);
        setUser(newUser);
        
        // Save cookies for middleware
        authApi.saveAuthCookies(newUser);
        
        // Use setTimeout to ensure state updates complete before returning
        // This prevents race condition with redirect
        await new Promise(resolve => setTimeout(resolve, 100));
        
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
    // Clear state (useLocalStorage will handle localStorage)
    removeToken();
    removeUser();
    
    // Clear cookies
    authApi.logout();

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

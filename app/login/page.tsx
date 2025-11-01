/**
 * Login Page
 * Authentication page with email and password form
 * Redirects to dashboard on successful login
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card } from '@/components/ui';
import { useAuth, useToast } from '@/lib/hooks';
import { validateEmail, validatePassword } from '@/lib/utils';
import { Role } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, user, isLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardUrl =
        user.role === Role.ADMIN ? '/admin/dashboard' : '/petugas/dashboard';
      router.push(dashboardUrl);
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Email validation using utility
  const handleEmailValidation = (value: string): boolean => {
    const result = validateEmail(value);
    setEmailError(result.error || '');
    return result.isValid;
  };

  // Password validation using utility
  const handlePasswordValidation = (value: string): boolean => {
    const result = validatePassword(value);
    setPasswordError(result.error || '');
    return result.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const isEmailValid = handleEmailValidation(email);
    const isPasswordValid = handlePasswordValidation(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        toast.success('Login berhasil!');
        
        // Manual redirect as fallback (useEffect will also handle it)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const dashboardUrl = userData.role === Role.ADMIN ? '/admin/dashboard' : '/petugas/dashboard';
          router.push(dashboardUrl);
        }
      } else {
        toast.error(result.error || 'Login gagal. Silakan coba lagi.');
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Posyandu Lansia
          </h1>
          <p className="text-neutral-600">Sistem Rekam Medis Digital</p>
        </div>

        {/* Login Form */}
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value);
                if (emailError) handleEmailValidation(value);
              }}
              error={emailError}
              placeholder="nama@example.com"
              required
              disabled={isSubmitting}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                if (passwordError) handlePasswordValidation(value);
              }}
              error={passwordError}
              placeholder="Masukkan password"
              required
              disabled={isSubmitting}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
              disabled={isSubmitting || !!emailError || !!passwordError}
            >
              {isSubmitting ? 'Memproses...' : 'Login'}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-neutral-600 mt-6">
          © 2024 Posyandu Lansia. All rights reserved.
        </p>
      </div>
    </div>
  );
}

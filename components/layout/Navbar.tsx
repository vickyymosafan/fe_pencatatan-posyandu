/**
 * Navbar Component
 * Top navigation bar with logo, app name, and user menu
 * Responsive design with hamburger menu for mobile
 */

'use client';

import React, { useState } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/hooks';

export interface NavbarProps {
  onMenuClick?: () => void;
}

/**
 * Navbar Component
 * 
 * @example
 * <Navbar onMenuClick={toggleMobileMenu} />
 */
export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-neutral-50 border-b border-neutral-200 h-16">
      <div className="container flex items-center justify-between h-full">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger menu - visible on mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-neutral-800" />
          </button>

          {/* Logo and App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center" role="img" aria-label="Logo Posyandu Lansia">
              <span className="text-white font-bold text-lg" aria-hidden="true">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-neutral-900">
                Posyandu Lansia
              </h1>
              <p className="text-xs text-neutral-600">Sistem Rekam Medis Digital</p>
            </div>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="User menu"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-neutral-900">{user?.nama}</p>
              <p className="text-xs text-neutral-600">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-700" />
            </div>
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-neutral-200">
                  <p className="text-sm font-medium text-neutral-900">{user?.nama}</p>
                  <p className="text-xs text-neutral-600">{user?.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-800 rounded">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

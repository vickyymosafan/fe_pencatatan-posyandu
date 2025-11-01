/**
 * MobileMenu Component
 * Wrapper component for mobile navigation
 * Manages sidebar visibility state for mobile devices
 */

'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export interface MobileMenuProps {
  children: React.ReactNode;
}

/**
 * MobileMenu Component
 * Combines Navbar and Sidebar with mobile menu state management
 * 
 * @example
 * <MobileMenu>
 *   <main>Page content</main>
 * </MobileMenu>
 */
export function MobileMenu({ children }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navbar */}
      <Navbar onMenuClick={toggleMobileMenu} />

      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main Content */}
      <div className="md:ml-64 pt-0">
        {children}
      </div>
    </div>
  );
}

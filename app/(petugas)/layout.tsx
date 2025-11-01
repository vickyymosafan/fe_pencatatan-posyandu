/**
 * Petugas Layout
 * Layout wrapper for petugas routes with Navbar and Sidebar
 * Handles mobile menu state
 */

'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Role } from '@/types';

export default function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <AuthGuard requiredRole={Role.PETUGAS}>
      <div className="min-h-screen bg-neutral-50">
        <Navbar onMenuClick={toggleMobileMenu} />
        <div className="flex">
          <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
          <main className="flex-1 md:ml-64 p-6">
            <div className="container max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

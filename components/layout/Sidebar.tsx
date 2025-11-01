/**
 * Sidebar Component
 * Navigation sidebar with role-based menu items
 * Responsive with desktop fixed and mobile overlay modes
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  QrCode,
  FileText,
  Scan,
  ClipboardEdit,
  History,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks';
import { Role } from '@/types';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const menuItems: MenuItem[] = [
  // Admin menu items
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: [Role.ADMIN],
  },
  {
    label: 'Pengguna',
    href: '/admin/users',
    icon: Users,
    roles: [Role.ADMIN],
  },
  {
    label: 'Data Lansia',
    href: '/admin/lansia',
    icon: UserCheck,
    roles: [Role.ADMIN],
  },
  {
    label: 'QR Code',
    href: '/admin/qrcode',
    icon: QrCode,
    roles: [Role.ADMIN],
  },
  {
    label: 'Laporan',
    href: '/admin/laporan',
    icon: FileText,
    roles: [Role.ADMIN],
  },
  // Petugas menu items
  {
    label: 'Dashboard',
    href: '/petugas/dashboard',
    icon: LayoutDashboard,
    roles: [Role.PETUGAS],
  },
  {
    label: 'Scan QR',
    href: '/petugas/scan',
    icon: Scan,
    roles: [Role.PETUGAS],
  },
  {
    label: 'Input Pemeriksaan',
    href: '/petugas/input',
    icon: ClipboardEdit,
    roles: [Role.PETUGAS],
  },
  {
    label: 'Riwayat',
    href: '/petugas/riwayat',
    icon: History,
    roles: [Role.PETUGAS],
  },
];

/**
 * Sidebar Component
 * 
 * @example
 * // Desktop
 * <Sidebar />
 * 
 * // Mobile
 * <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
 */
export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-neutral-50 border-r border-neutral-200 transition-transform duration-300',
          // Desktop: always visible
          'md:translate-x-0 md:top-16 md:h-[calc(100vh-4rem)]',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-neutral-800" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  'hover:bg-neutral-100',
                  active
                    ? 'bg-neutral-200 text-neutral-900 font-medium border-l-4 border-neutral-800'
                    : 'text-neutral-700'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

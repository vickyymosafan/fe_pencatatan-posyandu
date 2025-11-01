# Layout Components

This directory contains layout components for the Posyandu Lansia application, including navigation and structural elements.

## Components

### Navbar

Top navigation bar with logo, app name, and user menu.

**Features:**
- Logo and application name
- User menu with dropdown
- Logout functionality
- Responsive design (hamburger menu on mobile)
- Sticky positioning

**Usage:**
```tsx
import { Navbar } from '@/components/layout';

<Navbar onMenuClick={toggleMobileMenu} />
```

**Props:**
- `onMenuClick?: () => void` - Callback for hamburger menu click (mobile)

**Responsive Behavior:**
- **Desktop (≥768px)**: Full navbar with logo, app name, and user menu
- **Mobile (<768px)**: Hamburger menu icon, logo, and user avatar

### Sidebar

Navigation sidebar with role-based menu items.

**Features:**
- Role-based menu items (Admin vs Petugas)
- Active state highlighting
- Icon-based navigation
- Responsive design (fixed on desktop, overlay on mobile)
- Smooth transitions

**Menu Items:**

**Admin:**
- Dashboard (LayoutDashboard icon)
- Pengguna (Users icon)
- Data Lansia (UserCheck icon)
- QR Code (QrCode icon)
- Laporan (FileText icon)

**Petugas:**
- Dashboard (LayoutDashboard icon)
- Scan QR (Scan icon)
- Input Pemeriksaan (ClipboardEdit icon)
- Riwayat (History icon)

**Usage:**
```tsx
import { Sidebar } from '@/components/layout';

// Desktop (always visible)
<Sidebar />

// Mobile (controlled visibility)
<Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
```

**Props:**
- `isOpen?: boolean` - Controls sidebar visibility (default: true)
- `onClose?: () => void` - Callback when sidebar should close (mobile)
- `className?: string` - Additional CSS classes

**Responsive Behavior:**
- **Desktop (≥768px)**: Fixed sidebar, always visible, width 256px
- **Mobile (<768px)**: Overlay sidebar with backdrop, slides in/out

**Active State:**
- Background: neutral-200
- Border left: 4px solid neutral-800
- Font weight: medium

### MobileMenu

Wrapper component that combines Navbar and Sidebar with mobile menu state management.

**Features:**
- Manages mobile menu open/close state
- Integrates Navbar and Sidebar
- Handles content layout with sidebar offset
- Provides consistent layout structure

**Usage:**
```tsx
import { MobileMenu } from '@/components/layout';

export default function Layout({ children }) {
  return (
    <MobileMenu>
      <main className="p-6">
        {children}
      </main>
    </MobileMenu>
  );
}
```

**Props:**
- `children: React.ReactNode` - Page content to render

**Layout Structure:**
```
┌─────────────────────────────────┐
│         Navbar (sticky)         │
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │   Main Content       │
│ (fixed)  │   (children)         │
│          │                      │
└──────────┴──────────────────────┘
```

## Integration with Authentication

All layout components integrate with the authentication system:

```tsx
import { useAuth } from '@/lib/hooks';

const { user, logout } = useAuth();
```

**User Data:**
- `user.nama` - User's name
- `user.email` - User's email
- `user.role` - User's role (ADMIN or PETUGAS)

**Role-Based Rendering:**
The Sidebar component automatically filters menu items based on the user's role.

## Styling

All components follow the design system:

- **Colors**: Neutral palette (50-950)
- **Border Radius**: rounded-lg, rounded-xl
- **Transitions**: 300ms ease-in-out
- **Shadows**: Custom shadow on dropdowns
- **Typography**: Montserrat font family

## Accessibility

All components follow accessibility best practices:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper aria-label attributes on icon buttons
- **Focus Indicators**: Visible focus rings on interactive elements
- **Semantic HTML**: Proper use of nav, aside, and button elements

## Examples

### Basic Layout (Admin)

```tsx
import { MobileMenu } from '@/components/layout';

export default function AdminLayout({ children }) {
  return (
    <MobileMenu>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {children}
      </main>
    </MobileMenu>
  );
}
```

### Basic Layout (Petugas)

```tsx
import { MobileMenu } from '@/components/layout';

export default function PetugasLayout({ children }) {
  return (
    <MobileMenu>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Petugas Dashboard</h1>
        {children}
      </main>
    </MobileMenu>
  );
}
```

### Custom Layout with Separate Components

```tsx
'use client';

import { useState } from 'react';
import { Navbar, Sidebar } from '@/components/layout';

export default function CustomLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <div className="md:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Responsive Breakpoints

Components use TailwindCSS breakpoints:

- **sm**: 640px
- **md**: 768px (main breakpoint for mobile/desktop switch)
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Icons

Icons are provided by `lucide-react`:

```tsx
import {
  LayoutDashboard,
  Users,
  UserCheck,
  QrCode,
  FileText,
  Scan,
  ClipboardEdit,
  History,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
```

## State Management

### Navbar State
- User menu dropdown (open/close)
- Managed internally with useState

### Sidebar State
- Mobile menu visibility
- Can be controlled externally or managed by MobileMenu

### MobileMenu State
- Mobile menu open/close
- Managed internally and passed to Navbar and Sidebar

## Best Practices

1. **Use MobileMenu for standard layouts**: It handles all the complexity of mobile menu state
2. **Use separate components for custom layouts**: When you need more control
3. **Always provide onMenuClick to Navbar**: When using it separately
4. **Always provide isOpen and onClose to Sidebar**: When using it separately on mobile
5. **Test on mobile devices**: Ensure touch interactions work properly
6. **Verify role-based menus**: Test with both ADMIN and PETUGAS roles

## Testing

### Manual Testing Checklist

- [ ] Navbar displays correctly on desktop
- [ ] Navbar displays correctly on mobile
- [ ] Hamburger menu opens sidebar on mobile
- [ ] User menu dropdown works
- [ ] Logout functionality works
- [ ] Sidebar shows correct menu items for ADMIN
- [ ] Sidebar shows correct menu items for PETUGAS
- [ ] Active menu item is highlighted
- [ ] Sidebar is fixed on desktop
- [ ] Sidebar is overlay on mobile
- [ ] Backdrop closes sidebar on mobile
- [ ] Close button closes sidebar on mobile
- [ ] Navigation links work correctly
- [ ] Responsive transitions are smooth

## Troubleshooting

### Sidebar not showing on desktop
- Check that the viewport width is ≥768px
- Verify that the sidebar is not hidden by other elements

### Mobile menu not opening
- Ensure `onMenuClick` is passed to Navbar
- Verify state management in parent component

### Wrong menu items showing
- Check user role in AuthContext
- Verify role-based filtering logic in Sidebar

### Active state not working
- Check that pathname matches menu item href
- Verify usePathname hook is working

### Layout shifting on mobile
- Ensure proper z-index values
- Check that backdrop is positioned correctly

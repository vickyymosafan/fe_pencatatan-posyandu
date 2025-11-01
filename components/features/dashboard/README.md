# Dashboard Components

Feature-specific components for dashboard pages.

## Components

### StatCard

Displays a single statistic with icon, label, and value.

**Props:**
- `label`: string - The label for the statistic
- `value`: string | number - The value to display
- `icon`: LucideIcon - Icon component from lucide-react
- `iconColor`: string (optional) - Tailwind color class for icon
- `iconBgColor`: string (optional) - Tailwind background color class for icon container
- `className`: string (optional) - Additional CSS classes

**Usage:**
```tsx
import { StatCard } from '@/components/features/dashboard';
import { Users } from 'lucide-react';

<StatCard
  label="Total Lansia"
  value={150}
  icon={Users}
  iconColor="text-blue-600"
  iconBgColor="bg-blue-100"
/>
```

## Design Principles

- **Separation of Concerns**: Dashboard components are feature-specific and separated from generic UI components
- **Reusability**: StatCard can be used in both Admin and Petugas dashboards
- **Consistency**: Follows the design system color palette and spacing
- **Accessibility**: Proper semantic HTML and ARIA attributes

# UI Components

This directory contains reusable UI components that follow the design system specifications for the Posyandu Lansia application.

## Design System

All components follow these principles:
- **Neutral Color Palette**: neutral-50 to neutral-950
- **Custom Shadow**: `0px 20px 207px 10px rgba(249, 245, 249, 0.2)`
- **Border Radius**: rounded-xl or rounded-2xl
- **Transitions**: 300ms ease-in-out on all interactive elements
- **Font**: Montserrat
- **Accessibility**: WCAG 2.1 AA compliant

## Components

### Button

Reusable button with multiple variants and sizes.

**Variants:**
- `primary`: bg-neutral-800 text-white
- `secondary`: bg-neutral-200 text-neutral-800
- `danger`: bg-red-600 text-white
- `ghost`: bg-transparent text-neutral-800

**Sizes:**
- `sm`: py-1.5 px-3 text-sm
- `md`: py-2 px-4 text-base
- `lg`: py-3 px-6 text-lg

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="danger" isLoading>
  Deleting...
</Button>
```

### Input

Form input with label, error states, and validation support.

**Types:**
- text, email, password, number, date, tel, textarea

**Features:**
- Label with required indicator
- Error message display
- Disabled state
- Accessibility attributes (aria-required, aria-invalid)

**Usage:**
```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
  placeholder="user@example.com"
/>

<Input
  label="Description"
  type="textarea"
  value={description}
  onChange={setDescription}
  rows={5}
/>
```

### Card

Container component with optional title, subtitle, and footer.

**Features:**
- Custom shadow
- Optional click handler
- Keyboard navigation support
- Flexible content area

**Usage:**
```tsx
import { Card } from '@/components/ui';

<Card title="Statistics" subtitle="Monthly overview">
  <p>Card content here</p>
</Card>

<Card
  title="Clickable Card"
  onClick={handleClick}
  footer={<Button>Action</Button>}
>
  <p>Content</p>
</Card>
```

### Table

Generic table component with pagination and loading states.

**Features:**
- Type-safe with TypeScript generics
- Custom column rendering
- Row click handler
- Pagination controls
- Loading skeleton
- Empty state

**Usage:**
```tsx
import { Table } from '@/components/ui';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (row) => <Badge>{row.role}</Badge>
  },
];

<Table
  columns={columns}
  data={users}
  onRowClick={handleRowClick}
  isLoading={isLoading}
  pagination={{
    currentPage: 1,
    totalPages: 10,
    onPageChange: setPage,
  }}
/>
```

### Modal

Dialog component with backdrop and multiple sizes.

**Sizes:**
- `sm`: max-w-sm
- `md`: max-w-md
- `lg`: max-w-lg
- `xl`: max-w-xl

**Features:**
- Backdrop click to close
- Escape key to close
- Body scroll lock
- Focus trap
- Accessibility attributes

**Usage:**
```tsx
import { Modal, Button } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Edit User"
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
    </>
  }
>
  <p>Modal content</p>
</Modal>
```

### Toast

Notification component with auto-dismiss.

**Types:**
- `success`: Green with checkmark icon
- `error`: Red with X icon
- `warning`: Yellow with exclamation icon
- `info`: Blue with info icon

**Features:**
- Auto-dismiss after 5 seconds (configurable)
- Manual close button
- Stacked display
- Slide-in animation

**Usage:**
```tsx
import { useToast } from '@/lib/hooks';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong!', 10000); // 10 seconds
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

**Note:** Toast notifications are automatically rendered via `ToastRenderer` in the root layout. No need to manually add `ToastContainer`.

### Skeleton

Loading placeholder with pulse animation.

**Variants:**
- `text`: rounded
- `circular`: rounded-full
- `rectangular`: rounded-lg (default)

**Features:**
- Customizable width and height
- Pulse animation
- Multiple line support (SkeletonText)

**Usage:**
```tsx
import { Skeleton, SkeletonText } from '@/components/ui';

// Single skeleton
<Skeleton className="h-12 w-full" />

// Circular skeleton (avatar)
<Skeleton variant="circular" width={40} height={40} />

// Multiple lines of text
<SkeletonText lines={3} />
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus rings on all focusable elements
- **ARIA Attributes**: Proper aria-* attributes for screen readers
- **Semantic HTML**: Correct HTML elements for structure
- **Color Contrast**: Minimum 4.5:1 ratio for text

## Styling

Components use Tailwind CSS with the custom design system:

```css
/* Custom classes available */
.card    /* Pre-styled card container */
.btn     /* Base button styles */
.input   /* Base input styles */
```

## Type Safety

All components are fully typed with TypeScript:

```tsx
import type { ButtonProps, ButtonVariant, ButtonSize } from '@/components/ui';
import type { InputProps, InputType } from '@/components/ui';
import type { CardProps } from '@/components/ui';
import type { TableProps, Column, PaginationConfig } from '@/components/ui';
import type { ModalProps, ModalSize } from '@/components/ui';
import type { ToastProps } from '@/components/ui';
import type { SkeletonProps } from '@/components/ui';
```

## Best Practices

1. **Use semantic variants**: Choose the appropriate variant for the context
2. **Provide labels**: Always include labels for form inputs
3. **Handle loading states**: Use isLoading prop or Skeleton components
4. **Show feedback**: Use Toast notifications for user actions
5. **Maintain consistency**: Use the same components across the app
6. **Test accessibility**: Ensure keyboard navigation and screen reader support

## Examples

### Form with validation

```tsx
import { Input, Button } from '@/components/ui';
import { useToast } from '@/lib/hooks';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({ email, password });
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        required
      />
      <Button type="submit" variant="primary" className="w-full">
        Login
      </Button>
    </form>
  );
}
```

### Data table with actions

```tsx
import { Table, Button, Modal } from '@/components/ui';

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: 'nama', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={users}
        onRowClick={setSelectedUser}
      />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div>
            <p>Name: {selectedUser.nama}</p>
            <p>Email: {selectedUser.email}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
```

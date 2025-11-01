# User Management Components

Feature-specific components for user management (CRUD operations).

## Components

### CreateUserModal

Modal for creating a new user (petugas or admin).

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `onSubmit`: (data: CreateUserRequest) => Promise<void> - Callback when form is submitted
- `isLoading`: boolean (optional) - Loading state for submit button

**Features:**
- Form validation (email format, password strength)
- Role selection (Admin/Petugas)
- Error display for each field
- Auto-close on successful submit

**Usage:**
```tsx
<CreateUserModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleCreate}
  isLoading={isSubmitting}
/>
```

### EditUserModal

Modal for editing an existing user.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `onSubmit`: (id: string, data: UpdateUserRequest) => Promise<void> - Callback when form is submitted
- `user`: User | null - User data to edit
- `isLoading`: boolean (optional) - Loading state for submit button

**Features:**
- Pre-filled form with user data
- Optional password update (leave blank to keep current)
- Form validation
- Only sends changed fields to API

**Usage:**
```tsx
<EditUserModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleUpdate}
  user={selectedUser}
  isLoading={isSubmitting}
/>
```

### DeleteConfirmModal

Confirmation dialog for deleting a user.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Callback when modal closes
- `onConfirm`: (id: string) => Promise<void> - Callback when deletion is confirmed
- `user`: User | null - User to delete
- `isLoading`: boolean (optional) - Loading state for confirm button

**Features:**
- Warning message with user details
- Danger styling (red theme)
- Confirmation required before deletion

**Usage:**
```tsx
<DeleteConfirmModal
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleDelete}
  user={selectedUser}
  isLoading={isSubmitting}
/>
```

## Design Principles

- **Separation of Concerns**: Modals are presentational components, business logic stays in the page
- **Reusability**: All modals can be used in different contexts
- **Validation**: Client-side validation before API calls
- **Accessibility**: Proper ARIA labels, keyboard navigation, focus management
- **User Feedback**: Clear error messages and loading states

## Form Validation Rules

### Email
- Required for create
- Must match email format regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Password
- Required for create (minimum 8 characters)
- Optional for edit
- Must contain both letters and numbers: `/(?=.*[a-zA-Z])(?=.*[0-9])/`

### Name
- Required for create
- Cannot be empty string

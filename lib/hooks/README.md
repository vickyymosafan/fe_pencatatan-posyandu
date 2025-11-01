# Custom React Hooks

This directory contains custom React hooks for the Posyandu Lansia frontend application.

## Available Hooks

### useLocalStorage

Generic hook for localStorage operations with React state synchronization.

**Features:**
- SSR-safe (checks for window object)
- Automatic JSON serialization/deserialization
- Syncs across browser tabs
- Type-safe with TypeScript generics

**Usage:**
```typescript
import { useLocalStorage } from '@/lib/hooks';

function MyComponent() {
  const [value, setValue, removeValue] = useLocalStorage('myKey', 'defaultValue');
  
  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue('newValue')}>Update</button>
      <button onClick={removeValue}>Remove</button>
    </div>
  );
}
```

### useDebounce

Debounces a value to reduce the frequency of updates. Useful for search inputs and API calls.

**Features:**
- Configurable delay (default: 500ms)
- Type-safe with TypeScript generics
- Automatic cleanup on unmount

**Usage:**
```typescript
import { useDebounce } from '@/lib/hooks';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    // This will only run 500ms after user stops typing
    if (debouncedSearchTerm) {
      // Make API call with debouncedSearchTerm
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useAuth

Hook for authentication state and methods. Must be used within `AuthProvider`.

**Features:**
- Login/logout functionality
- Authentication state management
- Token and user data persistence
- Loading states

**Usage:**
```typescript
import { useAuth } from '@/lib/hooks';

function LoginComponent() {
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();
  
  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      // Redirect to dashboard
    } else {
      // Show error message
      console.error(result.error);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.nama}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### useToast

Hook for toast notification management. Must be used within `ToastProvider`.

**Features:**
- Multiple toast types (success, error, warning, info)
- Auto-dismiss with configurable duration
- Manual dismiss
- Convenience methods for each type

**Usage:**
```typescript
import { useToast } from '@/lib/hooks';

function MyComponent() {
  const toast = useToast();
  
  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };
  
  const handleError = () => {
    toast.error('Something went wrong!', 10000); // 10 seconds
  };
  
  const handleWarning = () => {
    toast.warning('Please be careful!');
  };
  
  const handleInfo = () => {
    toast.info('Here is some information');
  };
  
  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

## Context Providers

### AuthProvider

Wrap your application with `AuthProvider` to enable authentication functionality.

```typescript
import { AuthProvider } from '@/lib/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### ToastProvider

Wrap your application with `ToastProvider` to enable toast notifications.

```typescript
import { ToastProvider } from '@/lib/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Combined Usage

You can combine multiple providers:

```typescript
import { AuthProvider, ToastProvider } from '@/lib/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Architecture

### Separation of Concerns

- **Hooks**: Provide React state management and side effects
- **Context**: Manage global state and provide it to components
- **API Layer**: Handle HTTP requests and data fetching (separate from hooks)

### No Duplication

- `useAuth` uses existing `authApi` functions from `lib/api/auth.ts`
- `useLocalStorage` is a generic hook used by `useAuth` internally
- Each hook has a single responsibility

### Type Safety

All hooks are fully typed with TypeScript for better developer experience and compile-time safety.

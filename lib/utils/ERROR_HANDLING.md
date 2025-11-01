# Error Handling System

This document describes the error handling architecture implemented in the application.

## Overview

The error handling system provides comprehensive error management across the application with the following components:

1. **Logger** - Centralized logging utility
2. **Error Messages** - User-friendly error message mapping
3. **Global Error Handler** - Catches uncaught errors and unhandled promise rejections
4. **Error Boundary** - React component for catching rendering errors
5. **Next.js Error Pages** - Custom error pages for Next.js

## Architecture

### 1. Logger (`lib/utils/logger.ts`)

Centralized logging system with different log levels:

```typescript
import { logger } from '@/lib/utils/logger';

// Log levels
logger.debug('Debug message', { context: 'data' }); // Only in development
logger.info('Info message', { context: 'data' });
logger.warn('Warning message', { context: 'data' });
logger.error('Error message', error, { context: 'data' });
```

**Features:**
- Structured logging with timestamps
- Context data support
- Error stack traces
- Development vs production modes
- Placeholder for external logging service integration (Sentry, LogRocket, etc.)

### 2. Error Messages (`lib/utils/errorMessages.ts`)

Maps technical errors to user-friendly messages:

```typescript
import { getUserFriendlyMessage, ERROR_MESSAGES } from '@/lib/utils/errorMessages';

// Get user-friendly message from error
const message = getUserFriendlyMessage(error);

// Get message from HTTP status code
const message = getUserFriendlyMessage(404);

// Use predefined messages
const message = ERROR_MESSAGES.NETWORK_ERROR;
```

**Features:**
- HTTP status code mapping
- Error type detection (network, auth, validation)
- Indonesian language messages
- Fallback messages

### 3. Global Error Handler (`lib/utils/globalErrorHandler.ts`)

Catches uncaught errors and unhandled promise rejections:

```typescript
import { globalErrorHandler } from '@/lib/utils/globalErrorHandler';

// Initialize (done automatically in root layout)
globalErrorHandler.initialize((message, error) => {
  // Show toast notification
  showToast('error', message);
});

// Cleanup (done automatically on unmount)
globalErrorHandler.cleanup();
```

**Features:**
- Window error event handling
- Unhandled promise rejection handling
- Integration with toast notifications
- Automatic logging

### 4. Error Boundary (`components/ErrorBoundary.tsx`)

React component for catching rendering errors:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Wrap components
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// With error callback
<ErrorBoundary onError={(error, errorInfo) => {
  // Custom error handling
}}>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches React rendering errors
- Displays user-friendly fallback UI
- Reset and reload functionality
- Development mode error details
- Automatic error logging

### 5. Next.js Error Pages

Custom error pages for Next.js:

- `app/error.tsx` - Handles errors in page components
- `app/global-error.tsx` - Handles errors in root layout

**Features:**
- Automatic error logging
- User-friendly error messages
- Reset and navigation actions
- Development mode error details

## Integration

The error handling system is integrated in the root layout:

```typescript
// app/layout.tsx
<ErrorBoundary>
  <AuthProvider>
    <ToastProvider>
      <ErrorHandlerProvider>
        {children}
      </ErrorHandlerProvider>
    </ToastProvider>
  </AuthProvider>
</ErrorBoundary>
```

**Order of providers:**
1. ErrorBoundary (outermost) - catches React errors
2. AuthProvider - provides auth context
3. ToastProvider - provides toast notifications
4. ErrorHandlerProvider - initializes global error handler

## API Client Integration

The API client automatically logs errors and provides user-friendly messages:

```typescript
// lib/api/client.ts
const response = await apiClient.get('/api/endpoint');

if (response.error) {
  // Error is already logged
  // Error message is already user-friendly
  showToast('error', response.error);
}
```

## Best Practices

### 1. Use Logger for All Logging

```typescript
// ❌ Don't use console.log directly
console.log('User logged in');

// ✅ Use logger
logger.info('User logged in', { userId: user.id });
```

### 2. Provide Context Data

```typescript
// ❌ Minimal context
logger.error('API failed', error);

// ✅ Rich context
logger.error('API failed', error, {
  endpoint: '/api/users',
  method: 'POST',
  userId: user.id,
});
```

### 3. Use User-Friendly Messages

```typescript
// ❌ Technical error message
showToast('error', 'ERR_CONNECTION_REFUSED');

// ✅ User-friendly message
showToast('error', getUserFriendlyMessage(error));
```

### 4. Wrap Risky Components

```typescript
// ❌ No error boundary
<ComplexComponent />

// ✅ With error boundary
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

### 5. Handle Async Errors

```typescript
// ❌ Unhandled promise rejection
fetchData(); // No .catch()

// ✅ Handled promise rejection
fetchData().catch(error => {
  logger.error('Failed to fetch data', error);
  showToast('error', getUserFriendlyMessage(error));
});

// ✅ Or use try-catch with async/await
try {
  await fetchData();
} catch (error) {
  logger.error('Failed to fetch data', error);
  showToast('error', getUserFriendlyMessage(error));
}
```

## Error Flow

### 1. API Error Flow

```
API Request → Error Occurs → API Client Logs Error → 
Returns User-Friendly Message → Component Shows Toast
```

### 2. React Error Flow

```
Component Error → Error Boundary Catches → Logs Error → 
Shows Fallback UI → User Can Reset or Reload
```

### 3. Global Error Flow

```
Uncaught Error → Global Handler Catches → Logs Error → 
Shows Toast Notification → User Sees Friendly Message
```

## Testing Error Handling

### Test Error Boundary

```typescript
// Throw error in component
throw new Error('Test error');
```

### Test Global Error Handler

```typescript
// Uncaught error
setTimeout(() => {
  throw new Error('Test uncaught error');
}, 1000);

// Unhandled promise rejection
Promise.reject(new Error('Test promise rejection'));
```

### Test API Error Handling

```typescript
// Trigger network error
await apiClient.get('/api/invalid-endpoint');
```

## Future Enhancements

1. **External Logging Service Integration**
   - Integrate with Sentry, LogRocket, or similar
   - Send errors to external service in production
   - Track error trends and patterns

2. **Error Analytics**
   - Track error frequency
   - Identify common error patterns
   - Monitor error resolution

3. **User Feedback**
   - Allow users to report errors
   - Collect additional context from users
   - Improve error messages based on feedback

4. **Retry Mechanisms**
   - Automatic retry for transient errors
   - Exponential backoff for API requests
   - User-initiated retry actions

## Troubleshooting

### Errors Not Being Logged

- Check if logger is imported correctly
- Verify NODE_ENV is set correctly
- Check browser console for any initialization errors

### Toast Not Showing for Errors

- Verify ToastProvider is in component tree
- Check if ErrorHandlerProvider is initialized
- Verify useToast hook is working

### Error Boundary Not Catching Errors

- Ensure ErrorBoundary wraps the component
- Check if error occurs during rendering (not in event handler)
- Verify ErrorBoundary is a class component

### Global Error Handler Not Working

- Check if initialized in root layout
- Verify window object is available (client-side only)
- Check browser console for initialization messages

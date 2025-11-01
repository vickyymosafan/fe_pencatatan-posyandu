# Utility Functions

This directory contains utility functions used across the application.

## Available Utilities

### Cookie Management (`cookies.ts`)

Helper functions for managing browser cookies. Used primarily for authentication state persistence.

**Functions:**

- `setCookie(name, value, days)` - Set a cookie with expiration
- `getCookie(name)` - Get a cookie value
- `deleteCookie(name)` - Delete a cookie
- `hasCookie(name)` - Check if a cookie exists

**Usage:**

```typescript
import { setCookie, getCookie, deleteCookie } from '@/lib/utils/cookies';

// Set a cookie
setCookie('theme', 'dark', 30); // Expires in 30 days

// Get a cookie
const theme = getCookie('theme');

// Delete a cookie
deleteCookie('theme');

// Check if cookie exists
if (hasCookie('auth')) {
  // User is authenticated
}
```

## Authentication Flow

The authentication system uses a dual-storage approach:

1. **localStorage**: Stores JWT token and user data for client-side API calls
2. **Cookies**: Stores authentication flag and user role for server-side middleware

### Why Both?

- **localStorage**: Fast client-side access, used by API client for Authorization headers
- **Cookies**: Accessible by Next.js middleware (runs on server), enables server-side route protection

### Security Considerations

- Cookies are set with `SameSite=Lax` to prevent CSRF attacks
- Cookies are not `httpOnly` because they need to be accessible by client-side JavaScript
- For production, consider using `httpOnly` cookies set by the backend for enhanced security
- JWT tokens should have short expiration times (e.g., 24 hours)

## Integration with Middleware

The middleware (`fe/middleware.ts`) reads the `auth` and `role` cookies to:

1. Protect routes from unauthenticated access
2. Implement role-based access control
3. Redirect users to appropriate dashboards

This provides a first layer of defense before the page even loads, improving security and user experience.

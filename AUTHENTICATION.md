# Authentication System

This document describes the authentication and authorization system implemented in the Posyandu Lansia frontend application.

## Architecture Overview

The authentication system uses a **defense-in-depth** approach with multiple layers:

1. **Server-side Middleware** (First Layer)
2. **Client-side Context** (Second Layer)
3. **Component Guards** (Third Layer)

## Components

### 1. Server-side Middleware (`middleware.ts`)

Runs on Next.js Edge runtime before any page renders.

**Responsibilities:**
- Check authentication status via cookies
- Redirect unauthenticated users to login
- Implement role-based access control
- Prevent unauthorized route access

**How it works:**
```typescript
// Reads cookies set during login
const authCookie = request.cookies.get('auth');
const roleCookie = request.cookies.get('role');

// Redirects based on authentication and role
if (!isAuthenticated && isProtectedRoute) {
  return NextResponse.redirect('/login');
}
```

### 2. Auth Context (`lib/context/AuthContext.tsx`)

React Context that manages authentication state on the client side.

**Responsibilities:**
- Store user data and token in state
- Provide login/logout methods
- Sync with localStorage and cookies
- Expose authentication status to components

**Usage:**
```typescript
import { useAuth } from '@/lib/hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state
}
```

### 3. Auth Guard Component (`components/auth/AuthGuard.tsx`)

Client-side component wrapper for protected content.

**Responsibilities:**
- Additional client-side verification
- Show loading states
- Handle role-based rendering
- Redirect if authentication fails

**Usage:**
```typescript
import { AuthGuard } from '@/components/auth';
import { Role } from '@/types';

export default function AdminPage() {
  return (
    <AuthGuard requiredRole={Role.ADMIN}>
      <AdminDashboard />
    </AuthGuard>
  );
}
```

## Authentication Flow

### Login Flow

1. User submits credentials on `/login` page
2. `AuthContext.login()` calls API endpoint
3. On success:
   - JWT token saved to localStorage
   - User data saved to localStorage
   - Auth flag saved to cookie (`auth=true`)
   - User role saved to cookie (`role=ADMIN|PETUGAS`)
4. User redirected to appropriate dashboard

```typescript
const { login } = useAuth();

const result = await login({ email, password });

if (result.success) {
  // Automatic redirect to dashboard
} else {
  // Show error message
  console.error(result.error);
}
```

### Logout Flow

1. User clicks logout button
2. `AuthContext.logout()` is called
3. Clears:
   - localStorage (token and user data)
   - Cookies (auth and role)
4. Redirects to `/login`

```typescript
const { logout } = useAuth();

logout(); // Clears everything and redirects
```

### Protected Route Access

1. User navigates to protected route (e.g., `/admin/dashboard`)
2. **Middleware** checks cookies:
   - If no `auth` cookie → redirect to `/login`
   - If wrong role → redirect to correct dashboard
3. Page loads with **AuthContext**:
   - Verifies token in localStorage
   - If invalid → logout and redirect
4. **AuthGuard** (if used):
   - Additional client-side check
   - Shows loading state
   - Renders content only if authorized

## Storage Strategy

### localStorage
- **Token**: JWT token for API authentication
- **User**: Complete user object (id, nama, email, role)
- **Purpose**: Client-side API calls
- **Accessible by**: Client-side JavaScript only

### Cookies
- **auth**: Boolean flag (`"true"` or absent)
- **role**: User role (`"ADMIN"` or `"PETUGAS"`)
- **Purpose**: Server-side middleware checks
- **Accessible by**: Both server and client
- **Expiration**: 7 days
- **Security**: `SameSite=Lax`

## Role-Based Access Control (RBAC)

### Roles

- **ADMIN**: Full access to admin routes
- **PETUGAS**: Access to petugas routes only

### Route Protection

| Route Pattern | ADMIN | PETUGAS |
|--------------|-------|---------|
| `/login` | ✅ (redirects to dashboard if logged in) | ✅ (redirects to dashboard if logged in) |
| `/admin/*` | ✅ | ❌ (redirects to `/petugas/dashboard`) |
| `/petugas/*` | ❌ (redirects to `/admin/dashboard`) | ✅ |

### Implementation

**Middleware Level:**
```typescript
// Automatic redirect based on role
if (userRole === 'ADMIN' && isPetugasRoute) {
  return NextResponse.redirect('/admin/dashboard');
}
```

**Component Level:**
```typescript
<AuthGuard requiredRole={Role.ADMIN}>
  {/* Only ADMIN can see this */}
</AuthGuard>
```

## Security Considerations

### Current Implementation

✅ **Implemented:**
- Dual storage (localStorage + cookies)
- Server-side route protection
- Client-side verification
- Role-based access control
- Automatic token cleanup on logout
- SameSite cookie protection

⚠️ **Limitations:**
- Cookies are not `httpOnly` (accessible by JavaScript)
- Token stored in localStorage (vulnerable to XSS)
- No token refresh mechanism

### Production Recommendations

For production deployment, consider:

1. **httpOnly Cookies**: Have backend set httpOnly cookies with JWT
2. **Token Refresh**: Implement refresh token mechanism
3. **CSRF Protection**: Add CSRF tokens for state-changing operations
4. **Rate Limiting**: Implement login attempt rate limiting
5. **Session Timeout**: Add automatic logout after inactivity
6. **Secure Flag**: Use `Secure` flag on cookies in production (HTTPS only)

## Troubleshooting

### User stuck on loading screen

**Cause**: Auth check is taking too long or failing silently

**Solution**: Check browser console for errors, verify API is running

### Redirects not working

**Cause**: Cookies not being set properly

**Solution**: 
1. Check browser cookies in DevTools
2. Verify `saveAuthData()` is called after login
3. Check middleware matcher configuration

### Role-based redirect loops

**Cause**: Role cookie doesn't match user's actual role

**Solution**:
1. Clear all cookies and localStorage
2. Login again
3. Verify role is correctly saved in both places

### Middleware not running

**Cause**: Route not matching middleware config

**Solution**: Check `middleware.ts` matcher configuration includes your route

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route without login
- [ ] Access admin route as petugas
- [ ] Access petugas route as admin
- [ ] Logout and verify cleanup
- [ ] Refresh page while logged in
- [ ] Open app in new tab (should stay logged in)

### Automated Testing

```typescript
// Example test for AuthContext
describe('AuthContext', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    const response = await result.current.login({
      email: 'admin@test.com',
      password: 'password123'
    });
    
    expect(response.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## API Integration

The authentication system integrates with the backend API:

### Endpoints Used

- `POST /api/auth/login` - User login
- Token included in `Authorization: Bearer <token>` header for all API calls

### Error Handling

- **401 Unauthorized**: Auto logout and redirect to login
- **403 Forbidden**: Show error toast
- **Network Error**: Show connection error toast

## Migration Guide

If you need to migrate from localStorage-only to cookie-based auth:

1. Update `lib/api/auth.ts` to use `saveAuthData()` (already done)
2. Create `middleware.ts` (already done)
3. Update `app/layout.tsx` to include providers (already done)
4. Test all authentication flows
5. Deploy middleware configuration

## Future Enhancements

Potential improvements for the authentication system:

- [ ] Implement refresh token mechanism
- [ ] Add "Remember Me" functionality
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add session management dashboard
- [ ] Implement device tracking
- [ ] Add password reset flow
- [ ] Implement account lockout after failed attempts
- [ ] Add audit logging for authentication events

# Login Page

Authentication page for the Posyandu Lansia application.

## Overview

The login page provides a secure authentication interface for both Admin and Petugas users. It features client-side validation, loading states, and automatic redirection based on user roles.

## Features

- **Centered Layout**: Form centered with max-width 400px
- **Client-side Validation**: Real-time email and password validation
- **Loading States**: Button shows loading spinner during authentication
- **Error Handling**: Toast notifications for errors
- **Auto Redirect**: Redirects to appropriate dashboard after successful login
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Full keyboard navigation and screen reader support

## Form Fields

### Email
- **Type**: email
- **Validation**: 
  - Required field
  - Valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Error Messages**:
  - "Email wajib diisi" (if empty)
  - "Format email tidak valid" (if invalid format)

### Password
- **Type**: password
- **Validation**:
  - Required field
  - Minimum 8 characters
- **Error Messages**:
  - "Password wajib diisi" (if empty)
  - "Password minimal 8 karakter" (if too short)

## User Flow

1. User navigates to `/login`
2. If already authenticated → redirect to dashboard
3. User enters email and password
4. Client-side validation runs on input change
5. User clicks "Login" button
6. Form submits to API via `useAuth().login()`
7. On success:
   - Toast notification: "Login berhasil!"
   - Redirect to `/admin/dashboard` or `/petugas/dashboard` based on role
8. On error:
   - Toast notification with error message from API
   - Form remains on page for retry

## Authentication Flow

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ├─ Already authenticated? ──Yes──> Redirect to dashboard
       │
       └─ No ──> Show login form
                      │
                      ├─ Submit credentials
                      │
                      ├─ Validate client-side
                      │
                      ├─ Call API /api/auth/login
                      │
                      ├─ Success? ──Yes──> Save token & user
                      │                    │
                      │                    └──> Redirect to dashboard
                      │
                      └─ No ──> Show error toast
```

## Integration

### Authentication Context

Uses `useAuth` hook from `@/lib/hooks`:

```typescript
const { login, isAuthenticated, user, isLoading } = useAuth();

const result = await login({ email, password });
```

### Toast Notifications

Uses `useToast` hook from `@/lib/hooks`:

```typescript
const toast = useToast();

toast.success('Login berhasil!');
toast.error('Login gagal. Silakan coba lagi.');
```

### UI Components

Uses components from `@/components/ui`:

```typescript
import { Input, Button, Card } from '@/components/ui';
```

## Validation Rules

### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Password Validation
- Minimum length: 8 characters
- No complexity requirements (for user convenience)

## Security Considerations

- **No Password Visibility Toggle**: For security, password remains hidden
- **Client-side Validation**: Reduces unnecessary API calls
- **Error Messages**: Generic messages to prevent user enumeration
- **HTTPS Required**: In production, always use HTTPS
- **Rate Limiting**: Should be implemented on backend

## Styling

Follows the design system:

- **Background**: neutral-50
- **Card**: White with custom shadow and rounded-xl
- **Inputs**: Neutral borders with focus rings
- **Button**: Primary variant (neutral-800)
- **Logo**: Neutral-800 background with white text
- **Typography**: Montserrat font family

## Accessibility

- **Keyboard Navigation**: Full tab navigation support
- **ARIA Labels**: Proper labels on all form fields
- **Error Announcements**: Errors announced to screen readers
- **Focus Management**: Logical focus order
- **Required Fields**: Marked with asterisk and aria-required

## Testing

### Manual Testing Checklist

- [ ] Page loads correctly
- [ ] Email validation works (empty, invalid format)
- [ ] Password validation works (empty, too short)
- [ ] Submit button disabled when validation fails
- [ ] Loading state shows during login
- [ ] Success toast appears on successful login
- [ ] Error toast appears on failed login
- [ ] Redirect works for Admin role
- [ ] Redirect works for Petugas role
- [ ] Already authenticated users are redirected
- [ ] Form is responsive on mobile
- [ ] Keyboard navigation works
- [ ] Screen reader announces errors

### Test Credentials

For testing, use credentials from your backend:

```
Admin:
- Email: admin@posyandu.com
- Password: admin123

Petugas:
- Email: petugas@posyandu.com
- Password: petugas123
```

## Troubleshooting

### Login button stays disabled
- Check that both email and password are valid
- Verify no validation errors exist
- Check browser console for errors

### Redirect not working
- Verify AuthContext is properly set up
- Check that token is saved to localStorage
- Verify middleware is configured correctly

### Toast not showing
- Ensure ToastProvider is in root layout
- Check ToastRenderer is rendered
- Verify useToast hook is working

### Validation not triggering
- Check that validation functions are called
- Verify state updates are working
- Check browser console for errors

## Future Enhancements

Potential improvements:

- [ ] Add "Remember Me" checkbox
- [ ] Add "Forgot Password" link
- [ ] Add password visibility toggle
- [ ] Add social login options
- [ ] Add CAPTCHA for security
- [ ] Add login attempt rate limiting
- [ ] Add "Show Password" button
- [ ] Add biometric authentication support

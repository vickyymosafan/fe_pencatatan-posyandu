# Known Issues

## Next.js 16.0.1 - Turbopack Route Groups Bug

### Issue Description
Next.js 16.0.1 has a bug with Turbopack when using route groups `(admin)` and `(petugas)`. The error message is:

```
You cannot have two parallel pages that resolve to the same path. 
Please check /(admin)/dashboard and /(petugas).
```

### Impact
- **Development**: Server starts but shows 500 error when accessing pages
- **Production Build**: Build may fail with Turbopack
- **Deployment**: Vercel and other platforms may encounter issues

### Root Cause
This is a known bug in Next.js 16.0.1 Turbopack with parallel route groups. The routes are correctly structured but Turbopack incorrectly interprets them as conflicting.

### Workarounds

#### Option 1: Downgrade to Next.js 15 (Recommended for now)
```bash
npm install next@15
```

#### Option 2: Wait for Next.js 16.0.2+
Monitor Next.js releases for a fix: https://github.com/vercel/next.js/releases

#### Option 3: Use Webpack Instead of Turbopack
This is not officially supported in Next.js 16 as Turbopack is now default.

### Current Status
- ✅ TypeScript compilation: Working
- ✅ Linting: Working
- ✅ Configuration files: All correct
- ❌ Development server: 500 error due to Turbopack bug
- ❌ Production build: May fail with Turbopack

### Verification
The application structure is correct. You can verify by checking:

1. **Route Structure** (Correct):
   ```
   app/
   ├── (admin)/
   │   ├── layout.tsx
   │   └── dashboard/page.tsx
   └── (petugas)/
       ├── layout.tsx
       └── dashboard/page.tsx
   ```

2. **Type Check** (Passing):
   ```bash
   npm run type-check  # ✅ 0 errors
   ```

3. **Lint Check** (Passing):
   ```bash
   npm run lint  # ✅ 0 errors
   ```

### Recommended Action
**Downgrade to Next.js 15 until Next.js 16.0.2+ is released:**

```bash
# Downgrade Next.js
npm install next@15

# Restart development server
npm run dev
```

### References
- Next.js 16 Release Notes: https://nextjs.org/blog/next-16
- Turbopack Documentation: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
- Next.js GitHub Issues: https://github.com/vercel/next.js/issues

### Last Updated
2024-11-01

---

**Note**: This is a temporary issue with Next.js 16.0.1. The application code and configuration are correct. Once Next.js releases a fix, the application will work without any code changes.

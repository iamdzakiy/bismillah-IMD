# Fix Login Issues & Other Problems

## Issues Found & Fixed:

- [x] **Issue 1: NEXTAUTH_URL hardcoded to production** - Changed from `https://imd-2026-gong.vercel.app` to `http://localhost:3000` for local dev. This was causing CSRF token mismatch errors when running locally.

- [x] **Issue 2: Missing `trustHost` in NextAuth config** - Added `trustHost: true` to NextAuth options. NextAuth v5 requires this when the request host doesn't match NEXTAUTH_URL. Without it, login would throw "Internal Server Error".

- [x] **Issue 3: `/dashboard` in middleware publicPaths** - Removed `/dashboard` and `/dashboard/` from public paths. Dashboard was exposed to unauthenticated users. Also added `/request-password-reset` and `/reset-password` as public paths.

- [x] **Issue 4: Missing `image` field in User model** - Added `image String?` field to Prisma User schema. The `@auth/prisma-adapter` expects this field for user profile images (especially from Google OAuth). Without it, Google sign-in would fail with adapter errors.

- [x] **Issue 5: Duplicate `emailVerified` field** - Removed the duplicate `emailVerified` declaration at the bottom of the User model (it was already defined at the top).

- [x] **Issue 6: Applied Prisma migration** - Created and applied migration `20260709235542_add_image_field` to sync the database schema.

## Build Status: ✅ PASSED (0 errors, 0 warnings)
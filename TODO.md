# IMD-2026 Auth Troubleshooting - TODO

- [ ] Step 1: Fix Google OAuth onboarding in `src/lib/auth.ts`
  - [ ] Create user row when missing
  - [ ] Auto-activate and mark emailVerified for Google users
- [ ] Step 2: Harden NextAuth JWT/session callbacks in `src/lib/auth.ts`
  - [ ] Ensure `token.active`, `token.role`, etc always set from DB or user
  - [ ] Avoid silent failures
- [ ] Step 3: Fix middleware issues in `src/middleware.ts`
  - [ ] Ensure `/api/auth/*` and NextAuth endpoints are public in middleware
  - [ ] Keep verify-email redirect logic but avoid breaking sign-in
- [ ] Step 4: Add full password reset flow
  - [ ] Add Prisma model + migration (ResetToken or reuse existing table)
  - [ ] Add `request-password-reset` API route
  - [ ] Add `reset-password` API route
  - [ ] Add email templates in `src/lib/email.ts`
  - [ ] Add UI pages/forms under `src/app/(auth)/`
- [ ] Step 5: Improve debugging
  - [ ] Add development-only logs for middleware + auth errors
- [ ] Step 6: Run verification checklist
  - [ ] Register -> verify-email -> login (credentials)
  - [ ] Google OAuth signup -> login
  - [ ] Password reset request -> reset -> login


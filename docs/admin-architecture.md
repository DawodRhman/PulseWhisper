# Admin & Auth Architecture

> **Note:** As of Nov 2025, TOTP is disabled in production builds; this section remains for the future MFA roadmap.

## 1. Authentication (Option A: Password + TOTP)
- Use **NextAuth v5** credentials provider with custom Prisma adapter.
- Login flow: email + password → verify hash → if `TotpSecret.verifiedAt` present, demand 6-digit TOTP code.
- First login without verified secret triggers enrollment modal showing QR (otpauth URI) generated via `speakeasy`. Secret stored encrypted with AES (key from `ADMIN_SECRET_KEY`).
- Sessions persisted in Prisma `Session` table and stored as HttpOnly cookies with SameSite=strict, 1h idle timeout + sliding refresh.
- Password policies: min length 12, uppercase/lowercase/digit/symbol, reuse blocked via `PasswordHistory` check, rotation every 90 days.
- Add rate limiting (e.g., Upstash/Redis or in-memory fallback) for login + TOTP endpoints (5 attempts / 5 minutes / IP+email) and lockout after 5 failures.

## 2. Authorization & RBAC
- `RoleType.ADMIN`: full-stack control including operators, media, settings, and audit trail visibility.
- `RoleType.EDITOR`: manages core content (services, news, projects, leadership, careers) but not users/tenders.
- `RoleType.MEDIA_MANAGER`: restricted to media uploads + social/settings tweaks.
- `RoleType.PROCUREMENT`: focused on tenders/procurement workflows only.
- `RoleType.HR`: owns the careers module.
- `RoleType.AUDITOR`: read-only access to audit history for compliance reviews.
- Middleware (`app/(protected)/layout.tsx`) reads session, fetches roles, injects `ability` object to components to toggle UI actions.
- API handlers enforce RBAC server-side via helper `assertPermission(user, action, resource)`.

## 3. Admin UI Structure (`/admin`)
- `/admin/login`: credentials + TOTP screens (public route with motion loader reused from site but simple theme).
- `/admin/dashboard`: KPIs (pending tenders, drafts, broken media, subscription counts) using cached queries.
- Nested routes using Next.js App Router parallel layouts:
  - `/admin/services`
  - `/admin/tenders`
  - `/admin/careers`
  - `/admin/news`
  - `/admin/media`
  - `/admin/leadership`
  - `/admin/faqs`
  - `/admin/settings` (SEO defaults, contact info, TOTP resets)
  - `/admin/audit-log`
- UI kit: shadcn/ui table, form, dialog, command palette. Reuse `components/ui/button.jsx` variants for consistency.
- Forms use `react-hook-form` + `zod` schemas, autosave drafts, diff preview before publish.

## 4. API & Data Access
- Implement RESTful handlers under `app/api/**/route.js` with pattern:
  - `GET /api/services` (public cacheable) → uses Prisma + `CachedSnapshot` fallback if DB unavailable.
  - `POST /api/admin/services` (protected) → writes DB, invalidates cache entry, logs audit.
- Shared utilities (`lib/api-response.js`, `lib/auth/permissions.js`, `lib/cache.ts`).
- Every write operation creates `AuditLog` record with actor, module, payload diff, IP/UA.
- Media uploads: admin UI only stores absolute URL pointing to org server; provide form field + validator pinging HEAD request to confirm reachability.
- SEO metadata automatically generated but editable; stored via `SeoMeta` model.

## 5. Security Hardening (OWASP Top 10)
- HttpOnly, Secure, SameSite cookies; `Helmet`-like headers using Next middleware (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- Input validation everywhere (zod). Sanitize rich text (DOMPurify server-side) before saving.
- Rate limiting for login, password reset, media validation.
- CSRf defense: since using same-site cookies, issue CSRF token for POST forms (double submit) even on API fetches from admin app.
- Strict logging & monitoring: pipe audit logs + auth failures to external SIEM webhook.
- Content versioning: store `updatedAt`, optionally keep `Revision` table (future work) for rollbacks.

## 6. Caching & Fallback Strategy
- Each public module fetch first from DB; after successful fetch, store normalized payload in `CachedSnapshot` with checksum.
- When API fails (Prisma throws), service catches and returns snapshot payload alongside `x-cache-status: STALE-SNAPSHOT` header so frontend can show stale banner.
- Incremental Static Regeneration not viable due to fully dynamic pages; use Next cache tags + `revalidateTag` after admin writes for per-module invalidation.

## 7. DevOps & Secrets
- `.env` additions:
  - `ADMIN_SECRET_KEY` (32-byte hex for TOTP encryption)
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - `COOKIE_NAME_ADMIN`, `RATE_LIMIT_REDIS_URL` (optional)
- Document key rotation procedure and fallback admin account kept offline.

This blueprint unblocks implementing secure auth, admin UI, APIs, and cache/fallback logic aligned with the new Prisma schema.

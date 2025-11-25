# Admin Implementation Roadmap

This document breaks down the next three milestones for the KW&SC admin portal: secure authentication, wiring CRUD panels to real APIs (with cache invalidation), and surfacing live audit logs.

---

> **Update (Nov 2025):** TOTP enforcement is temporarily disabled; the admin portal now relies on email + password while MFA is revisited.

## 1. Secure Admin Authentication (Password + TOTP + Server Sessions)

### 1.1 Data Model Extensions
- `UserCredential`: `userId`, `passwordHash`, `passwordSalt`, `algorithm`, `rotatedAt`.
- `TotpSecret`: `userId`, `secretEncrypted`, `verifiedAt`, `backupCodes (Json)`, `lastUsedAt`.
- `AdminSession`: `id`, `userId`, `tokenHash`, `ipAddress`, `userAgent`, `expiresAt`, `revokedAt`, `rememberDeviceUntil`.
- (Optional) `PasswordHistory`: `userId`, `passwordHash`, `createdAt` for reuse checks.

### 1.2 Authentication Flow
1. **Credentials submit** (`POST /api/admin/auth/credentials`)
   - Validate email/password using Zod.
   - Fetch user + `UserCredential`; verify hash with Argon2id/SCrypt.
   - Rate-limit by IP+email (5 attempts / 5 minutes) and log failures to `AuditLog`.
   - Response: `{ challengeId, requiresTotp }`.
2. **TOTP verify** (`POST /api/admin/auth/totp`)
   - Accept `challengeId`, `totp`, optional `rememberDevice` flag.
   - Look up encrypted secret, decrypt using `ADMIN_SECRET_KEY`, verify via `otplib`.
   - On success, create `AdminSession` (1h TTL, extend to 12h if rememberDevice true) and set HttpOnly cookie `admin_session` with signed session ID.
   - Emit `AuditLog` entry `ADMIN_LOGIN_SUCCESS`.
3. **Session hydration**
   - Middleware (`middleware.js`) inspects cookie, fetches session (join user + roles + permissions). If missing/expired, redirect to `/admin/login`.
   - Expose helper `getAdminSession()` for server components and API routes.
4. **Logout** (`POST /api/admin/auth/logout`)
   - Deletes session row + clears cookie.
5. **TOTP enrollment** (future): if user lacks `TotpSecret`, return `requiresEnrollment: true` and provide QR/backup codes before enabling access.

### 1.3 Frontend Changes
- Split `/admin` routes into `(auth)` and `(dashboard)` segments.
- Replace current placeholder `AdminLoginCard` with two-step form that calls credential + TOTP APIs, shows policy guidance, and refreshes router post-auth.
- Protect dashboard routes using server-side session check (e.g., `export const dynamic = "force-dynamic"` + `redirect()` if no session).
- Add global error banners for lockouts or MFA failures.

### 1.4 Security Controls
- Argon2id parameters tuned for server resources; rehash when settings change.
- Brute-force protection via Redis (if available) or in-memory fallback.
- All auth cookies: `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/admin`.
- CSRF token (double-submit) for every POST request from admin UI.
- Config flags in `.env`: `ADMIN_SESSION_NAME`, `ADMIN_SESSION_TTL`, `ADMIN_SECRET_KEY`.

---

## 2. Wiring Admin Panels to CRUD APIs + Cache Invalidation

### 2.1 API Surface
- Namespace protected endpoints under `/api/admin/*` with HTTP verbs reflecting actions.
- Example for services:
  - `GET /api/admin/services` – list categories, cards, resources.
  - `POST /api/admin/services/categories` – create new category.
  - `PATCH /api/admin/services/categories/:id` – update.
  - `DELETE /api/admin/services/categories/:id` – soft delete (set `archivedAt`).
  - Similar sets for cards, resources, tenders, careers, news.
- Each handler pipeline:
  1. `const session = await getAdminSessionOrThrow()`.
  2. `assertPermission(session, "services:write")` (per module).
  3. Validate body with shared Zod schema (e.g., `ServiceCardSchema`).
  4. Perform Prisma mutation inside transaction.
  5. Invalidate cache: `await prisma.cachedSnapshot.delete({ where: { module: SnapshotModule.SERVICES } })` (ignore-not-found) or call helper `purgeSnapshot(SERVICES)`.
  6. Emit audit log (see Section 3).
  7. Return normalized payload for immediate UI optimism.

### 2.2 Frontend Data Layer
- Use React Query / SWR inside admin components to fetch `/api/admin/...` endpoints with `fetch` carrying `credentials: "include"`.
- Local mutations optimistically update UI, then refetch upon success.
- Provide shared hooks:
  - `useAdminServices()` – lists categories/cards with create/update/delete mutators.
  - `useCacheStatus()` – shows when last snapshot refresh occurred.
- For file URLs, add utility `validateMediaUrl(url)` hitting HEAD request server-side before saving.

### 2.3 Cache Regency
- After mutation, call a background job (or simple `void revalidateModule("services")`) to repopulate the `CachedSnapshot` table so public site sees updates quickly.
- Track `lastPublishedAt` per module to show “stale since” indicators in admin shell.

---

## 3. Surfacing Live Audit Logs

### 3.1 AuditLog Writer
Every privileged API handler should create:
```ts
await prisma.auditLog.create({
  data: {
    module: AuditModule.SERVICES,
    action: "SERVICE_CARD_UPDATE",
    recordId: payload.id,
    diff: buildDiff(oldRecord, newRecord),
    actorId: session.user.id,
    ipAddress: session.ip,
    userAgent: request.headers.get("user-agent"),
  },
});
```
- `buildDiff` helper stores before/after snapshots trimmed to changed fields.
- On errors, still log attempts with `action: "*_FAILED"`.

### 3.2 API & UI Consumption
- Endpoint: `GET /api/admin/audit?module=SERVICES&page=1&pageSize=20` with pagination + filtering (module, actor, severity).
- Optional SSE/WebSocket upgrade in future; initial implementation can poll every 30s.
- In `AdminShell` audit panel:
  - Replace placeholder list with data table showing action, actor email, resource link, timestamp, and clickable diff modal.
  - Add filters + search bar.
  - Highlight high-severity events (e.g., deletions, failed logins) with color badges.

### 3.3 Alerting & Export
- Add button “Export last 24h” that hits `GET /api/admin/audit/export.csv` for compliance snapshots.
- Configure webhook to push critical actions to external SIEM/Teams channel once infrastructure is available.

---

## Deliverables Checklist
- [ ] Prisma migrations for auth tables (`UserCredential`, `TotpSecret`, `AdminSession`, optional `PasswordHistory`).
- [ ] Auth API routes + middleware + client flow wired to `/admin` routes.
- [ ] Protected CRUD endpoints with cache invalidation + optimistic admin UI.
- [ ] Audit log writes integrated into every mutation + public API fallbacks unchanged.
- [ ] Audit panel consuming live data with filters + diff modal.

This roadmap can be tackled sequentially: auth foundation → CRUD wiring → audit surfacing. Each milestone keeps the portal aligned with the OWASP-grade requirements and the existing snapshot caching strategy.

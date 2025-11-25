# Prisma Schema Plan

> Target: replace all hardcoded content (home, tenders, careers, news, about, what we do, FAQs, etc.) with normalized Postgres tables, power `/admin` CMS, attach SEO metadata, media references, audit logs, and cached fallbacks when upstream APIs fail.

## 1. Core Utility Tables
- `MediaAsset`: references files already hosted on the org server (store absolute URL, checksum, mime, dimensions, alt text, category).
- `SeoMeta`: reusable SEO blobs (title, description, keywords, og tags, canonical, structuredData JSON, index/noindex flags).
- `CachedSnapshot`: JSON payload per module storing last-successful API response with checksum + expiresAt for graceful fallback rendering.

> MFA/TOTP is paused for now; schema notes remain for later reintroduction.

## 2. Auth & RBAC (Option A: Password + TOTP)
- `User`: account info (name, email unique, phone, hashedPassword, status, lastLoginAt, adminNotes).
- `Role`: enum-like table (`ADMIN`, `EDITOR`). Many-to-many `UserRole` for extensibility.
- `Session`: opaque token storage (sessionToken, userId, expiresAt, userAgent, ip).
- `TotpSecret`: per-user secret (encryptedSecret, verifiedAt).
- `PasswordHistory` (optional) for reuse prevention.
- `AuditLog`: stores action, module, recordId, diff JSON, actorId, ip, userAgent.

## 3. Content Domains
### 3.1 Services / What We Do
- `ServiceCategory` (e.g., Water Supply, Sewerage, Revenue).
- `ServiceCard` (title, summary, icon key, gradient class, order, categoryId, seoId, heroImage).
- `ServiceDetail` for rich text/markdown sections (e.g., sources, filtration, revenue guidelines) with optional media links.
- `DownloadResource` for PDF links (connection guidelines, maps) referencing `MediaAsset`.

### 3.2 Tenders
- `TenderCategory` (Open, Closed, Cancelled, Upcoming).
- `Tender`: tenderNo, title, description, publishDate, dueDate, status, attachments[] -> `TenderAttachment` join referencing `MediaAsset`, plus SEO.

### 3.3 Careers & Work With Us
- `CareerProgram` (Management Trainee, Internship, etc.) with hero copy, eligibility bullet list.
- `CareerOpening`: role title, department, location, jobType, qualifications[], responsibilities[], salaryRange, applyLink/email, seoId, status (Draft/Published/Archived), publishAt, expireAt.
- `Benefit`: list of perks (title, description, icon key).
- `ContactChannel`: HR contacts, phone/email, office hours.

### 3.4 News & Media
- `NewsCategory`, `NewsTag` (many-to-many `NewsTagMap`).
- `NewsArticle`: slug, title, subtitle, summary, content (rich text/JSON), publishedAt, hero media, status, seoId.
- `MediaAlbum` + `MediaItem` for gallery images/videos (url, caption, credit, order, seoId).

### 3.5 Leadership & About
- `LeadershipMember`: name, designation, bio, portrait, priority, social links JSON, seoId.
- `Achievement`: title, description, metric, icon.
- `TimelineEvent` (if needed) for history.
- `FAQCategory` & `FAQ` records.
- `WorkflowStep`, `CounterStat`, `ProjectHighlight` for homepage components.

### 3.6 Contact / RTI / Misc
- `OfficeLocation`: address, lat/lng, contact numbers, office type.
- `RightToInformationDoc`: title, description, media link, seoId.
- `EducationResource`, `WaterTodayUpdate`, `SubscribeList` (newsletter subscribers), `FeedbackSubmission` etc.

## 4. Relationships Overview
```
User --< Session
User --< TotpSecret
User --< AuditLog
User >--< Role (UserRole)
ServiceCategory --< ServiceCard --< ServiceDetail
SeoMeta 1:1 optional with most public tables (ServiceCard, Tender, CareerOpening, NewsArticle, LeadershipMember, MediaAlbum, RightToInformationDoc, etc.)
MediaAsset referenced by any entity needing imagery or downloadable files
Tender --< TenderAttachment >-- MediaAsset
NewsArticle >--< NewsTag via NewsTagMap
CareerOpening --< CareerRequirement (type enum: QUALIFICATION/RESPONSIBILITY)
FAQCategory --< FAQ
MediaAlbum --< MediaItem
```

## 5. Seed Strategy
- Extract existing arrays from React components and create JSON seed files (e.g., `seed/tenders.json`).
- Use Prisma seed script (`prisma/seed.ts`) to insert: service cards, tender data, careers, news, leadership, FAQ, stats, etc., linking default SEO entries derived from current page headings.
- Insert default admin/editor users with temporary passwords + enforced TOTP setup on first login.

## 6. Migration & Runtime Notes
- Schema path already configured to output client into `lib/generated/prisma` to keep Next tree-shaking clean.
- Use PostgreSQL enums for statuses (TenderStatus, PublicationStatus, RoleType) to simplify validation.
- Add row-level `updatedAt` triggers via Prisma `@updatedAt` fields for caching invalidation.
- Cached snapshots should store `module` enum + `payload` JSONB to survive API disruptions.
- Consider partitioning large audit log tables later; initial schema keeps simple indexes on `(module, createdAt)` and `(actorId, createdAt)`.

This plan feeds the upcoming Prisma schema implementation and ensures every frontend component has a normalized backing model plus SEO, caching, and audit coverage.

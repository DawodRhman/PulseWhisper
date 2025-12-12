# Cookie Consent System Documentation

This document explains how the Cookie Consent system works in the KWSC website and why cookies matter for the site.

## Overview
- The Cookie Consent banner asks visitors for permission to use cookies; it appears 1 second after mount only when no prior choice is found.
- User choice is stored in both a first-party cookie and localStorage for resilience across sessions and storage clearing.
- Key/value: `cookie-consent` set to `accepted` or `declined`.
- Cookie attributes: `path=/`, `max-age=31536000` (1 year), `SameSite=Lax`, `Secure` when served over HTTPS.
- The component lives in `components/CookieConsent.jsx` and is mounted globally from `app/layout.js`.

## Common Cookie Uses on the Site
- State/session: login sessions (`session_id`), shopping cart contents, per-visit preferences.
- Personalization: language/region selection, theme (dark/light mode), recently viewed items.
- Tracking/analytics: page visits, navigation paths, returning vs new users, advertising and attribution.
- Security: session validation, CSRF protection tokens, fraud detection signals.

## Components

### 1. `CookieConsent.jsx` (`components/CookieConsent.jsx`)
Main component that handles banner logic and UI.

**Key Features**
- State management: `isVisible` controls banner visibility with a 1-second delayed reveal.
- Persistence: reads/writes `cookie-consent` into a browser cookie (primary) and localStorage (fallback).
- Sync: if a cookie exists but localStorage is empty, the value is synced into localStorage.
- Animations: Tailwind classes `animate-in`, `slide-in-from-bottom-10`, `fade-in`.

**Logic Flow**
1. On mount, check the `cookie-consent` cookie, then localStorage.
2. If a value exists, keep the banner hidden and sync the cookie value into localStorage if missing.
3. If no value exists, show the banner after a 1-second delay.
4. Accept: set cookie + localStorage to `accepted`, hide banner.
5. Decline: set cookie + localStorage to `declined`, hide banner.

### 2. Integration (`app/layout.js`)
Mounted globally so every page has the banner:
```javascript
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* ... */}
        <CookieConsent />
      </body>
    </html>
  );
}
```

## Testing
- To reset the banner, clear both the `cookie-consent` cookie and the `cookie-consent` item in localStorage, then refresh.
- Verify that Accept/Decline sets both storage locations and the banner stays hidden on reload.

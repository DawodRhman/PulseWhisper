# Frontend Design Guide for KWSC Dynamic Website

This documentation explains how to modify the design, styling, and layout of your Next.js application. Since your website uses a **Dynamic Page Builder**, changing the design involves understanding how the database content maps to your code components.

## 1. Architecture Overview

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Dynamic Pages**: Routes like `/about`, `/services`, etc., are handled by `app/[...slug]/page.js`.
- **Page Builder**: The content for these pages is stored in the database as "blocks" (e.g., HERO, SERVICES, TEXT_BLOCK). These blocks are rendered by `components/PageBuilder/PageRenderer.jsx`.

---

## 2. Global Styling (Colors, Fonts, Defaults)

To change the overall look and feel of the site (theme), you work with two main files:

### A. Tailwind Configuration (`tailwind.config.mjs`)
This file defines your design tokens (colors, fonts, animations).

**To add a new color:**
1. Open `tailwind.config.mjs`.
2. Inside `theme.extend.colors`, add your color:
   ```javascript
   colors: {
     brand: {
       light: '#4da6ff',
       DEFAULT: '#0066cc',
       dark: '#004d99',
     },
     // ... existing colors
   }
   ```
3. Use it in your components: `className="bg-brand text-brand-light"`.

### B. Global CSS (`app/globals.css`)
Use this file for:
- CSS Variables (e.g., `--background`, `--foreground`).
- Global styles that apply to `<body>` or all headings.
- Importing fonts.

---

## 3. Modifying Dynamic Pages

Your pages are built dynamically. This means you don't edit `app/about/page.js` directly because it doesn't exist. Instead, the system fetches data and decides which component to show.

**To change the design of a specific section:**

1. **Identify the Component**: Look at `components/PageBuilder/PageRenderer.jsx`. This file maps database block types to React components.

   ```javascript
   // Example from PageRenderer.jsx
   const COMPONENT_MAP = {
     HERO: GenericHero,       // -> components/PageBuilder/GenericHero.jsx
     SERVICES: Services,      // -> components/Services.jsx
     PROJECTS: Projects,      // -> components/Projects.jsx
     // ...
   };
   ```

2. **Edit the Component**:
   - **Hero Section**: Edit `components/PageBuilder/GenericHero.jsx`. Changes here will update the Hero section on *every* page that uses it.
   - **Services Section**: Edit `components/Services.jsx`.
   - **Text Content**: Edit the `TextBlock` component inside `PageRenderer.jsx`.

### Example: Changing the Hero Section Design
If you want to change the font size of the main title on all pages:
1. Open `components/PageBuilder/GenericHero.jsx`.
2. Find the `<h1>` tag.
3. Change the Tailwind classes (e.g., change `text-4xl` to `text-6xl` or `font-bold` to `font-extrabold`).

---

## 4. Modifying Static Layouts (Navbar & Footer)

Elements that appear on every page are defined in the Root Layout.

- **File**: `app/layout.js`
- **Navbar**: Edit `components/Navbar.jsx`.
- **Footer**: Edit `components/Footer.jsx`.

**Tip**: If you change the height of the Navbar, make sure to check if the top of your pages needs more padding (`pt-20`, etc.) to prevent content from being hidden behind it.

---

## 5. Creating New Design Blocks

If you want a completely new design section (e.g., a "Testimonials" slider) that you can add to pages via the Admin Panel:

1. **Create the Component**:
   Create `components/Testimonials.jsx` and style it as desired.

2. **Register in Page Renderer**:
   Open `components/PageBuilder/PageRenderer.jsx`:
   ```javascript
   import Testimonials from "@/components/Testimonials";

   const COMPONENT_MAP = {
     // ... existing maps
     TESTIMONIALS: Testimonials, // Add this line
   };
   ```

3. **Update Database/Admin**:
   Ensure your database schema and Admin Panel allow you to select "TESTIMONIALS" as a block type.

---

## 6. Troubleshooting Styles

- **Changes not showing?**
  - If you are running `npm run dev`, Next.js usually hot-reloads. If it gets stuck, restart the terminal.
  - If you changed `tailwind.config.mjs`, you **must** restart the server.

- **Tailwind classes not working?**
  - Ensure the file you are editing is included in the `content` array in `tailwind.config.mjs`.
  - Example: If you added a new folder `components/NewFolder/`, make sure the config looks like `"./components/**/*.{js,ts,jsx,tsx}"`.

## Summary Checklist

| I want to change... | File to Edit |
|---------------------|--------------|
| **Colors / Fonts** | `tailwind.config.mjs` |
| **Logo / Menu** | `components/Navbar.jsx` |
| **Footer Links** | `components/Footer.jsx` |
| **Page Hero / Banner** | `components/PageBuilder/GenericHero.jsx` |
| **Services Section** | `components/Services.jsx` |
| **Standard Text** | `TextBlock` in `PageRenderer.jsx` |
| **Global CSS** | `app/globals.css` |

# Dynamic Content & Page Builder Manual

This document explains how the dynamic content system works in the KWSC application, including how to manage pages, sections, and extend the system with new components.

## 1. System Overview

The application uses a **Page Builder** architecture to render dynamic pages based on database content.

*   **Routing**: `app/[...slug]/page.js` catches all routes that are not statically defined.
*   **Data Fetching**: It fetches page data from the database (via Prisma) using the URL slug.
*   **Rendering**: The `PageRenderer` component iterates through the page's sections and renders the corresponding React component for each section type.
*   **Caching**: Pages are cached in the file system (`data/cache/pages`) to reduce database load.

## 2. Data Structure

The system relies on two main database models defined in `prisma/schema.prisma`:

### Page
Represents a single URL route.
*   `slug`: The URL path (e.g., `about-us` or `services/water-supply`).
*   `title`: Internal title for the page.
*   `isPublished`: If false, the page returns a 404.
*   `sections`: A list of content sections that make up the page.

### PageSection
Represents a horizontal block of content on a page.
*   `type`: Identifies which component to render (e.g., `HERO`, `TEXT_BLOCK`).
*   `order`: Determines the vertical position of the section.
*   `content`: A JSON object containing the data/props passed to the component.

## 3. Available Section Types

The `PageRenderer` (`components/PageBuilder/PageRenderer.jsx`) maps these types to React components:

| Section Type | Component | Description |
| :--- | :--- | :--- |
| `HERO` | `GenericHero` | Top banner with title, subtitle, and background image. |
| `TEXT_BLOCK` | `TextBlock` | Rich text content. Can render HTML. |
| `SERVICES` | `Services` | Displays a grid/list of services. |
| `PROJECTS` | `Projects` | Displays a grid/list of projects. |
| `LEADERSHIP` | `OurLeadership` | Displays leadership team members. |
| `FAQ` | `Faqs` | Accordion list of FAQs. |
| `MEDIA_GALLERY` | `MediaGallery` | Grid of images/videos. |
| `SUBSCRIBE` | `Subscribe` | Newsletter subscription form. |
| `CAREERS` | `Career` | List of job openings. |
| `TENDERS` | `Tenders` | List of active tenders. |
| `CONTACT` | `Contact` | Contact form and info. |
| `...` | ... | See `PageRenderer.jsx` for full list. |

## 4. Creating a New Page (Example)

To create a page, you need to insert a record into the `Page` table and associated `PageSection` records.

**Example JSON Data Structure:**

```json
{
  "slug": "new-page",
  "title": "My New Dynamic Page",
  "isPublished": true,
  "sections": [
    {
      "type": "HERO",
      "order": 0,
      "content": {
        "title": "Welcome to the New Page",
        "subtitle": "This is a dynamically generated section",
        "backgroundImage": "/media/hero-bg.jpg"
      }
    },
    {
      "type": "TEXT_BLOCK",
      "order": 1,
      "content": {
        "heading": "About This Section",
        "body": "<p>This is some <strong>HTML content</strong> rendered dynamically.</p>"
      }
    }
  ]
}
```

## 5. Adding a New Component to the Page Builder

To add a completely new type of section (e.g., a "TestimonialSlider"):

### Step 1: Create the Component
Create your React component in `components/TestimonialSlider.jsx`.

```jsx
// components/TestimonialSlider.jsx
import React from 'react';

const TestimonialSlider = ({ testimonials }) => {
  return (
    <section className="py-10">
      {testimonials.map((t, i) => (
        <div key={i} className="testimonial">
          <p>"{t.quote}"</p>
          <span>- {t.author}</span>
        </div>
      ))}
    </section>
  );
};

export default TestimonialSlider;
```

### Step 2: Register in PageRenderer
Open `components/PageBuilder/PageRenderer.jsx`.

1.  **Import** your new component:
    ```javascript
    import TestimonialSlider from "@/components/TestimonialSlider";
    ```

2.  **Add to COMPONENT_MAP**:
    ```javascript
    const COMPONENT_MAP = {
      // ... existing mappings
      TESTIMONIALS: TestimonialSlider, 
    };
    ```

### Step 3: Use it in the Database
Now you can create a `PageSection` with `type: "TESTIMONIALS"` and the matching content:

```json
{
  "type": "TESTIMONIALS",
  "content": {
    "testimonials": [
      { "quote": "Great service!", "author": "Jane Doe" },
      { "quote": "Highly recommended.", "author": "John Smith" }
    ]
  }
}
```

## 6. Caching & Performance

*   **File Cache**: Pages are cached as JSON files in `data/cache/pages`.
*   **Revalidation**: If you update a page in the database, the cache needs to be invalidated or updated. The `getPageWithFallback` function handles reading/writing to this cache.
*   **Dynamic Rendering**: The `app/[...slug]/page.js` is set to `force-dynamic` to ensure it checks for fresh data on each request (which then checks the cache/DB).

## 7. Troubleshooting

*   **404 Not Found**: 
    *   Check if the `slug` exists in the `Page` table.
    *   Check if `isPublished` is set to `true`.
*   **Component Not Rendering**:
    *   Check if the `type` in the database matches the key in `COMPONENT_MAP` exactly.
    *   Check if the `content` JSON structure matches the props expected by the React component.

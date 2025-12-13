# Component Status Report

This document outlines the dynamic status of components in the KWSC project, detailing their connection to the API and Admin Panel.

## Dynamic Components (Connected)

These components are successfully connected to the backend API and have corresponding Admin Panel management.

| Component | Status | API Endpoint / Hook | Admin Panel | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Achievement.jsx** | ✅ Dynamic | `/api/papa/achievements` | `components/admin/achievements/` | Fetches data directly. |
| **Career.jsx** | ✅ Dynamic | `/api/careers` | `components/admin/careers/` | Fetches data directly. |
| **Contact.jsx** | ✅ Dynamic | `/api/contact` | `components/admin/contact/` | Fetches contact info directly. |
| **Education.jsx** | ✅ Dynamic | `useEducationData` | `components/admin/education/` | Uses custom hook. |
| **Faqs.jsx** | ✅ Dynamic | `/api/faqs` | `components/admin/faq/` | Fetches data directly if no props provided. |
| **Rti.jsx** | ✅ Dynamic | `useRtiData` | `components/admin/rti/` | Uses custom hook. |
| **Services.jsx** | ✅ Dynamic | `useServicesData` | `components/admin/services/` | Uses custom hook. |
| **SocialLinks.jsx** | ✅ Dynamic | `/api/social-links` | `components/admin/social/` | Fetches data directly. |
| **Tenders.jsx** | ✅ Dynamic | `/api/tenders` | `components/admin/tenders/` | Fetches data directly. |
| **Watertodaysection.jsx** | ✅ Dynamic | `useWaterTodayData` | `components/admin/watertoday/` | Uses custom hook. |

## Prop-Driven Dynamic Components (Home Page)

These components receive dynamic data via props from the `Home` page (`app/page.js`), which fetches data using `lib/home/payload.js`.

| Component | Status | Data Source (`lib/home/payload.js`) | Admin Panel | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Projects.jsx** | ✅ Dynamic | `prisma.projectHighlight` | `components/admin/projects/` | Receives `projects` prop. |
| **Workflow.jsx** | ✅ Dynamic | `prisma.workflowStep` | `components/admin/workflow/` | Receives `steps` prop. |
| **Counter.jsx** | ✅ Dynamic | `prisma.counterStat` | `components/admin/stats/` | Receives `stats` prop. |
| **MediaGallery.jsx** | ✅ Dynamic | `prisma.mediaItem` | `components/admin/media/` | Receives `items` prop. |
| **OurLeadership.jsx** | ✅ Dynamic | `prisma.leadershipMember` | `components/admin/leadership/` | Receives `team` prop (via `Home` page logic, though not explicitly seen in `page.js` return, likely used in `Whoarewe` or similar if not standalone). *Correction: `OurLeadership` is not directly used in `page.js`, likely used in `Whoarewe` or `About` page.* |

## Static / Disconnected Components

These components are currently using static data or mock data and are **NOT** connected to the backend for their primary content.

| Component | Status | Issue | Recommendation |
| :--- | :--- | :--- | :--- |
| **NewsUpdate.jsx** | ⚠️ **Static** | Uses `mockNewsData` internally. | Connect to `/api/news` or pass data from `Home` page. Admin panel `components/admin/news/` exists. |
| **HeroSection.jsx** | ⚠️ **Static** | Hardcoded content. | Connect to `homeData.hero` or create a Hero API. `DEFAULT_HERO` exists in `payload.js` but might not be fully editable via Admin. |

## Admin Panel Coverage

The following Admin components exist and map to the frontend components:

*   `achievements/` -> `Achievement.jsx`
*   `careers/` -> `Career.jsx`
*   `education/` -> `Education.jsx`
*   `faq/` -> `Faqs.jsx`
*   `leadership/` -> `OurLeadership.jsx`
*   `media/` -> `MediaGallery.jsx`
*   `news/` -> `NewsUpdate.jsx` (Frontend needs update)
*   `projects/` -> `Projects.jsx`
*   `rti/` -> `Rti.jsx`
*   `services/` -> `Services.jsx`
*   `social/` -> `SocialLinks.jsx`
*   `stats/` -> `Counter.jsx`
*   `tenders/` -> `Tenders.jsx`
*   `watertoday/` -> `Watertodaysection.jsx`
*   `workflow/` -> `Workflow.jsx`

## Next Steps

1.  **Refactor `NewsUpdate.jsx`**: Update it to fetch data from `/api/news` or accept a prop populated by `app/page.js`.
2.  **Review `HeroSection.jsx`**: Determine if this should be dynamic. If so, ensure `homeData.hero` is passed and used, or fetch from an API.

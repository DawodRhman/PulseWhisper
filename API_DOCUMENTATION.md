# KWSC API Documentation

This document outlines the available API endpoints in the KWSC application. The API is primarily used to fetch dynamic content for the frontend pages, ensuring that content can be managed via the Admin Panel and served efficiently with caching strategies.

## Base URL
All API endpoints are relative to the base URL of the application (e.g., `/api/...`).

## Response Format
Most `GET` endpoints follow a standard response structure:

```json
{
  "data": {
    "hero": { ... },
    "seo": { ... },
    "content": [ ... ]
  },
  "meta": {
    "stale": boolean // Indicates if the data was served from cache
  }
}
```

---

## Endpoints

### 1. Services
**Endpoint**: `/api/services`
**Method**: `GET`
**Description**: Fetches content for the Services page, including the hero section, service categories, and detailed service cards.

**Response Data**:
- `hero`: Title, subtitle, background image.
- `categories`: List of service categories (e.g., Water, Sewerage).
  - `cards`: List of services within the category.
    - `details`: Detailed breakdown of the service.

### 2. News
**Endpoint**: `/api/news`
**Method**: `GET`
**Description**: Fetches the latest news articles and categories.

**Response Data**:
- `hero`: Hero section content.
- `categories`: News categories.
- `articles`: List of news articles with tags and media.

### 3. Contact
**Endpoint**: `/api/contact`
**Method**: `GET`
**Description**: Fetches contact information, including support channels and office locations.

**Response Data**:
- `hero`: Hero section content.
- `channels`: List of contact channels (Helpline, Email, etc.).
- `offices`: List of regional offices with coordinates for maps.

### 4. Careers
**Endpoint**: `/api/careers`
**Method**: `GET`
**Description**: Fetches job openings and career programs.

**Response Data**:
- `hero`: Hero section content.
- `programs`: Career programs/departments.
- `openings`: Active job listings.

### 5. Job Applications
**Endpoint**: `/api/applications`

#### GET
**Description**: Fetches a list of submitted job applications (Admin use).
**Query Params**: `careerOpeningId` (optional)

#### POST
**Description**: Submits a new job application.
**Content-Type**: `multipart/form-data`
**Body**:
- `fullName`: Text
- `fatherName`: Text
- `cnic`: Text
- `dob`: Date
- `education`: Text
- `email`: Email
- `phone`: Phone
- `coverLetter`: Text
- `careerOpeningId`: UUID
- `resume`: File (PDF, max 5MB)

### 6. Tenders
**Endpoint**: `/api/tenders`
**Method**: `GET`
**Description**: Fetches active and archived tenders.

**Response Data**:
- `hero`: Hero section content.
- `categories`: Tender categories.
- `tenders`: List of tenders with download links.

### 7. FAQs
**Endpoint**: `/api/faqs`
**Method**: `GET`
**Description**: Fetches Frequently Asked Questions, grouped by category.

**Response Data**:
- `categories`: List of FAQ categories with their associated FAQs.
- `uncategorized`: List of FAQs that do not belong to any category.

### 8. Home
**Endpoint**: `/api/home`
**Method**: `GET`
**Description**: Fetches content for the landing page, including slider images, stats, and featured sections.

---

## Caching Strategy
The API uses a snapshot-based caching mechanism (`resolveWithSnapshot`).
- **Fresh Data**: If the database is accessible, it returns fresh data and updates the cache.
- **Stale Data**: If the database is unreachable or slow, it may return cached data (indicated by `meta.stale: true`).
- **Fallback**: If no data is available, it falls back to static content defined in the code.

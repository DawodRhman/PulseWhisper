# Admin Portal: Dynamic Code & Data Section Manual

This guide explains how to use the **"Dynamic Code & Data"** section type within the Page Builder in the Admin Portal. This powerful feature allows you to fetch data from any internal API and render it using a custom HTML template, without writing new React components.

## 1. Adding the Section

1.  Navigate to the **Pages** section in the Admin Portal.
2.  Create a new page or edit an existing one.
3.  In the **Content Sections** area, click the button labeled **Dynamic Code & Data**.
4.  A new card will appear in the list of sections.

## 2. Configuration Fields

The "Dynamic Code & Data" section has four main configuration fields:

### A. Data Source (API)
This determines *where* the data comes from.
*   **Select an API**: Choose from the dropdown list of known APIs (e.g., News, Services, Projects).
*   **Custom URL**: If you select "Custom URL...", you can type any internal API endpoint (e.g., `/api/my-custom-data`).
*   **Expected Format**: The API should return a JSON object with a `data` array, or a direct array of objects.

### B. Item Template (HTML)
This defines *how* each item from the data source should look.
*   **HTML Support**: You can write standard HTML tags (`div`, `h3`, `img`, `p`, `span`, etc.).
*   **Data Binding**: Use double curly braces `{{fieldName}}` to insert data from the API response.
    *   Example: If your API returns objects like `{ "title": "Water Project", "status": "Active" }`, you can write:
        ```html
        <h3>{{title}}</h3>
        <span class="badge">{{status}}</span>
        ```
*   **Images**: You can bind image URLs to `src` attributes:
    ```html
    <img src="{{imageUrl}}" alt="{{title}}" class="w-full h-48 object-cover" />
    ```

### C. Container CSS Classes
These classes apply to the *parent* element that wraps all the items.
*   **Usage**: Use this to define the layout (grid, flexbox, spacing).
*   **Example (3-column grid)**:
    ```css
    grid grid-cols-1 md:grid-cols-3 gap-6 py-8
    ```

### D. Item Wrapper CSS Classes
These classes apply to the `div` that wraps *each individual item*.
*   **Usage**: Use this for card styling (background, border, shadow, padding).
*   **Example**:
    ```css
    bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow
    ```

## 3. Practical Examples

### Example 1: Simple News List

**Data Source**: `/api/news`

**Container Classes**: `space-y-4`

**Item Wrapper Classes**: `border-b pb-4`

**Item Template**:
```html
<div class="flex justify-between items-center">
  <h4 class="text-lg font-bold text-blue-900">{{title}}</h4>
  <span class="text-sm text-gray-500">{{publishedAt}}</span>
</div>
<p class="text-gray-700 mt-2">{{summary}}</p>
<a href="/news/{{slug}}" class="text-blue-600 hover:underline text-sm">Read more &rarr;</a>
```

---

### Example 2: Team Grid

**Data Source**: `/api/leadership`

**Container Classes**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`

**Item Wrapper Classes**: `bg-gray-50 rounded-xl overflow-hidden text-center`

**Item Template**:
```html
<div class="h-48 overflow-hidden">
  <img src="{{image}}" alt="{{name}}" class="w-full h-full object-cover" />
</div>
<div class="p-4">
  <h3 class="font-bold text-lg">{{name}}</h3>
  <p class="text-blue-600 text-sm uppercase tracking-wide">{{designation}}</p>
</div>
```

## 4. Troubleshooting

*   **Data Not Showing**:
    *   Check if the API URL is correct and returning data (try opening it in a new browser tab).
    *   Ensure your field names in `{{...}}` match exactly what the API returns (case-sensitive).
*   **Broken Layout**:
    *   Check your Tailwind classes in the Container and Item Wrapper fields.
    *   Ensure your HTML tags in the template are properly closed.
*   **Images Broken**:
    *   Verify that the `{{imageUrl}}` field actually contains a valid URL path.

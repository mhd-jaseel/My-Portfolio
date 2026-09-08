# Validation & Error Handling System Overview

A robust, production-grade validation and centralized error-handling architecture has been implemented across both the **Public** and **Admin** layers of the portfolio.

---

## 1. Backend Validation Middleware Layer ([`server/middleware/validateMiddleware.js`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/server/middleware/validateMiddleware.js))
- **Parameter & ID Validation (`validateObjectId`)**:
  - Validates MongoDB ObjectIds (`req.params.id`) before execution. Rejects malformed IDs immediately with `400 Bad Request` instead of crashing Mongoose.
- **Query Parameter Safety (`validateQueryParams`)**:
  - Clamps query `page` and `limit` boundaries (prevents excessive memory consumption or negative numbers).
- **Public Contact Message (`validateContactMessage`)**:
  - Requires non-empty trimmed strings for `name`, `email`, and `message`.
  - Enforces strict email RFC regex format and character limits (e.g. 5000 chars max).
- **Admin Login Validation (`validateLoginInput`)**:
  - Rejects empty, whitespace-only, or invalid email formats prior to credential lookup.
- **Project CMS Validation (`validateProjectInput`)**:
  - Enforces required trimmed title (2–120 chars), valid URL slug generation, category, thumbnail URL, validated GitHub/Live URLs, and numerical display bounds (0–100).
- **Skill & Category Validation (`validateCategoryInput`, `validateSkillInput`)**:
  - Validates category references (`ObjectId`), trimmed unique naming, and clamps proficiency values strictly to `0–100%`.

---

## 2. Centralized Error Handling ([`server/server.js`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/server/server.js))
- **File Upload Limits & Multer Errors**: Intercepts `LIMIT_FILE_SIZE` and returns friendly `400` errors ("File size exceeds the allowed limit (100MB max)").
- **Mongoose Duplicate Key Errors (`E11000`)**: Converts raw duplicate key exceptions into clean `409 Conflict` responses (e.g. *"An item with this slug already exists"*).
- **Mongoose Cast Errors**: Returns `400 Bad Request` without exposing internal schema paths or stack traces.
- **Production Information Shielding**: When running in `production`, all unexpected 500-level errors return clean fallback messages without leaking system paths or environmental variables.

---

## 3. Frontend Error Handling & UI Boundaries
- **Global Error Boundary ([`client/src/components/ErrorBoundary.jsx`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/client/src/components/ErrorBoundary.jsx))**:
  - Catches unexpected React component rendering crashes and provides an isolated recovery view with a "Try Again" action without crashing the entire app shell.
- **SweetAlert2 UI System ([`client/src/utils/alertUtils.js`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/client/src/utils/alertUtils.js))**:
  - Centralized error response parser handling HTTP 400, 401, 403, 404, 409, 422, and 500 status codes, network disconnects, and field-specific validation warnings.
  - Confirmation modals (`showConfirm`) for all destructive operations (Delete / Remove / Replace).
  - Toast alerts for non-blocking feedback (`toastSuccess`, `toastError`).
- **Form Submission Protection**:
  - Submit buttons disable and show spinners (`isSubmitting` / `saving`) across Admin and Contact forms to prevent double-click duplicate API requests.

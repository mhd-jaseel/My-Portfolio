# Work Experience Management System

The Work Experience section on the About page is now fully manageable directly from the Admin Panel, **while strictly preserving 100% of the visual 3-column table design, typography, spacing, and borders**.

---

## 1. Public About Page Updates ([`ExperienceSection.jsx`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/client/src/components/ExperienceSection.jsx))
- **Removed Year Label**: Completely eliminated the `"2025–2026"` label above the `WORK EXPERIENCE` heading, leaving clean and balanced spacing.
- **Dynamic 3-Column Table**:
  - Left column: Company / Organization name (`uppercase`)
  - Center column: Role / Designation
  - Right column: Timeline / Duration
- **Ordering**: Always displays entries in `displayOrder ASC`.
- **Active State Filtering**: Only active items (`isActive: true`) are displayed on the public page.

---

## 2. Admin Management Features ([`AdminExperiencePage.jsx`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/client/src/pages/admin/AdminExperiencePage.jsx))
- **Full CRUD Capabilities**:
  - **Add Experience**: Add milestones with Company, Role, Duration (e.g. `2025 – PRESENT`), and Display Order.
  - **Edit Experience**: Inline modification of any milestone.
  - **Delete with SweetAlert2 Confirmation**: Confirmation modal before destructive deletion.
  - **Show / Hide Toggle**: Instant active toggle (`Active: ON / OFF`) with toast notifications without deleting records.
- **Display Order**: Precise numerical order configuration.

---

## 3. Database Architecture ([`Experience.js`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/server/models/Experience.js))
- Schema fields:
  - `company` (String, required)
  - `position` (String, required)
  - `duration` (String, default: `'2025 – PRESENT'`)
  - `order` (Number, default: `0`)
  - `isActive` (Boolean, default: `true`)
- Preserved all 3 existing canonical milestones:
  1. `FUTURE BY CATALYST` &bull; `FULL STACK DEVELOPER (MERN)` &bull; `2025 – PRESENT` (Order: `1`)
  2. `ENTERPRISE E-COMMERCE` &bull; `SYSTEM ARCHITECT & DEV` &bull; `2025` (Order: `2`)
  3. `REAL-TIME BOOKING CMS` &bull; `FULL STACK ENGINEER` &bull; `2024 – 2025` (Order: `3`)

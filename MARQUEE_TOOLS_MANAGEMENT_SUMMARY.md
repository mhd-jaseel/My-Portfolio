# Marquee Tools CMS Management System

The existing Tools/Tech Stack moving marquee on the Home page is now fully manageable directly from the Admin Panel.

---

## 1. Database & Schema Architecture
- **Schema Fields Reused**:
  - `name` (String, required, trimmed)
  - `icon` (String, supports Lucide/Preset names or direct uploaded image/SVG URLs)
  - `displayOrder` (Number, controls ordering `ASC` in the marquee)
  - `showInMarquee` (Boolean, controls visibility in the moving strip)
  - `isActive` (Boolean, controls public active state)
  - `category` (ObjectId ref `SkillCategory`)
- **Existing Seed Data Preserved**: Existing tools (`JavaScript`, `GitHub`, `Render`, `Vercel`, `Cloudinary`, `VS Code`, `Postman`, `Figma`) remain intact in the database as live records.

---

## 2. Admin Management Features ([`AdminSkillsPage.jsx`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/client/src/pages/admin/AdminSkillsPage.jsx))
- **Dedicated Marquee Tools Management Tab**:
  - Displays all active marquee tools with real-time visual preview icons, display order tags, active status badges, and quick toggles.
- **"+ Add Tool" Modal**:
  - Add new marquee tools with custom name, display order number, and category association.
- **Icon Upload & Live Preview**:
  - Allows uploading local image/SVG files (`SVG`, `PNG`, `JPG`, `WebP`) with Sharp optimization or entering preset icon names.
  - Live preview box shows exactly how the icon will appear inside the blue marquee container.
- **Edit & Replace Icon**:
  - Inline edit mode allows replacing icons or updating names/orders without creating duplicate records.
- **Delete with Confirmation**:
  - Prompts with SweetAlert2 modal before destructive removal.
- **Instant Show / Hide**:
  - Quick "Hide from Strip" and "+ Add to Marquee" buttons to toggle `showInMarquee` status immediately with toast notifications.

---

## 3. Public Home Marquee ([`PinkTechStrip.jsx`](file:///c:/Users/HP%20ZBook%20Power%20G7/OneDrive/Desktop/jaseel%20portfolio/client/src/components/PinkTechStrip.jsx))
- **Dynamic Endpoint**: Connects to `/api/marquee-tools` with `.sort({ displayOrder: 1 })`.
- **Hybrid Icon Renderer**: Renders preset vector glyphs or uploaded image URLs seamlessly with high contrast (`brightness-0 invert`).
- **Infinite Loop**: Continues to use GPU-composited pure CSS `@keyframes marquee-scroll` with duplicated track sets for zero gap, zero flicker, and continuous 60fps Right $\rightarrow$ Left motion.

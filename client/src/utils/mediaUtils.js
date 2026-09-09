/**
 * Utility to safely resolve public media URLs (images, videos, SVGs, documents)
 * across local development and production deployments (Vercel <-> Render).
 *
 * Handles:
 * 1. Absolute URLs (Cloudinary, Unsplash, HTTPS external URLs, data URLs) -> Returned as-is.
 * 2. Relative upload paths (/uploads/... or uploads/...) -> Prefixes with backend server origin.
 * 3. Static public frontend assets (/favicon.svg) -> Preserved on Vercel frontend.
 * 4. Falsy/undefined values -> Returns safe fallback or empty string.
 */

export const DEFAULT_FALLBACK_IMAGE = '';

// Extract backend origin from VITE_API_URL (e.g. "https://my-portfolio-api-ajt6.onrender.com")
export const getBackendOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    // In local dev without VITE_API_URL, relative requests go to current origin (or Vite proxy)
    return '';
  }
  const clean = apiUrl.trim().replace(/\/+$/, '');
  // Remove trailing /api if present to get server origin
  return clean.replace(/\/api$/, '');
};

/**
 * Safely resolves media URLs (Cloudinary HTTPS, Unsplash, local backend uploads, or static assets)
 * Explicitly rejects and blocks any legacy development placeholders.
 */
export const getMediaUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return fallback;
  }

  // Strictly block any legacy development placeholder images
  if (trimmed.includes('developer_hero') || trimmed.includes('hero.png')) {
    return '';
  }

  // 1. Data URLs or full HTTP/HTTPS URLs (Cloudinary, Unsplash, external assets)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // 2. Local uploads stored on backend server (/uploads/... or uploads/...)
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const origin = getBackendOrigin();
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    if (origin) {
      return `${origin}${cleanPath}`;
    }
    return cleanPath;
  }

  // 3. Frontend static public assets (e.g. /favicon.svg)
  return trimmed;
};

/**
 * Reusable image onError event handler to prevent broken image icons and layout breakage
 */
export const handleImageError = (e) => {
  if (e?.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.style.display = 'none';
  }
};

export default getMediaUrl;


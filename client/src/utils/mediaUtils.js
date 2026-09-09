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

// Shared session-level tracker of image URLs that have loaded successfully in the browser
export const globalLoadedImageUrls = new Set();

export const markImageLoaded = (url) => {
  if (url && typeof url === 'string') {
    globalLoadedImageUrls.add(url);
  }
};

export const isImageLoaded = (url) => {
  if (!url || typeof url !== 'string') return false;
  return globalLoadedImageUrls.has(url);
};

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
 * Optimizes image URLs for faster delivery, smaller payload, modern formats (WebP/AVIF),
 * and high-DPI sharpness (2x / 3x Retina displays).
 * - Cloudinary: Injects automated format selection (f_auto), intelligent compression (q_auto:good),
 *   and dimension limit (w_${width},c_limit) WITHOUT cropping or distorting the artwork.
 * - Unsplash: Applies parameters (w, q, auto=format, fit=max) to strictly PRESERVE the entire
 *   aspect ratio and NEVER crop poster artwork.
 * - Leaves local uploads and static SVGs intact.
 */
export const getOptimizedMediaUrl = (url, options = {}) => {
  const resolved = getMediaUrl(url, '');
  if (!resolved || typeof resolved !== 'string') return '';

  const { width = 1600, quality = 85 } = options;

  // 1. Cloudinary Optimization (Dynamic delivery)
  if (resolved.includes('cloudinary.com') && resolved.includes('/image/upload/')) {
    // If it already has transformation flags, return as-is
    if (resolved.match(/\/image\/upload\/[a-z]_[a-z0-9_,]+\//)) {
      return resolved;
    }
    const transform = `f_auto,q_auto:good,w_${width},c_limit`;
    return resolved.replace('/image/upload/', `/image/upload/${transform}/`);
  }

  // 2. Unsplash Optimization (Query params with fit=max so entire poster is NEVER cropped)
  if (resolved.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(resolved);
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('q', quality.toString());
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'max');
      return urlObj.toString();
    } catch {
      return resolved;
    }
  }

  return resolved;
};

/**
 * Generates responsive high-DPI srcset (640w, 1024w, 1600w) for crisp rendering
 * on both mobile 2x/3x Retina viewports and high-res desktop monitors.
 */
export const getImageSrcSet = (url, options = {}) => {
  const resolved = getMediaUrl(url, '');
  if (!resolved || typeof resolved !== 'string') return undefined;

  if (
    resolved.includes('images.unsplash.com') ||
    (resolved.includes('cloudinary.com') && resolved.includes('/image/upload/'))
  ) {
    const q = options.quality || 85;
    const s640 = getOptimizedMediaUrl(resolved, { width: 640, quality: q });
    const s1024 = getOptimizedMediaUrl(resolved, { width: 1024, quality: q });
    const s1600 = getOptimizedMediaUrl(resolved, { width: 1600, quality: q });
    return `${s640} 640w, ${s1024} 1024w, ${s1600} 1600w`;
  }

  return undefined;
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



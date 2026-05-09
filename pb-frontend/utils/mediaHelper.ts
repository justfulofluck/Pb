import { API_BASE_URL } from '../config';

/**
 * Smart URL resolver for media assets.
 * Handles:
 * 1. Absolute URLs (starts with http/https)
 * 2. Data URLs (Base64)
 * 3. Relative paths from the API (prepends API_BASE_URL)
 * 4. Empty/null values
 */
export const getMediaUrl = (path: string | null | undefined): string => {
  if (!path || typeof path !== 'string') return '';
  
  const trimmedPath = path.trim();

  // 1. Handle absolute URLs and already-valid data URLs
  if (trimmedPath.startsWith('http') || trimmedPath.startsWith('data:')) {
    return trimmedPath;
  }

  // 2. Handle raw SVG or XML (common in some fields)
  if (trimmedPath.startsWith('<svg') || trimmedPath.startsWith('<?xml')) {
    // If it's a raw SVG, we might want to return it as a data URI if needed, 
    // but for now, we return as-is if the consumer expects raw SVG.
    return trimmedPath;
  }

  // 3. SAFETY CHECK: Prevent 414 Request-URI Too Long
  // If the path is extremely long but isn't an absolute URL or data URI,
  // it's likely raw binary/base64 data accidentally being passed as a path.
  // We MUST NOT return this as a relative path as it will trigger a 414 error.
  if (trimmedPath.length > 1000) {
    console.warn('getMediaUrl: Received an unusually long path. Potential 414 error prevented.', trimmedPath.substring(0, 50) + '...');
    // If it looks like base64 but lacks the prefix, we can try to add it, 
    // but usually, it's safer to return empty or a placeholder if it's unexpected.
    return ''; 
  }

  // 4. Handle frontend assets (public folder)
  if (trimmedPath.startsWith('/assets/') || trimmedPath.startsWith('/logos/') || trimmedPath.startsWith('/3D-assets/')) {
    return trimmedPath;
  }

  // 5. Build relative path for backend media
  let finalPath = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
  
  // Ensure /media/ prefix for DB-stored relative paths
  if (!finalPath.startsWith('/media/') && 
      !finalPath.startsWith('/assets/') && 
      !finalPath.startsWith('/logos/') && 
      !finalPath.startsWith('/3D-assets/')) {
    finalPath = `/media${finalPath}`;
  }

  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}${finalPath}`;
};

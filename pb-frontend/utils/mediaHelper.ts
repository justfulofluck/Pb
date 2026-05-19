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
  
  let trimmedPath = path.trim();

  // Strip leading slash or /media/ prefix if it was prepended to a base64 string
  let testPath = trimmedPath;
  if (testPath.startsWith('/media/')) {
    testPath = testPath.slice(7);
  } else if (testPath.startsWith('media/')) {
    testPath = testPath.slice(6);
  } else if (testPath.startsWith('/')) {
    testPath = testPath.slice(1);
  }

  // Handle data URLs (both raw, URL encoded, or with /media/ prepended)
  // Try all detection methods: raw prefix, URL-encoded prefix, or full decode check
  const tryDecodeDataUrl = (str: string): string | null => {
    if (str.startsWith('data:')) {
      try { return decodeURIComponent(str); } catch { return str; }
    }
    const lower = str.toLowerCase();
    if (lower.startsWith('data%3a')) {
      try { return decodeURIComponent(str); } catch { return str; }
    }
    // Fallback: fully decode and check
    try {
      const decoded = decodeURIComponent(str);
      if (decoded.startsWith('data:')) return decoded;
    } catch { /* ignore */ }
    return null;
  };
  const dataResult = tryDecodeDataUrl(testPath);
  if (dataResult) return dataResult;

  // 1. Handle absolute URLs — detect mistakenly stored data URLs and fix them
  if (trimmedPath.startsWith('http')) {
    try {
      const url = new URL(trimmedPath);
      // Check if path starts with /media/data%3A (URL-encoded base64 data stored as file)
      if (url.pathname.toLowerCase().includes('/media/data%3a') || url.pathname.toLowerCase().includes('/media/data:')) {
        const mediaIndex = url.pathname.indexOf('/media/');
        if (mediaIndex !== -1) {
          const encodedPart = url.pathname.slice(mediaIndex + 7);
          try {
            return decodeURIComponent(encodedPart);
          } catch {
            return encodedPart;
          }
        }
      }
      if (url.hostname === 'localhost') {
        const correct = new URL(API_BASE_URL);
        url.hostname = correct.hostname;
        url.port = correct.port;
        return url.toString();
      }
    } catch {
      // invalid URL, fall through
    }
    return trimmedPath;
  }

  // 2. Handle raw SVG or XML (common in some fields)
  if (trimmedPath.startsWith('<svg') || trimmedPath.startsWith('<?xml')) {
    return trimmedPath;
  }

  // 3. SAFETY CHECK: Prevent 414 Request-URI Too Long
  // If the path is extremely long but isn't an absolute URL or data URI,
  // it's likely raw binary/base64 data accidentally being passed as a path.
  if (trimmedPath.length > 1000) {
    console.warn('getMediaUrl: Received an unusually long path. Potential 414 error prevented.', trimmedPath.substring(0, 50) + '...');
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

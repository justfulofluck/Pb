const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // Fallback: use the current page origin (protocol + hostname + port).
  // In dev mode, this points to the Vite dev server (port 3000), which
  // proxies /api and /media to Django on port 8000 — no hardcoded IP needed.
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

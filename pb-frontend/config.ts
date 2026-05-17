const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Dynamically use the current host (IP or domain)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Use HTTPS if current page is loaded over HTTPS, otherwise use HTTP
    // Don't assume port 8000 - let the environment or standard ports handle it
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    return `${protocol}://${hostname}`;
  }
  
  // Fallback for SSR or testing
  return 'http://localhost';
};

export const API_BASE_URL = getApiBaseUrl();

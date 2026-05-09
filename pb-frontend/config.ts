const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // Dynamically use the current host (IP or domain) but always point to backend port 8000
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000`;
  }
  
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

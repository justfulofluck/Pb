import { API_BASE_URL } from '../config';

const ADMIN_ACCESS_KEY = 'admin_access_token';
const ADMIN_REFRESH_KEY = 'admin_refresh_token';

function getToken(): string | null {
  return localStorage.getItem(ADMIN_ACCESS_KEY);
}

async function refreshToken(): Promise<string | null> {
  const refresh = localStorage.getItem(ADMIN_REFRESH_KEY);
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem(ADMIN_ACCESS_KEY, data.access);
    if (data.refresh) {
      localStorage.setItem(ADMIN_REFRESH_KEY, data.refresh);
    }
    return data.access;
  } catch {
    return null;
  }
}

function triggerLogout() {
  localStorage.removeItem(ADMIN_ACCESS_KEY);
  localStorage.removeItem(ADMIN_REFRESH_KEY);
  window.dispatchEvent(new CustomEvent('admin:logout'));
}

export async function adminApiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  if (!token) {
    triggerLogout();
    throw new Error('No admin token found');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers });
    } else {
      triggerLogout();
      throw new Error('Admin session expired');
    }
  }

  return res;
}

export async function adminApiFetchWithFallback(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const adminToken = getToken();
  const token = adminToken || localStorage.getItem('access_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && adminToken) {
    const newToken = await refreshToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers });
    } else {
      triggerLogout();
      throw new Error('Admin session expired');
    }
  }

  return res;
}

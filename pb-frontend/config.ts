export const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8003'
    : `http://${window.location.hostname}:8003`;

import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL;
  if (!url) return '/api'; // Fallback for local proxy
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),

  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
// Note: We are using httpOnly cookies, so we don't need to attach token manually for most cases if configured correctly.
// However, if we were using localstorage, we would do it here.
// But since the user requirements said "JWT auth", often people mean localStorage + Bearer header for MERN.
// I will implement localStorage for simplicity as it's easier to debug for students/MERN projects than HttpOnly cookies which require secure flag on https etc.
// Wait, my backend implementation of `sendTokenResponse` used cookies AND json response with token.
// So I will use the token from localStorage to be safe for cross-domain or local dev without https bits.

// Check for token in localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;

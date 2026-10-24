// Set VITE_API_BASE_URL to the URL of the deployed blogs-back API.
// Vite exposes variables prefixed with VITE_ to the browser (never put secrets there).
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')
export default API_BASE_URL

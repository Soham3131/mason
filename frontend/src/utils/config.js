const isProd = import.meta.env.MODE === 'production';
let apiUrl = import.meta.env.VITE_API_URL;

if (isProd && apiUrl && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'))) {
  apiUrl = 'https://mason-jo50.onrender.com/api/v1';
}

let resolvedUrl = (apiUrl || (isProd ? 'https://mason-jo50.onrender.com/api/v1' : 'http://localhost:5050/api/v1')).trim().replace(/\/+$/, '');

// Automatically ensure /api/v1 suffix is present to prevent 404 errors
if (!resolvedUrl.endsWith('/api/v1')) {
  resolvedUrl = `${resolvedUrl}/api/v1`;
}

const VITE_API_URL = resolvedUrl;
export default VITE_API_URL;


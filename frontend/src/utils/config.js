const isProd = import.meta.env.MODE === 'production';
let apiUrl = import.meta.env.VITE_API_URL;

if (isProd && apiUrl && (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1'))) {
  console.warn('VITE_API_URL points to localhost in production mode! Please configure your live Render backend URL on Vercel.');
}

const VITE_API_URL = (apiUrl || (isProd ? 'https://mason-6c8l.onrender.com/api/v1' : 'http://localhost:5050/api/v1')).replace(/\/+$/, '');
export default VITE_API_URL;

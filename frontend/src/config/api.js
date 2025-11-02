// API Configuration - Tự động detect Local vs Production

// Tự động chọn API URL dựa vào hostname
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// 💻 LOCAL DEVELOPMENT
const LOCAL_API_URL = 'http://localhost:3000';

// 🌐 PRODUCTION (Render.com)
const PRODUCTION_API_URL = 'https://group10-project.onrender.com';

// Tự động chọn
export const API_BASE_URL = isLocalhost ? LOCAL_API_URL : PRODUCTION_API_URL;

console.log(`🌐 API Mode: ${isLocalhost ? '💻 LOCAL' : '🚀 PRODUCTION'}`);
console.log(`📡 API URL: ${API_BASE_URL}`);

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  AUTH_FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  AUTH_RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // Profile
  PROFILE: `${API_BASE_URL}/api/profile`,
  PROFILE_UPLOAD_AVATAR: `${API_BASE_URL}/api/profile/upload-avatar`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  
  // Admin
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_DELETE_USER: (id) => `${API_BASE_URL}/api/admin/users/${id}`,
  ADMIN_CHANGE_ROLE: (id) => `${API_BASE_URL}/api/admin/users/${id}/role`,
};

export default API_BASE_URL;


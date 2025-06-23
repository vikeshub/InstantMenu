// src/api/apiList.js

// Main API domain (reusable)
export const API_DOMAIN = "http://localhost:3000";

// All API endpoints
export const API_LIST = {
  LOGIN: `${API_DOMAIN}/api/auth/login`,
  REGISTER: `${API_DOMAIN}/api/auth/register`,
  USER_PROFILE: `${API_DOMAIN}/api/user/profile`,
  // Add more endpoints as needed
};

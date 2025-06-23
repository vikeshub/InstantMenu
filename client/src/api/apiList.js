// src/api/apiList.js

// Main API domain (reusable)
export const API_DOMAIN = "http://localhost:3000";

// All API endpoints
export const API_LIST = {
  LOGIN: `${API_DOMAIN}/api/auth/login`,
  REGISTER: `${API_DOMAIN}/api/auth/register`,
  USER_PROFILE: `${API_DOMAIN}/api/user/profile`,
  // Restaurant APIs
  RESTAURANT_REGISTER: `${API_DOMAIN}/api/restaurant/register`,
  RESTAURANT_LOGIN: `${API_DOMAIN}/api/restaurant/login`,
  RESTAURANT_PROFILE: `${API_DOMAIN}/api/restaurant/profile`, // GET/PUT
  // Add more endpoints as needed
};

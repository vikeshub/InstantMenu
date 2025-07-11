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

  // Menu APIs
  MENUS_BY_RESTAURANT: (restaurantId) => `${API_DOMAIN}/api/menus/restaurant/${restaurantId}`,
  ADD_MENU: `${API_DOMAIN}/api/menus`,
  EDIT_MENU: (id) => `${API_DOMAIN}/api/menus/${id}`,
  DELETE_MENU: (id) => `${API_DOMAIN}/api/menus/${id}`,
  TOGGLE_MENU: (id) => `${API_DOMAIN}/api/menus/${id}/toggle-active`,
  // Menu Item APIs
  MENUITEMS_BY_MENU: (menuId) => `${API_DOMAIN}/api/menuitems/menu/${menuId}`,
  GET_MENUITEM: (itemId) => `${API_DOMAIN}/api/menuitems/${itemId}`,
  ADD_MENUITEM: (menuId) => `${API_DOMAIN}/api/menuitems/${menuId}`,
  UPDATE_MENUITEM: (menuId, itemId) => `${API_DOMAIN}/api/menuitems/${menuId}/${itemId}`,
  DELETE_MENUITEM: (menuId, itemId) => `${API_DOMAIN}/api/menuitems/${menuId}/${itemId}`,
  // Add more endpoints as needed
};

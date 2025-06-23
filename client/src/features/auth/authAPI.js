import { API_LIST } from "../../api/apiList";

// Example API calls for authentication
export const loginAPI = async (credentials) => {
  const response = await fetch(API_LIST.LOGIN, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return response.json();
};

export const registerAPI = async (userInfo) => {
  const response = await fetch(API_LIST.REGISTER, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return response.json();
};

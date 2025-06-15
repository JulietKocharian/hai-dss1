import axios from 'axios';

const API_BASE_URL = `https://gateway.amracode.am/api/v1/`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const data = response.data;

    // Store token if provided
    if (data.token || data.accessToken) {
      const token = data.token || data.accessToken;
      localStorage.setItem('authToken', token);
      
      // Store user data if provided
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);

    const data = response.data;

    // Store token if provided
    if (data.token || data.accessToken) {
      const token = data.token || data.accessToken;
      localStorage.setItem('authToken', token);
      
      // Store user data if provided
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(errorMessage);
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Get stored user data
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Get auth headers for API requests
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Default export with all functions
const authService = {
  login,
  register,
  logout,
  getToken,
  getUserData,
  isAuthenticated,
  getAuthHeaders,
};

export default authService;
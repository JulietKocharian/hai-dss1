import axios from 'axios';

const API_BASE_URL = `https://gateway.amracode.am/api/v1/`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Endpoints that don't need authentication
const noAuthEndpoints = [
  '/auth/login',
  '/auth/register', 
  '/auth/forgotPassword',
  '/auth/verifyContact',
  '/auth/newPassword',
  '/auth/refresh'
];

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Simple JWT expiration check without jwt-decode library
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decodedToken = JSON.parse(jsonPayload);
    const currentTime = Date.now() / 1000;
    
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Refresh token function
export const refreshToken = async (refreshTokenValue) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}auth/refresh-tokens`,
      {
        refreshToken: refreshTokenValue,
      }
    );

    // Store tokens in localStorage if received
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
    }

    if (response.data.refresh) {
      localStorage.setItem('refreshToken', response.data.refresh);
    }

    console.log('refresh-tokens res', response.data);

    return {
      success: true,
      data: response.data,
      error: null
    };

  } catch (error) {
    console.log('refresh-tokens error', error);
    
    return {
      success: false,
      data: null,
      error: {
        errors: [error.message],
        fieldsErrors: undefined,
      }
    };
  }
};

// Clear all tokens
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Skip auth for certain endpoints
    if (noAuthEndpoints.some(endpoint => config.url?.endsWith(endpoint))) {
      return config;
    }

    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return config;
    }

    // Check if token is expired
    if (!isTokenExpired(token)) {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }

    // Token is expired, try to refresh
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      clearTokens();
      return config;
    }

    try {
      const refreshResult = await refreshToken(refresh);

      if (refreshResult.success) {
        const newAccessToken = refreshResult.data.access;
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return config;
      } else {
        clearTokens();
        return config;
      }
    } catch (error) {
      console.error('Token refresh failed in request interceptor', error);
      clearTokens();
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401/403 error and we haven't already tried to refresh
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refreshToken');

      if (!refresh) {
        clearTokens();
        // Optionally redirect to login
        // window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const refreshResult = await refreshToken(refresh);

        if (refreshResult.success) {
          const newAccessToken = refreshResult.data.access;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retry the original request with new token
          return api(originalRequest);
        } else {
          clearTokens();
          // Optionally redirect to login
          // window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Token refresh failed in response interceptor', refreshError);
        clearTokens();
        // Optionally redirect to login
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const data = response.data;

    // Store access token
    if (data.access || data.accessToken || data.token) {
      const token = data.access || data.accessToken || data.token;
      localStorage.setItem('accessToken', token);
    }

    // Store refresh token
    if (data.refresh || data.refreshToken) {
      const refreshToken = data.refresh || data.refreshToken;
      localStorage.setItem('refreshToken', refreshToken);
    }
      
    // Store user data if provided
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
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

    // Store access token
    if (data.access || data.accessToken || data.token) {
      const token = data.access || data.accessToken || data.token;
      localStorage.setItem('accessToken', token);
    }

    // Store refresh token
    if (data.refresh || data.refreshToken) {
      const refreshToken = data.refresh || data.refreshToken;
      localStorage.setItem('refreshToken', refreshToken);
    }
      
    // Store user data if provided
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
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
  clearTokens();
};

// Get stored access token
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Get stored refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

// Get stored user data
export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

// Get auth headers for API requests (mostly handled by interceptors now)
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Export the configured axios instance
export { api };

// Default export with all functions
const authService = {
  login,
  register,
  logout,
  getToken,
  getRefreshToken,
  getUserData,
  isAuthenticated,
  getAuthHeaders,
  refreshToken,
  api
};

export default authService;
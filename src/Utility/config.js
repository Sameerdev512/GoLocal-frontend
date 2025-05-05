// Configuration utility to access environment variables

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Authentication
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'token';
export const AUTH_ROLE_KEY = import.meta.env.VITE_AUTH_ROLE_KEY || 'role';

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_NOTIFICATIONS = import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false';

// App Information
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Shop Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Helper function to get the full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to get auth header
export const getAuthHeader = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function for API requests
export const fetchApi = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};
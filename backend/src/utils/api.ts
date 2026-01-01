// utils/api.ts
// Create this file to handle all API requests with authentication

const API_BASE_URL = ''; // Empty string for relative URLs, or set to your API URL

export const api = {
  // Helper to get auth headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // Helper for multipart/form-data requests
  getAuthHeadersMultipart: () => {
    const token = localStorage.getItem('authToken');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // GET request
  get: async (url: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: api.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  // POST request
  post: async (url: string, data: any, isFormData = false) => {
    try {
      const headers = isFormData ? api.getAuthHeadersMultipart() : api.getAuthHeaders();
      const body = isFormData ? data : JSON.stringify(data);

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers,
        body,
      });
      return response;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  // PATCH request
  patch: async (url: string, data: any, isFormData = false) => {
    try {
      const headers = isFormData ? api.getAuthHeadersMultipart() : api.getAuthHeaders();
      const body = isFormData ? data : JSON.stringify(data);

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PATCH',
        headers,
        body,
      });
      return response;
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (url: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: api.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

// Safe localStorage helper
export const storage = {
  getItem: <T = any>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  getString: (key: string, defaultValue: string = ""): string => {
    return localStorage.getItem(key) || defaultValue;
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};
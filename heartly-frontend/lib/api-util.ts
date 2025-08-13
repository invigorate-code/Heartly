import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_NEST_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Important for sending and receiving cookies (like SuperTokens session cookies)
  timeout: 10000, // 10 second timeout
});

// Add response interceptor to handle network errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.warn(
        'Backend server is not available. Frontend will work in offline mode.',
      );
    }
    return Promise.reject(error);
  },
);

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      credentials: 'include', // Include cookies for SuperTokens session
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};
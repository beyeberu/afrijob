import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:8000/api';
const cache = new Map();

// Cache configuration
const DEFAULT_CACHE_TTL = 300000; // 5 minutes

// Cache utilities
const setCache = (key, value, ttl = DEFAULT_CACHE_TTL) => {
  const expiry = Date.now() + ttl;
  cache.set(key, { value, expiry });
};

const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (cached.expiry > Date.now()) {
    return cached.value;
  }
  
  cache.delete(key);
  return null;
};

const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, { expiry }] of cache.entries()) {
    if (expiry <= now) {
      cache.delete(key);
    }
  }
};

// Set up periodic cache cleanup
setInterval(clearExpiredCache, DEFAULT_CACHE_TTL);

// Axios instance configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Increased timeout to 10s
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.error('Failed to get Firebase token:', err);
      // Continue without token rather than failing
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a status outside 2xx
      const { status, data } = error.response;
      error.message = data?.message || `Request failed with status ${status}`;
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'No response received from server';
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const fetchJobDetails = async (id) => {
  const cacheKey = `job-${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await api.get(`/jobs/${id}/`);
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch job details');
  }
};

// Updated fetchJobs function in api.js
export const fetchJobs = async (params = {}) => {
  // Transform employment_type parameter to match backend expectations
  if (params.employment_type) {
    params = {
      ...params,
      employment_type: params.employment_type.toLowerCase().replace('-', '_')
    };
  }

  const cacheKey = `jobs-${JSON.stringify(params)}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await api.get('/jobs/', { 
      params,
      paramsSerializer: params => {
        return Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== '')
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
      }
    });
    
    const result = {
      results: data.results || data,
      count: data.count,
      next: data.next,
      previous: data.previous
    };
    
    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('API Error:', error.response?.data);
    throw new Error(error.message || 'Failed to fetch jobs');
  }
};

export const fetchDashboardStats = async () => {
  try {
    const { data } = await api.get('/dashboard/stats/');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch dashboard stats');
  }
};

export const verifyFirebaseToken = async (token) => {
  try {
    const { data } = await api.post('/verify-token/', { token });
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to verify token');
  }
};

export const fetchJobCategories = async () => {
  try {
    const { data } = await api.get('/job-categories/');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch job categories');
  }
};

export const fetchUserProfile = async () => {
  try {
    const { data } = await api.get('/user/profile/');
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user profile');
  }
};

// Utility to clear specific cache entries
export const clearApiCache = (keyPattern) => {
  if (!keyPattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
};



export const postJob = async (jobData) => {
  const response = await fetch('/api/jobs/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(jobData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to post job');
  }
  
  return await response.json();
};
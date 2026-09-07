import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Determine API Base URL (prefers EXPO_PUBLIC_API_URL from .env if set)
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL && process.env.EXPO_PUBLIC_API_URL.trim() !== '') {
    return process.env.EXPO_PUBLIC_API_URL.trim();
  }

  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.manifest?.debuggerHost || Constants.manifest?.debuggerHost;
  
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000/api`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://localhost:5000/api';
};

const activeBaseUrl = getBaseUrl();
console.log('🔗 [API Service] Connected to:', activeBaseUrl);

const API = axios.create({
  baseURL: activeBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== 'undefined') {
        const token = await AsyncStorage.getItem('user_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.error('Error fetching token from AsyncStorage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token & User session helpers
export const setSession = async (token, user) => {
  await AsyncStorage.setItem('user_token', token);
  await AsyncStorage.setItem('user_data', JSON.stringify(user));
};

export const getSession = async () => {
  const token = await AsyncStorage.getItem('user_token');
  const userStr = await AsyncStorage.getItem('user_data');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearSession = async () => {
  await AsyncStorage.removeItem('user_token');
  await AsyncStorage.removeItem('user_data');
};

// Auth API Calls
export const loginApi = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const registerApi = async (name, email, password) => {
  const res = await API.post('/auth/register', { name, email, password });
  return res.data;
};

// Casting Calls API Calls
export const fetchCastingCalls = async (params = {}) => {
  const res = await API.get('/casting-calls', { params });
  return res.data;
};

export const fetchCastingCallById = async (id) => {
  const res = await API.get(`/casting-calls/${id}`);
  return res.data;
};

// Children API Calls
export const fetchLatestJoinedKids = async () => {
  const res = await API.get('/children/latest');
  return res.data;
};

export const fetchMyChildren = async () => {
  const res = await API.get('/children');
  return res.data;
};

export const createChildProfile = async (childData) => {
  const res = await API.post('/children', childData);
  return res.data;
};

// Applications API Calls
export const submitApplication = async (childId, castingCallId) => {
  const res = await API.post('/applications', { childId, castingCallId });
  return res.data;
};

export const fetchMyApplications = async () => {
  const res = await API.get('/applications/my-applications');
  return res.data;
};

export default API;

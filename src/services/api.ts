import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Đã cập nhật từ cổng 5000 sang cổng 8080 để khớp với Spring Boot Server
const DEFAULT_ANDROID_BASE_URL = 'http://localhost:8080';
const DEFAULT_IOS_BASE_URL = 'http://localhost:8080';

export const API_BASE_URL =
  process.env.API_BASE_URL ||
  (Platform.OS === 'android' ? DEFAULT_ANDROID_BASE_URL : DEFAULT_IOS_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

const USE_MOCK = false;

export const workoutApi = USE_MOCK
  ? require('../screens/FootStepCounting/workoutApi.mock')
  : require('../screens/FootStepCounting/index');

export default api;

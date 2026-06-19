import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_ANDROID_BASE_URL = 'http://10.0.2.2:5000';
const DEFAULT_IOS_BASE_URL = 'http://localhost:5000';

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

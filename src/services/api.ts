import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://192.168.1.128:8080',
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
const USE_MOCK = false; // ← CHỈ ĐỔI DÒNG NÀY

export const workoutApi = USE_MOCK
  ? require('../screens/FootStepCounting/workoutApi.mock')
  : require('../screens/FootStepCounting/index');

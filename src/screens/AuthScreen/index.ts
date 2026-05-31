import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResultResponse,
  RefreshTokenRequest,
  UserResponse,
} from '../../types/auth';

// Login
export const login = async (
  identifier: string,
  password: string,
): Promise<AuthResultResponse> => {
  const { data } = await api.post('/auth/login', { identifier, password });

  if (data.tokens) {
    await AsyncStorage.setItem('accessToken', data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', data.tokens.refreshToken);
  }

  return data;
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};

// Refresh
export const refresh = async (
  req: RefreshTokenRequest,
): Promise<AuthResultResponse> => {
  const { data } = await api.post('/auth/refresh', req);

  if (data.tokens) {
    await AsyncStorage.setItem('accessToken', data.tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', data.tokens.refreshToken);
  }

  return data;
};

// Me
export const me = async (): Promise<UserResponse> => {
  const { data } = await api.get('/auth/me');
  return data;
};

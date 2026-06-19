// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../services/api';
import { Alert } from 'react-native';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'user' | 'admin' | null;
  user: UserType | null;
  loading: boolean;
  register: (data: any) => Promise<string | null>; // Trả về userId để chuyển sang màn OTP
  verifyOtp: (userId: string, otpCode: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Hàm Xử lý Đăng ký
  const register = async (userData: any) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.success) {
        Alert.alert('Đăng ký thành công', response.data.message);
        return response.data.userId; // Trả về ID để dùng cho bước kích hoạt OTP tiếp theo
      }
      return null;
    } catch (error: any) {
      Alert.alert(
        'Lỗi đăng ký',
        error.response?.data?.message || 'Hệ thống bận.',
      );
      return null;
    }
  };

  // 2. Hàm Xác thực OTP
  const verifyOtp = async (userId: string, otpCode: string) => {
    try {
      const response = await api.post('/api/auth/verify-otp', {
        userId,
        otpCode,
      });
      if (response.data.success) {
        Alert.alert('Kích hoạt thành công', response.data.message);
        return true;
      }
      return false;
    } catch (error: any) {
      Alert.alert(
        'Lỗi xác thực',
        error.response?.data?.message || 'Mã OTP sai.',
      );
      return false;
    }
  };

  // 3. Hàm Xử lý Đăng nhập & Đọc quyền hạn Role
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.success) {
        const { token, user: loggedUser } = response.data;

        // Gắn cứng token vào Header Axios cho các request sau này (như Water Tracker)
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        setUser(loggedUser);
        setUserRole(loggedUser.role); // Nhận quyền 'user' hoặc 'admin'
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      Alert.alert(
        'Đăng nhập thất bại',
        error.response?.data?.message || 'Sai mật khẩu.',
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        user,
        loading,
        register,
        verifyOtp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải đặt trong AuthProvider');
  return context;
};

export default AuthProvider;

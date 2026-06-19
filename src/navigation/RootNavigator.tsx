// src/navigation/RootNavigator.tsx
import React from 'react';
import { useAuth } from '@context/AuthContext';

import AuthStack from './AuthStack/AuthStack'; // Chứa Login, Register, OTP Screen
import BottomTab from './BottomTab/BottomTab'; // Giao diện App thông thường của User
import AdminDashboard from '@screens/Admin/AdminDashboard'; // (Bạn tạo thêm màn hình View cho Admin)

export const RootNavigator = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <>
      {/* Cửa môn phân luồng bảo mật tối cao */}
      {!isAuthenticated ? (
        // Luồng 1: Chưa đăng nhập -> Buộc vào cụm Auth (Login/Register/OTP)
        <AuthStack />
      ) : userRole === 'admin' ? (
        // Luồng 2: Đã đăng nhập & Là ADMIN -> Vào màn Dashboard quản trị
        <AdminDashboard />
      ) : (
        // Luồng 3: Đã đăng nhập & Là USER thường -> Vào app theo dõi sức khỏe
        <BottomTab />
      )}
    </>
  );
};

export default RootNavigator;

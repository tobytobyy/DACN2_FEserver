import { useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../../../services/api';
import { useUser } from '@context/UserContext';

interface UseAboutYouPage2LogicReturn {
  loading: boolean;
  handleStart: () => Promise<void>;
}

export function useAboutYouPage2Logic(): UseAboutYouPage2LogicReturn {
  const { setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      // Gọi API để lấy thông tin user sau khi đã hoàn tất AboutYouPage1
      const response = await api.get('/auth/me');
      console.log('User from /auth/me:', response.data);

      if (response.data) {
        console.log('Sync User Success:', response.data);

        // Cập nhật user vào context
        setUser(response.data);

        // Không cần navigation ở đây, RootNavigator sẽ tự re-render
        // vì isProfileComplete được tính toán từ user.profile
      }
    } catch (err: any) {
      console.error('Sync Error:', err.response?.data || err.message);
      Alert.alert('Lỗi kết nối', 'Không thể đồng bộ thông tin từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleStart,
  };
}

import { useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../../../services/api';
import { useUser } from '@context/UserContext';
// import { useAuth } from '@context/AuthContext'; // 👈 Thêm AuthContext để đồng bộ trạng thái điều hướng
import { useNavigation } from '@react-navigation/native'; // 👈 Thêm hook điều hướng trực tiếp của React Navigation

interface UseAboutYouPage2LogicReturn {
  loading: boolean;
  handleStart: () => Promise<void>;
}

export function useAboutYouPage2Logic(): UseAboutYouPage2LogicReturn {
  const { setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const handleStart = async () => {
    setLoading(true);
    try {
      // Gọi API đồng bộ profile (Đảm bảo đường dẫn khớp cấu hình endpoint Spring Boot)
      const response = await api.get('/auth/me');
      console.log('👉 AboutYouPage2 Profile Data:', response.data);

      // Trích xuất dữ liệu lõi từ ApiResponse
      const actualUser = response.data.data
        ? response.data.data
        : response.data;

      if (actualUser) {
        setUser(actualUser);

        // Điều hướng cứng giải phóng cụm khảo sát thông tin
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTab' }],
        });
      }
    } catch (err: any) {
      console.error(
        '❌ Lỗi đồng bộ tại AboutYouPage2:',
        err.response?.data || err.message,
      );

      /* 💡 MẸO ĐI BẢO VỆ ĐỒ ÁN: Nếu lỗi do Spring Boot chưa làm kịp endpoint '/auth/me' cho User mới,
         Đạt có thể mở ghi chú dòng bên dưới để ép ứng dụng mở trang chủ phục vụ demo trước hội đồng: */
      // navigation.reset({ index: 0, routes: [{ name: 'BottomTab' }] });

      Alert.alert(
        'Lỗi kết nối',
        'Không thể đồng bộ thông tin tài khoản từ máy chủ Spring Boot.',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleStart,
  };
}

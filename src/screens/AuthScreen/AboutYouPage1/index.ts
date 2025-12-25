import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/AuthStack/AuthStack';
import { api } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Union type cho các field
export type FieldType = 'gender' | 'birthday' | 'weight' | 'height' | null;
export type UnitType = 'weight' | 'height' | null;

interface UseAboutYouPage1LogicReturn {
  navigation: NativeStackNavigationProp<AuthStackParamList>;
  loading: boolean;
  gender: string;
  birthday: string;
  weight: string;
  height: string;
  weightUnit: string;
  heightUnit: string;
  activeField: FieldType;
  openUnitPicker: UnitType;
  formattedBirthday: string;
  setGender: (v: string) => void;
  setBirthday: (v: string) => void;
  setWeight: (v: string) => void;
  setHeight: (v: string) => void;
  setWeightUnit: (v: string) => void;
  setHeightUnit: (v: string) => void;
  setActiveField: (v: FieldType) => void;
  setOpenUnitPicker: (v: UnitType) => void;
  handleNext: () => Promise<void>;
}

export function useAboutYouPage1Logic(): UseAboutYouPage1LogicReturn {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [loading, setLoading] = useState<boolean>(false);

  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<string>('kg');
  const [heightUnit, setHeightUnit] = useState<string>('cm');

  const [activeField, setActiveField] = useState<FieldType>(null);
  const [openUnitPicker, setOpenUnitPicker] = useState<UnitType>(null);

  const formattedBirthday = useMemo(() => {
    if (!birthday) return 'Select';
    const [y, m, d] = birthday.split('-');
    return `${d}/${m}/${y}`;
  }, [birthday]);

  const handleNext = async () => {
    if (!gender || !birthday || !weight || !height) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Missing access token');
      }

      const profileData = {
        fullName: 'string',
        avatarUrl: 'string',
        gender: gender.toLowerCase(),
        birthDate: new Date(birthday).toISOString(),
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
      };

      const response = await api.put('/users/me/profile', profileData);

      if (response.status === 200 || response.status === 204) {
        navigation.navigate('AboutYouPage2');
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        status === 403
          ? 'Bạn không có quyền cập nhật hồ sơ. Vui lòng đăng nhập lại.'
          : status === 401
          ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          : 'Không thể lưu thông tin. Vui lòng kiểm tra lại kết nối.';

      console.error('Update Profile Error:', err.response?.data || err.message);
      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
    }
  };

  return {
    navigation,
    loading,
    gender,
    birthday,
    weight,
    height,
    weightUnit,
    heightUnit,
    activeField,
    openUnitPicker,
    formattedBirthday,
    setGender,
    setBirthday,
    setWeight,
    setHeight,
    setWeightUnit,
    setHeightUnit,
    setActiveField,
    setOpenUnitPicker,
    handleNext,
  };
}

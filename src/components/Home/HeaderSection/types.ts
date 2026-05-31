import { api } from '../../../services/api';

export type UserProfile = {
  id: string;
  username: string;
  primaryEmail: string;
  profile: {
    fullName: string;
    avatarPath: string;
    gender: string;
    birthday: string;
    height: number;
  };
};

// Hàm gọi API /auth/me
export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/auth/me');
  return response.data;
};

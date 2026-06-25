import { api } from '../../../services/api';

export type UserProfile = {
  id: string;
  username: string;
  primaryEmail: string;
  displayIdentifier?: string;
  profile?: {
    fullName?: string;
    avatarUrl?: string | null;
    avatarPath?: string;
    gender?: string;
    birthday?: string;
    birthDate?: string;
    heightCm?: number;
    height?: number;
    weightKg?: number;
    weight?: number;
    bloodType?: string;
    conditions?: string[];
  } | null;
  healthMetrics?: {
    heightCm?: number;
    weightKg?: number;
    bloodType?: string | null;
    conditions?: string[];
    restingHeartRate?: number;
  };
  settings?: {
    unitSystem?: string;
    language?: string;
    timezone?: string;
    notifications?: {
      enabled?: boolean;
      remindDrinkWater?: boolean;
      remindSleep?: boolean;
      remindWorkout?: boolean;
    };
  } | null;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/auth/me');
  return response.data;
};

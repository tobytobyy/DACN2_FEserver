import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, unwrapApiData } from '../services/api';

export interface User {
  id: string;
  displayIdentifier: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  primaryEmail?: string;
  profile?: {
    fullName?: string;
    avatarUrl?: string;
    gender?: string;
    birthday?: string;
    birthDate?: string;
    heightCm?: number;
    height?: number;
    weightKg?: number;
    weight?: number;
  } | null;
  healthMetrics?: {
    heightCm?: number;
    weightKg?: number;
    bloodType?: string | null;
    conditions?: string[];
    restingHeartRate?: number;
  };
  goals?: {
    dailySteps?: number;
    dailyCaloriesIn?: number;
    dailyCaloriesOut?: number;
    dailyWaterMl?: number;
    targetWeightKg?: number;
  } | null;
}

interface UserContextType {
  user: User | null;
  isBootstrapping: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  clearUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshUser = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return;
    }
    const res = await api.get<User>('/auth/me');
    setUser(unwrapApiData<User>(res.data));
  };

  const clearUser = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
  };

  useEffect(() => {
    refreshUser()
      .catch(error => {
        console.warn('Bootstrap user failed:', error);
        setUser(null);
      })
      .finally(() => setIsBootstrapping(false));
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isBootstrapping, setUser, refreshUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

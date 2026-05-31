import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string; // từ backend: userId
  displayIdentifier: string; // email hoặc phone hiển thị
  accessToken: string;
  refreshToken: string;
  username?: string;
  primaryEmail?: string;
  profile?: {
    // fullName?: string;
    // avatarUrl?: string;
    gender?: string;
    birthday?: string;
    birthDate?: string;
    heightCm?: number;
    height?: number;
    weightKg?: number;
    weight?: number;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

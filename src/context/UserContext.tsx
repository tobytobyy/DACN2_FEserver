import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  username: string;
  primaryEmail: string;
  // profile?: {
  //   fullName?: string;
  //   avatarUrl?: string;
  //   gender?: string;
  //   birthday?: string;
  //   birthDate?: string;
  //   heightCm?: number;
  //   height?: number;
  //   weightKg?: number;
  //   weight?: number;
  // };
  profile?: any;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  // isProfileComplete: boolean;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Kiểm tra xem User đã hoàn thành "About You" chưa
  // const isProfileComplete = !!(
  //   user?.profile?.gender &&
  //   (user?.profile?.birthday || user?.profile?.birthDate) &&
  //   (user?.profile?.heightCm || user?.profile?.height) &&
  //   (user?.profile?.weightKg || user?.profile?.weight)
  // );

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

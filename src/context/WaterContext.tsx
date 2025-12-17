import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho lịch sử uống nước
export type WaterLog = {
  id: string;
  amount: number;
  time: string;
};

// Định nghĩa dữ liệu trong Context
interface WaterContextType {
  dailyTarget: number;
  setDailyTarget: (amount: number) => void;
  cupSize: number;
  setCupSize: (amount: number) => void;
  currentIntake: number;
  history: WaterLog[];
  addWater: (amount: number) => void;
  deleteLog: (id: string, amount: number) => void;
}

// Tạo Context với giá trị mặc định
const WaterContext = createContext<WaterContextType | undefined>(undefined);

// Provider Component (Bọc quanh App của bạn)
export const WaterProvider = ({ children }: { children: ReactNode }) => {
  const [dailyTarget, setDailyTarget] = useState(2000); // Mục tiêu mặc định
  const [cupSize, setCupSize] = useState(250); // Ly mặc định
  const [currentIntake, setCurrentIntake] = useState(0);
  const [history, setHistory] = useState<WaterLog[]>([]);

  const addWater = (amount: number) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount: amount,
      time: timeString,
    };

    setCurrentIntake(prev => prev + amount);
    setHistory(prev => [newLog, ...prev]);
  };

  const deleteLog = (id: string, amount: number) => {
    setCurrentIntake(prev => Math.max(0, prev - amount));
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <WaterContext.Provider
      value={{
        dailyTarget,
        setDailyTarget,
        cupSize,
        setCupSize,
        currentIntake,
        history,
        addWater,
        deleteLog,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
};

// Hook để sử dụng Context dễ dàng hơn
export const useWater = () => {
  const context = useContext(WaterContext);
  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }
  return context;
};

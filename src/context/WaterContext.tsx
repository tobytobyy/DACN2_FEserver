import React, { createContext, useState, useContext, ReactNode } from 'react';

/* ======================================================
 * 1. Kiểu dữ liệu cho 1 lần uống nước (Water Log)
 * ====================================================== */
export type WaterLog = {
  /** ID duy nhất cho mỗi lần uống */
  id: string;

  /** Lượng nước uống (ml) */
  amount: number;

  /** Thời gian uống (HH:mm) */
  time: string;
};

/* ======================================================
 * 2. Định nghĩa toàn bộ dữ liệu & hàm mà Context cung cấp
 * ====================================================== */
interface WaterContextType {
  /** Mục tiêu uống nước trong ngày (ml) */
  dailyTarget: number;

  /** Set lại mục tiêu uống nước */
  setDailyTarget: (amount: number) => void;

  /** Dung tích mỗi cốc (ml) */
  cupSize: number;

  /** Set lại dung tích cốc */
  setCupSize: (amount: number) => void;

  /** Tổng lượng nước đã uống trong ngày (ml) */
  currentIntake: number;

  /** Lịch sử uống nước */
  history: WaterLog[];

  /** Thêm lượng nước (có thể là + hoặc -) */
  addWater: (amount: number) => void;

  /** Xóa một log khỏi lịch sử */
  deleteLog: (id: string, amount: number) => void;
}

/* ======================================================
 * 3. Tạo Context
 * - Giá trị mặc định là undefined
 * - Bắt buộc phải dùng trong WaterProvider
 * ====================================================== */
const WaterContext = createContext<WaterContextType | undefined>(undefined);

/* ======================================================
 * 4. WaterProvider
 * - Bọc quanh App hoặc screen cần dùng water data
 * ====================================================== */
export const WaterProvider = ({ children }: { children: ReactNode }) => {
  /** Mục tiêu uống nước mặc định (ml) */
  const [dailyTarget, setDailyTarget] = useState(2000);

  /** Dung tích cốc mặc định (ml) */
  const [cupSize, setCupSize] = useState(250);

  /** Tổng lượng nước đã uống */
  const [currentIntake, setCurrentIntake] = useState(0);

  /** Lịch sử uống nước */
  const [history, setHistory] = useState<WaterLog[]>([]);

  /* ======================================================
   * Thêm nước (khi user bấm + hoặc -)
   * ====================================================== */
  const addWater = (amount: number) => {
    const now = new Date();

    // Format thời gian HH:mm
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      time: timeString,
    };

    // Cập nhật tổng lượng nước
    setCurrentIntake(prev => Math.max(0, prev + amount));

    // Thêm log mới lên đầu lịch sử
    setHistory(prev => [newLog, ...prev]);
  };

  /* ======================================================
   * Xóa 1 log uống nước
   * ====================================================== */
  const deleteLog = (id: string, amount: number) => {
    // Giảm tổng lượng nước
    setCurrentIntake(prev => Math.max(0, prev - amount));

    // Xóa log khỏi history
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

/* ======================================================
 * 5. Custom Hook: useWater
 * - Giúp dùng Context dễ hơn
 * - Throw error nếu dùng sai Provider
 * ====================================================== */
export const useWater = () => {
  const context = useContext(WaterContext);

  if (!context) {
    throw new Error('useWater must be used within a WaterProvider');
  }

  return context;
};

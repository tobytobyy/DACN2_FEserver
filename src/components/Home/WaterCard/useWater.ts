// src/components/Home/WaterCard/useWater.ts
import { useState } from 'react';

export const WATER_TARGET = 2000; // ml mục tiêu mỗi ngày
export const WATER_STEP = 250; // ml mỗi lần bấm +/-

export const useWater = () => {
  const [waterAmount, setWaterAmount] = useState(0); // ml đã uống

  const increase = () => {
    setWaterAmount(prev => Math.min(prev + WATER_STEP, WATER_TARGET));
  };

  const decrease = () => {
    setWaterAmount(prev => Math.max(prev - WATER_STEP, 0));
  };

  return {
    waterAmount,
    increase,
    decrease,
  };
};

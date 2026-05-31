import { api } from './api';

export const analyzeNutrition = async (objectKey: string) => {
  const res = await api.post('/nutrition/analyze', { objectKey });
  return res.data?.data;
};

export const confirmFoodLog = async (req: {
  foodCode: string;
  confidence?: number;
  source?: 'AI_INFERRED' | 'MANUAL' | 'SMARTWATCH' | 'PHONE_SENSOR';
  idempotencyKey?: string;
  rawRef?: string;
}) => {
  const res = await api.post('/nutrition/logs/confirm', req);
  return res.data?.data;
};

export const cancelFoodLog = async (req?: {
  reason?: string;
  candidateCodes?: string[];
}) => {
  const res = await api.post('/nutrition/logs/cancel', req ?? null);
  return res.data?.data;
};

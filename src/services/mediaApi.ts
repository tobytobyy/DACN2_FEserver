import { api } from './api';

export type PresignPutResponse = {
  objectKey: string;
  uploadUrl: string;
  expiresAt: string;
  publicUrl?: string | null;
};

export const presignChatPut = async (
  contentType: string,
  sizeBytes: number,
) => {
  const res = await api.post('/media/chat/presign-put', {
    contentType,
    sizeBytes,
  });
  return res.data?.data as PresignPutResponse;
};

export const presignNutritionPut = async (
  contentType: string,
  sizeBytes: number,
) => {
  const res = await api.post('/media/nutrition/presign-put', {
    contentType,
    sizeBytes,
  });
  return res.data?.data as PresignPutResponse;
};

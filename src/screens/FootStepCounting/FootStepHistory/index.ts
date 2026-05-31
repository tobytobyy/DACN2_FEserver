import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { listWorkouts } from './types';

export const useFootStepHistory = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date().toISOString();
      const past = new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000,
      ).toISOString();
      try {
        const data = await listWorkouts(past, now);
        setWorkouts(data);
      } catch (e) {
        console.log('Lỗi tải lịch sử', e);
      }
    };
    fetchData();
  }, []);

  const goBack = () => navigation.goBack();

  return { workouts, goBack };
};

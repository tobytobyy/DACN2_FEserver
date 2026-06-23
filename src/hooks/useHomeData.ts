import { useCallback, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { api, unwrapApiData } from '../services/api';
import { fetchHealthArticles } from '../services/rss';
import { useUser } from '../context/UserContext';
import type { DailyMetrics, Article } from '../types/home';

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const fetchDailyMetrics = async (
  date: string,
): Promise<DailyMetrics | null> => {
  try {
    const res = await api.get(`/health/daily-aggregate?date=${date}`);
    return unwrapApiData<DailyMetrics>(res.data);
  } catch {
    return null;
  }
};

export const useHomeData = () => {
  const { user } = useUser();

  const today = useMemo(() => formatDate(new Date()), []);

  const last7Days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return formatDate(d);
      }),
    [],
  );

  const todayQuery = useQuery<DailyMetrics | null>({
    queryKey: ['daily-aggregate', today],
    queryFn: () => fetchDailyMetrics(today),
    staleTime: 0,
  });

  const weekQueries = useQueries({
    queries: last7Days.map(date => ({
      queryKey: ['daily-aggregate', date],
      queryFn: () => fetchDailyMetrics(date),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const articlesQuery = useQuery<Article[]>({
    queryKey: ['health-articles'],
    queryFn: fetchHealthArticles,
    staleTime: 30 * 60 * 1000,
  });

  const refetch = useCallback(() => {
    todayQuery.refetch();
  }, [todayQuery]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const weekMetrics = weekQueries
    .map(q => q.data)
    .filter((d): d is DailyMetrics => d != null);

  return {
    metrics: todayQuery.data ?? null,
    weekMetrics,
    user,
    articles: articlesQuery.data ?? [],
    isLoading: todayQuery.isLoading || articlesQuery.isLoading,
    isError: todayQuery.isError,
    refetch,
  };
};

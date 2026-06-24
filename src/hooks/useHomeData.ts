import { useCallback } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { api, unwrapApiData } from '../services/api';
import { fetchHealthArticles } from '../services/rss';
import { useUser } from '../context/UserContext';
import type { DailyMetrics, Article } from '../types/home';

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// FIX 1: Let errors propagate so React Query handles retry/error state.
// 404 means no aggregate for that day — return null (not an error).
const fetchDailyMetrics = async (
  date: string,
): Promise<DailyMetrics | null> => {
  try {
    const res = await api.get(`/health/daily-aggregate?date=${date}`);
    return unwrapApiData<DailyMetrics>(res.data);
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
};

export const useHomeData = () => {
  const { user } = useUser();

  // FIX 4: Compute last7Days directly (not in useMemo with []) so
  // it updates after midnight instead of staying frozen at mount time.
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return formatDate(d);
  });

  // FIX 10: Remove todayQuery entirely. weekQueries[0] covers today with
  // staleTime:0 so there is no conflicting cache entry for the same key.
  const weekQueries = useQueries({
    queries: last7Days.map((date, i) => ({
      queryKey: ['daily-aggregate', date],
      queryFn: () => fetchDailyMetrics(date),
      // FIX 10: today's entry is always considered stale; historical days cache for 5 min
      staleTime: i === 0 ? 0 : 5 * 60 * 1000,
    })),
  });

  const articlesQuery = useQuery<Article[]>({
    queryKey: ['health-articles'],
    queryFn: fetchHealthArticles,
    staleTime: 30 * 60 * 1000,
  });

  // FIX 6: refetch triggers both today's query and all week queries so
  // every panel refreshes on tab focus, not just the daily card.
  const refetch = useCallback(() => {
    weekQueries.forEach(q => q.refetch());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // FIX 10: Derive today's metrics from weekQueries[0]
  const metrics: DailyMetrics | null = weekQueries[0]?.data ?? null;
  const weekMetrics: (DailyMetrics | null)[] = weekQueries.map(
    q => q.data ?? null,
  );

  return {
    metrics,
    weekMetrics,
    user,
    articles: articlesQuery.data ?? [],
    // FIX 5: isLoading only gates on today's health data, not the RSS fetch.
    // Articles load independently so health cards are not blocked by RSS latency.
    isLoading: weekQueries[0]?.isLoading ?? true,
    isError: weekQueries[0]?.isError ?? false,
    refetch,
  };
};

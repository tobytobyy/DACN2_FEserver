import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useHomeData } from '../../hooks/useHomeData';

jest.mock('../../services/api', () => ({
  api: { get: jest.fn() },
  unwrapApiData: (data: any) => data?.data ?? data,
}));

jest.mock('../../services/rss', () => ({
  fetchHealthArticles: jest.fn().mockResolvedValue([
    {
      title: 'Article 1',
      link: 'https://example.com/1',
      pubDate: '',
      thumbnail: null,
      source: 'VnExpress',
    },
  ]),
}));

jest.mock('../../context/UserContext', () => ({
  useUser: () => ({
    user: {
      id: '1',
      displayIdentifier: 'user@example.com',
      profile: { fullName: 'Test User' },
    },
  }),
}));

// useFocusEffect is a no-op in tests (no navigation context)
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

const { api } = require('../../services/api');

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    QueryClientProvider,
    {
      client: new QueryClient({
        defaultOptions: { queries: { retry: false } },
      }),
    },
    children,
  );

describe('useHomeData', () => {
  const mockMetrics = {
    date: '2026-06-24',
    steps: 8000,
    caloriesOut: 500,
    avgHeartRate: 72,
    sleepMinutes: 420,
    waterMl: 1500,
  };

  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockMetrics });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns metrics from daily-aggregate', async () => {
    const { result } = await renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.metrics?.steps).toBe(8000);
    expect(result.current.metrics?.avgHeartRate).toBe(72);
  });

  it('returns articles from RSS', async () => {
    const { result } = await renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.articles).toHaveLength(1);
    expect(result.current.articles[0].title).toBe('Article 1');
  });

  it('returns user from UserContext', async () => {
    const { result } = await renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user?.profile?.fullName).toBe('Test User');
  });

  it('sets isLoading true initially', async () => {
    api.get.mockReturnValue(new Promise(() => {}));
    const { result } = await renderHook(() => useHomeData(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(true));
  });
});

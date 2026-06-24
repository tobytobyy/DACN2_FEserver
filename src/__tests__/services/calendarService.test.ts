import {
  fetchDayAggregate,
  fetchMonthAggregates,
} from '../../services/calendarService';
import { api } from '../../services/api';

jest.mock('../../services/api', () => ({
  api: { get: jest.fn() },
  unwrapApiData: (data: any) => data?.data ?? data,
}));

const mockApi = api.get as jest.Mock;

const AGGREGATE = {
  steps: 9000,
  caloriesOut: 500,
  avgHeartRate: 72,
  sleepMinutes: 420,
  waterMl: 2200,
};

beforeEach(() => jest.clearAllMocks());

describe('fetchDayAggregate', () => {
  it('returns DailyMetrics on success', async () => {
    mockApi.mockResolvedValue({ data: AGGREGATE });
    const result = await fetchDayAggregate('2026-06-24');
    expect(mockApi).toHaveBeenCalledWith('/health/daily-aggregate', {
      params: { date: '2026-06-24' },
    });
    expect(result).toEqual(AGGREGATE);
  });

  it('returns null on 404', async () => {
    mockApi.mockRejectedValue({ response: { status: 404 } });
    const result = await fetchDayAggregate('2026-06-24');
    expect(result).toBeNull();
  });

  it('rethrows non-404 errors', async () => {
    mockApi.mockRejectedValue({ response: { status: 500 } });
    await expect(fetchDayAggregate('2026-06-24')).rejects.toMatchObject({
      response: { status: 500 },
    });
  });
});

describe('fetchMonthAggregates', () => {
  it('returns array of DailyMetrics on success', async () => {
    mockApi.mockResolvedValue({ data: [AGGREGATE] });
    const result = await fetchMonthAggregates('2026-06-01', '2026-06-30');
    expect(mockApi).toHaveBeenCalledWith('/health/summary', {
      params: { from: '2026-06-01', to: '2026-06-30' },
    });
    expect(result).toEqual([AGGREGATE]);
  });

  it('returns empty array on 404', async () => {
    mockApi.mockRejectedValue({ response: { status: 404 } });
    const result = await fetchMonthAggregates('2026-06-01', '2026-06-30');
    expect(result).toEqual([]);
  });

  it('rethrows non-404 errors', async () => {
    mockApi.mockRejectedValue({ response: { status: 500 } });
    await expect(
      fetchMonthAggregates('2026-06-01', '2026-06-30'),
    ).rejects.toMatchObject({ response: { status: 500 } });
  });
});

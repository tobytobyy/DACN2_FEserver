import { createSleepSession } from '../sleepService';
import { api } from '../api';

jest.mock('../api', () => ({
  api: { post: jest.fn() },
  unwrapApiData: (x: any) => x?.data ?? x,
}));

describe('createSleepSession', () => {
  beforeEach(() => jest.clearAllMocks());

  it('posts to /health/sleep with time + meta and returns true', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { data: {} } });
    const ok = await createSleepSession({
      startAt: '2026-06-25T23:00:00.000Z',
      endAt: '2026-06-26T07:00:00.000Z',
      source: 'manual',
    });
    expect(ok).toBe(true);
    expect(api.post).toHaveBeenCalledWith('/health/sleep', {
      time: {
        startAt: '2026-06-25T23:00:00.000Z',
        endAt: '2026-06-26T07:00:00.000Z',
      },
      meta: { source: 'manual' },
    });
  });

  it('returns false on error', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('boom'));
    const ok = await createSleepSession({
      startAt: '2026-06-25T23:00:00.000Z',
      endAt: '2026-06-26T07:00:00.000Z',
    });
    expect(ok).toBe(false);
  });
});

import { buildLastNightRange, validateRange } from '../logSleepValidation';

describe('logSleepValidation', () => {
  const now = new Date('2026-06-26T09:00:00.000Z');

  it('buildLastNightRange returns prev-night 23:00 -> today 07:00', () => {
    const r = buildLastNightRange(now);
    expect(r.startAt).toContain('2026-06-25');
    expect(r.endAt).toContain('2026-06-26');
    expect(new Date(r.endAt).getTime()).toBeGreaterThan(
      new Date(r.startAt).getTime(),
    );
  });

  it('validateRange rejects end <= start', () => {
    expect(
      validateRange(
        '2026-06-26T07:00:00.000Z',
        '2026-06-26T07:00:00.000Z',
        now,
      ),
    ).not.toBeNull();
  });

  it('validateRange rejects future end', () => {
    expect(
      validateRange(
        '2026-06-26T08:00:00.000Z',
        '2026-06-26T23:00:00.000Z',
        now,
      ),
    ).not.toBeNull();
  });

  it('validateRange accepts a valid past range', () => {
    expect(
      validateRange(
        '2026-06-25T23:00:00.000Z',
        '2026-06-26T07:00:00.000Z',
        now,
      ),
    ).toBeNull();
  });
});

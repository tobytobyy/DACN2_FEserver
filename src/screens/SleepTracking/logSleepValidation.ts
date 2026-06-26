export const buildLastNightRange = (
  now: Date,
): { startAt: string; endAt: string } => {
  const end = new Date(now);
  end.setHours(7, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 1);
  start.setHours(23, 0, 0, 0);
  return { startAt: start.toISOString(), endAt: end.toISOString() };
};

export const validateRange = (
  startAt: string,
  endAt: string,
  now: Date,
): string | null => {
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  if (!(e > s)) return 'Giờ thức phải sau giờ ngủ.';
  if (e > now.getTime()) return 'Không thể ghi giấc ngủ trong tương lai.';
  return null;
};

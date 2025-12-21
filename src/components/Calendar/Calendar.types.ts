/**
 * HealthSummary
 * - Tổng hợp dữ liệu sức khoẻ trong ngày
 * - Dùng cho màn Calendar / Daily Summary
 */
export type HealthSummary = {
  /** Nhịp tim trung bình trong ngày (vd: "72 BPM") */
  heartRate: string;

  /** Trạng thái nhịp tim (Normal, High, Low, ...) */
  heartStatus: string;

  /** Tổng số bước trong ngày (vd: "8,432 steps") */
  steps: string;

  /** Thời gian ngủ (vd: "07h30m") */
  sleep: string;

  /** Trạng thái giấc ngủ (Good, Fair, Poor, ...) */
  sleepStatus: string;
};

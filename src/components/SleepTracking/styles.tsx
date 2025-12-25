// src/screens/SleepTracking/styles.ts
import { StyleSheet } from 'react-native';
import { ViewStyle } from 'react-native';

/**
 * ✅ Những style cần giá trị động (progress/height/color)
 * - Dùng function trả về object style
 * - Tránh inline object trực tiếp trong JSX
 */
export const dynamicStyles = {
  /**
   * ✅ Trả về ViewStyle có width dạng 'xx%'
   * - Ép kiểu ViewStyle để TS hiểu đây là style hợp lệ
   */
  stageBarWidth: (percent: number): ViewStyle => {
    const safe = Math.max(0, Math.min(percent, 100)); // clamp 0..100
    return { width: `${safe}%` };
  },

  /**
   * ✅ Tạo style cho fill (width + backgroundColor) để khỏi cần inline { backgroundColor: color }
   */
  stageBarFill: (percent: number, color: string): ViewStyle => {
    const safe = Math.max(0, Math.min(percent, 100));
    return { width: `${safe}%`, backgroundColor: color };
  },
  /**
   * Chiều cao cột chart (px)
   * - clamp để không âm
   */
  weeklyBarHeight: (height: number): ViewStyle => {
    const safe = Math.max(0, height);
    return { height: safe };
  },

  /**
   * (Tuỳ chọn) set màu theo focused day
   */
  weeklyBarColor: (color: string): ViewStyle => {
    return { backgroundColor: color };
  },
};

const styles = StyleSheet.create({
  /* ================= Screen Layout ================= */
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  /* ================= Night Background ================= */
  headerBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '55%',
    backgroundColor: '#312E81',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },

  /* ================= Header ================= */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    marginBottom: 24,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ================= Content ================= */
  content: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: 100,
  },

  /* ================= Dial ================= */
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  dialGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 100,
    transform: [{ scale: 1.2 }],
  },
  dialWrapper: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  dialContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  totalSleepText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  scoreText: {
    color: '#C7D2FE',
    fontSize: 14,
    marginTop: 4,
  },
  scoreBold: {
    fontWeight: 'bold',
    color: '#FFF',
  },

  /* ================= Schedule ================= */
  scheduleRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scheduleLabel: {
    color: '#C7D2FE',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scheduleValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* ================= Analysis Card ================= */
  analysisCard: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subText: {
    fontSize: 12,
    color: '#6B7280',
  },

  /* ================= Stages ================= */
  stagesGap: {
    gap: 16,
  },
  stageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFillBase: {
    height: '100%',
    borderRadius: 4,
  },

  /* ================= Trend ================= */
  trendContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartColumn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  chartBarBase: {
    width: '100%',
    maxWidth: 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
});

export default styles;

// src/screens/HomeScreen/components/WaterCard/styles.ts
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

/**
 * Styles cho WaterCard
 * - Tách riêng để tránh inline styles trong component
 * - Có function style cho progressFill để set width theo % (dynamic)
 */
const base = StyleSheet.create({
  /* ================= Container ================= */

  /** Card nền chính */
  container: {
    backgroundColor: '#E0F2FE', // Light blue background
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 20,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  /** Container fallback khi thiếu Provider */
  missingProviderContainer: {
    backgroundColor: '#E0F2FE',
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Text báo lỗi Provider */
  missingProviderText: {
    color: 'red',
    fontWeight: '700',
  },

  /* ================= Background Decor ================= */

  /** Wrapper decor (đặt absolute để nằm phía sau nội dung) */
  bgDecor: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },

  /** Vòng tròn trang trí */
  circleDecor: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0EA5E9',
    opacity: 0.1,
  },

  /* ================= Content ================= */

  /** Khu vực nội dung text + progress */
  content: {
    zIndex: 1,
    flex: 1,
  },

  /** Header row: icon + title */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  /** Nền tròn cho icon */
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Title card */
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  /* ================= Progress ================= */

  /** Track progress (nền) */
  progressTrack: {
    height: 6,
    backgroundColor: '#BFDBFE',
    borderRadius: 3,
    marginBottom: 8,
    width: '90%',
    overflow: 'hidden',
  },

  /** Fill progress (thanh chạy) - base */
  progressFillBase: {
    height: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 3,
  },

  /* ================= Info Text ================= */

  /** Row value/target */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  /** Giá trị hiện tại (ml) */
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },

  /** Target text */
  targetValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  /** Subtitle cốc */
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* ================= Controls ================= */

  /** Group nút +/- */
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 6,
    zIndex: 1,

    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /** Button tròn */
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  /** Button add (màu xanh) */
  btnAdd: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },

  /** Text dấu - */
  btnTextMinus: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    lineHeight: 22,
  },

  /** Text dấu + */
  btnTextPlus: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 22,
  },

  /** Divider giữa 2 nút */
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
});

const styles = {
  ...base,

  /**
   * progressFill
   * - Dynamic width theo progress (%)
   * - Clamp 0..100 để tránh UI lỗi
   */
  progressFill: (progress: number): StyleProp<ViewStyle> => {
    const safe = Math.max(0, Math.min(progress, 100));
    return [
      base.progressFillBase,
      { width: `${safe}%` },
    ] as StyleProp<ViewStyle>;
  },
};

export default styles;

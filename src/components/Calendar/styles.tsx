import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  /* ================= Container & Layout ================= */

  /** Container chính (có thể cuộn) */
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  /** SafeArea wrapper */
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },

  /** Content bên trong ScrollView */
  scrollContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
    paddingBottom: theme.spacing.lg,
  },

  /* ================= Header ================= */

  /** Header của màn Calendar */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',

    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    // Shadow Android
    elevation: 2,
  },

  /** Text tiêu đề trong header */
  headerText: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Calendar ================= */

  /** Wrapper cho calendar */
  calendar: {
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },

  /* ================= Daily Summary ================= */

  /** Box tổng quan sức khoẻ trong ngày */
  summaryBox: {
    backgroundColor: '#d6e2eeff',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },

  /** Header của summary box */
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /** Title "Daily Summary" */
  summaryTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },

  /** Nút AI Analysis */
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.sm,

    // Shadow nổi bật cho CTA
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  /** Text trong nút AI */
  aiButtonText: {
    color: '#2D8C83',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    fontFamily: theme.fonts.poppins.bold,
    marginLeft: theme.spacing.xs,
  },

  /** Text hiển thị ngày được chọn */
  summaryDate: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_2,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.poppins.regular,
  },

  /* ================= Metrics ================= */

  /** Wrapper chứa các metric card */
  metrics: {
    gap: theme.spacing.md,
  },

  /* ================= Metric Cards ================= */

  /** Card nhịp tim */
  metricCardHeart: {
    backgroundColor: '#430005',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },

  /** Card số bước */
  metricCardSteps: {
    backgroundColor: '#242424',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },

  /** Card giấc ngủ */
  metricCardSleep: {
    backgroundColor: '#242424',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },

  /* ================= Layout Rows ================= */

  /** Row icon + label */
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },

  /** Row value + status */
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  /* ================= Text Styles ================= */

  /** Label của metric (STEPS, SLEEP, …) */
  metricLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.regular,
  },

  /** Giá trị metric */
  metricValue: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Status Badge ================= */

  /** Badge hiển thị trạng thái */
  statusBadge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  /** Text trạng thái nhịp tim */
  statusText: {
    color: '#FF69B4',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  /** Text trạng thái giấc ngủ */
  statusTextSleep: {
    color: '#A855F7',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Progress Bar ================= */

  /** Thanh progress số bước */
  progressBar: {
    height: 8,
    backgroundColor: '#444',
    borderRadius: 4,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },

  /** Phần fill của progress */
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
  },

  /** Text mô tả tiến độ */
  progressText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.poppins.regular,
  },
});

export default styles;

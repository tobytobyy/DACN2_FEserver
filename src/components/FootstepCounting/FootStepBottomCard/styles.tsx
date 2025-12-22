import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

const styles = StyleSheet.create({
  /* ================= Bottom Card ================= */

  /** Container chính của bottom card */
  bottomCard: {
    flex: 0.9,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginTop: -24, // đẩy card lên để tạo hiệu ứng overlay
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },

  /** Content của ScrollView (chừa chỗ cho nút phía dưới) */
  bottomContent: {
    paddingBottom: 120,
  },

  /* ================= Distance ================= */

  /** Label DISTANCE */
  distanceLabel: {
    textAlign: 'center',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    color: theme.colors.subText_1,
    marginBottom: theme.spacing.xs,
  },

  /** Row hiển thị giá trị distance + unit */
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },

  /** Giá trị distance */
  distanceValue: {
    fontSize: 40,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold as any,
    color: theme.colors.text,
  },

  /** Đơn vị km */
  distanceUnit: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.subText_1,
    marginLeft: 6,
  },

  /* ================= Tracking Stats ================= */

  /** Hàng chứa các chỉ số: time / footstep / calo */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },

  /** Mỗi item chỉ số */
  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  /** Label chỉ số chung */
  statLabel: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.subText_1,
    marginBottom: 4,
  },

  /** Row label có icon */
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  /** Label FOOTSTEP (màu primary) */
  statLabelColored: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
  },

  /** Label CALO (màu danger) */
  statLabelCalo: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.danger,
  },

  /** Giá trị của chỉ số */
  statValue: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },

  /* ================= Start / Pause Button ================= */

  /** Wrapper nút start/pause */
  startButtonWrapper: {
    marginTop: theme.spacing.lg * 1.5,
    alignItems: 'center',
  },

  /** Nút start */
  startButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  /** Nút pause (khi đang tracking) */
  startButtonStop: {
    backgroundColor: theme.colors.danger,
  },

  /** Icon play / pause */
  startButtonIcon: {
    fontSize: 28,
    color: theme.colors.white,
  },

  /* ================= Result (Finished Mode) ================= */

  /** Row hiển thị ngày giờ kết thúc */
  resultTopRow: {
    marginBottom: theme.spacing.sm,
  },

  /** Row icon + text ngày */
  resultDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  /** Text ngày giờ */
  resultDateText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
  },

  /** Card kết quả tổng */
  resultCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: theme.spacing.lg,
  },

  /** Header của card kết quả */
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  /** Label TOTAL */
  resultLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 4,
  },

  /** Badge kỷ lục mới */
  newRecordBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: '#BBF7D0',
    borderRadius: 999,
  },

  /** Text kỷ lục mới */
  newRecordText: {
    fontSize: theme.fonts.size.xs,
    color: '#166534',
    fontFamily: theme.fonts.poppins.bold,
  },

  /** Row metrics (2 cột) */
  resultMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },

  /** Item metric */
  resultMetricItem: {
    flex: 1,
    padding: theme.spacing.sm,
  },

  /** Label metric */
  resultMetricLabel: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 2,
  },

  /** Giá trị metric */
  resultMetricValue: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Actions ================= */

  /** Row nút hành động */
  resultActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  /** Nút xoá kết quả */
  trashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
  },

  /** Nút lưu hoạt động */
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Text nút save */
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },
});

export default styles;

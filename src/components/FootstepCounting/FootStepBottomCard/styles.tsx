import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

const styles = StyleSheet.create({
  /* ================= Bottom Card ================= */
  bottomCard: {
    flex: 0.9,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginTop: -24, // overlay nhẹ lên map
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 3,
  },

  bottomContent: {
    paddingBottom: 100,
  },

  /* ================= Distance ================= */
  distanceLabel: {
    textAlign: 'center',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    color: theme.colors.subText_1,
    marginBottom: theme.spacing.xs,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  distanceValue: {
    fontSize: 40,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },
  distanceUnit: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.subText_1,
    marginLeft: 6,
  },

  /* ================= Tracking Stats ================= */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.subText_1,
    marginBottom: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabelColored: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
  },
  statLabelCalo: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.danger,
  },
  statValue: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },

  /* ================= Buttons ================= */
  startButtonWrapper: {
    marginTop: theme.spacing.lg * 1.5,
    alignItems: 'center',
  },
  startButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.subText_1,
  },
  startButtonIcon: {
    fontSize: 28,
    color: theme.colors.white,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  pauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ================= Result ================= */
  resultTopRow: {
    marginBottom: theme.spacing.sm,
  },
  resultDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  resultDateText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
  },
  resultCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: theme.spacing.lg,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 4,
  },
  newRecordBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: '#BBF7D0',
    borderRadius: 999,
  },
  newRecordText: {
    fontSize: theme.fonts.size.xs,
    color: '#166534',
    fontFamily: theme.fonts.poppins.bold,
  },
  resultMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  resultMetricItem: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  resultMetricLabel: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 2,
  },
  resultMetricValue: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Actions ================= */
  resultActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
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
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },
});

export default styles;

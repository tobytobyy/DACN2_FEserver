import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  // Container có thể cuộn
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  scrollContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
    paddingBottom: theme.spacing.lg,
  },

  // Header
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  // Calendar
  calendar: {
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },

  // Summary box
  summaryBox: {
    backgroundColor: '#d6e2eeff',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  aiButtonText: {
    color: '#2D8C83',
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.medium,
    fontFamily: theme.fonts.poppins.bold,
    marginLeft: theme.spacing.xs,
  },
  summaryDate: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_2,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.poppins.regular,
  },

  // Metrics wrapper
  metrics: {
    gap: theme.spacing.md,
  },

  // Cards
  metricCardHeart: {
    backgroundColor: '#430005',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },
  metricCardSteps: {
    backgroundColor: '#242424',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },
  metricCardSleep: {
    backgroundColor: '#242424',
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    elevation: 1,
  },

  // Rows
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  // Text styles
  metricLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.regular,
  },
  metricValue: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
    color: theme.colors.white,
    fontFamily: theme.fonts.poppins.bold,
  },

  // Status badge
  statusBadge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FF69B4',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },
  statusTextSleep: {
    color: '#A855F7',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },

  // Progress styles
  progressBar: {
    height: 8,
    backgroundColor: '#444',
    borderRadius: 4,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0EA5E9',
  },
  progressText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.white,
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.poppins.regular,
  },
});

export default styles;

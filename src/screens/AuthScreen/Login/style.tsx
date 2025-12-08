import { theme } from '@assets/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFDFD',
  },
  nameBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  nameBrandText: {
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.semibold,
  },
  banner: {
    transform: [{ translateX: -30 }],
  },
  title: {
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold,
    fontSize: theme.fonts.size['2xl'],
    marginBottom: theme.spacing.sm * 2,
    width: '80%',
  },
  authOptionsContainer: {
    gap: theme.spacing.gap * 2,
    marginBottom: theme.spacing.xl,
  },
  authOptionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.gap * 2,
  },
});

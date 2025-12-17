import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 12,
    backgroundColor: '#EEF3F6',
    borderWidth: 1,
    borderColor: '#E1E7EC',
  },
  backButtonText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
    fontSize: theme.fonts.size.md,
  },
  title: {
    fontFamily: theme.fonts.poppins.bold,
    fontSize: theme.fonts.size['2xl'],
    color: theme.colors.text,
  },
  subtitle: {
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.md,
    color: theme.colors.subText_1,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F7F7F9',
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
  },
});

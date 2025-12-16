import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
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
    color: theme.colors.subText,
    lineHeight: 22,
  },
  helperText: {
    fontFamily: theme.fonts.poppins.regular,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText,
    marginTop: -theme.spacing.sm / 2,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.red,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F7F7F9',
    fontFamily: theme.fonts.poppins.regular,
    fontWeight: theme.fonts.weight.semibold,
    fontSize: theme.fonts.size.xl,
    color: theme.colors.text,
  },
  otpInputFocused: {
    borderColor: theme.colors.primary,
    shadowColor: '#2D8C8340',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: '#E8F5F3',
  },
  otpInputError: {
    borderColor: theme.colors.red,
    backgroundColor: '#FEE2E2',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  resendButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: '#E8F5F3',
  },
  resendButtonDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  resendButtonText: {
    fontFamily: theme.fonts.poppins.bold,
    fontSize: theme.fonts.size.sm,
    color: theme.colors.primary,
  },
  resendButtonTextDisabled: {
    color: theme.colors.subText,
  },
  resendTimer: {
    fontFamily: theme.fonts.poppins.bold,
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
  },
});

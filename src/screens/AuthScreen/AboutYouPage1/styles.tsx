import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

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
  header: {
    alignItems: 'center',
    gap: theme.spacing.xs * 3,
    marginTop: theme.spacing.gap * 2,
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    lineHeight: theme.spacing.lg,
  },
  description: {
    width: '100%',
    color: theme.colors.subText_1,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.semibold,
    lineHeight: theme.spacing.lg,
    marginBottom: theme.spacing.gap * 3,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  username: {
    color: theme.colors.subText_1,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.regular,
    fontSize: theme.fonts.size.lg,
    lineHeight: theme.spacing.lg,
  },
  formContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.gap * 2,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.gap * 2,
  },
  column: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: theme.spacing.gap * 20,
    paddingHorizontal: theme.spacing.gap * 3,
  },
});

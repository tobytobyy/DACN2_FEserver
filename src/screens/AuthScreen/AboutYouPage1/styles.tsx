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
    marginTop: theme.spacing.gap * 18,
    paddingHorizontal: theme.spacing.gap * 3,
  },
  selector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectorText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.gap * 3,
    gap: theme.spacing.gap * 2,
    maxHeight: '90%',
  },
  modalContentGap: {
    gap: theme.spacing.gap * 2,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  optionButtonActive: {
    backgroundColor: '#E0ECFF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.subText_2,
    fontFamily: theme.fonts.poppins.regular,
  },
  optionTextActive: {
    fontFamily: theme.fonts.poppins.bold,
  },
});

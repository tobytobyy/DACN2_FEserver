import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  /* ================= Safe Area & Layout ================= */
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFDFD',
  },

  /* ================= Header ================= */
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

  /* ================= Avatar ================= */
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

  /* ================= Form ================= */
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

  fieldContainer: {
    marginTop: theme.spacing.xs,
    position: 'relative',
  },

  /* Floating label */
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 14,
    paddingHorizontal: 6,
    fontSize: 16,
    fontWeight: theme.fonts.weight.black,
    color: theme.colors.text,
    backgroundColor: '#fff',
    zIndex: 2,
    fontFamily: theme.fonts.poppins.bold,
  },
  surfaceLabel: {
    backgroundColor: '#FFFDFD',
  },
  modalLabel: {
    backgroundColor: '#fff',
  },

  /* ================= Selector / Input ================= */
  selector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 56,
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 13,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
  },

  inputWrapper: {
    position: 'relative',
  },
  inputWithLabel: {
    paddingTop: 16,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
    fontFamily: theme.fonts.poppins.regular,
    height: 56,
  },

  inlineRow: {
    flexDirection: 'row',
    gap: theme.spacing.gap,
    alignItems: 'center',
  },
  flexInput: {
    flex: 1,
  },

  /* ================= Button ================= */
  buttonWrapper: {
    marginTop: theme.spacing.gap * 18,
    paddingHorizontal: theme.spacing.gap * 3,
  },

  /* ================= Modal / Bottom Sheet ================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.gap * 3,
    gap: theme.spacing.gap * 2,
    maxHeight: '90%',
    position: 'relative',
  },
  modalContentGap: {
    gap: theme.spacing.gap * 2,
  },
  bottomSheetTitle: {
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.light,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Options ================= */
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
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },
  optionTextActive: {
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },

  /* ================= Unit Picker ================= */
  unitPickerWrapper: {
    width: 110,
  },
  unitSelector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitSelectorActive: {
    borderColor: theme.colors.primary,
  },
  unitSelectorText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  unitDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  unitOptionText: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },
  unitOptionTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.poppins.bold,
  },

  dropdownScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

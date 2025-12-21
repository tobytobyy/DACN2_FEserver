import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

export const styles = StyleSheet.create({
  /* ================= Safe Area & Layout ================= */

  /** SafeAreaView wrapper */
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },

  /** Container chính của screen */
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#FFFDFD',
  },

  /* ================= Header ================= */

  /** Khối header (title + description) */
  header: {
    alignItems: 'center',
    gap: theme.spacing.xs * 3,
    marginTop: theme.spacing.gap * 2,
    marginBottom: theme.spacing.xl,
  },

  /** Tiêu đề chính */
  title: {
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontSize: theme.fonts.size.xl,
    fontWeight: theme.fonts.weight.bold,
    lineHeight: theme.spacing.lg,
  },

  /** Mô tả phụ dưới title */
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

  /** Khối avatar + username */
  avatarBlock: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  /** Text username */
  username: {
    color: theme.colors.subText_1,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.regular,
    fontSize: theme.fonts.size.lg,
    lineHeight: theme.spacing.lg,
  },

  /* ================= Form ================= */

  /** Container form */
  formContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.gap * 2,
  },

  /** Row layout cho 2 field ngang */
  row: {
    flexDirection: 'row',
    gap: theme.spacing.gap * 2,
  },

  /** Column chiếm đều chiều ngang */
  column: {
    flex: 1,
  },

  /** Wrapper cho từng field */
  fieldContainer: {
    marginTop: theme.spacing.xs,
    position: 'relative',
  },

  /* ================= Floating Label ================= */

  /** Floating label chung */
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

  /** Label dùng trên surface screen */
  surfaceLabel: {
    backgroundColor: '#FFFDFD',
  },

  /** Label dùng trong modal */
  modalLabel: {
    backgroundColor: '#fff',
  },

  /* ================= Selector / Input ================= */

  /** Selector dạng readonly (gender, birthday, …) */
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

  /** Text hiển thị trong selector */
  selectorText: {
    fontSize: 13,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
  },

  /** Wrapper cho input có floating label */
  inputWrapper: {
    position: 'relative',
  },

  /** Padding top để tránh label đè lên text */
  inputWithLabel: {
    paddingTop: 16,
  },

  /** TextInput */
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

  /** Row dùng cho unit picker + input */
  inlineRow: {
    flexDirection: 'row',
    gap: theme.spacing.gap,
    alignItems: 'center',
  },

  /** Input chiếm phần còn lại */
  flexInput: {
    flex: 1,
  },

  /* ================= Button ================= */

  /** Wrapper cho button cuối form */
  buttonWrapper: {
    marginTop: theme.spacing.gap * 18,
    paddingHorizontal: theme.spacing.gap * 3,
  },

  /* ================= Modal / Bottom Sheet ================= */

  /** Overlay mờ phía sau modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  /** Container giữ bottom sheet ở dưới màn hình */
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },

  /** Nội dung bottom sheet */
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.gap * 3,
    gap: theme.spacing.gap * 2,
    maxHeight: '90%',
    position: 'relative',
  },

  /** Khoảng cách nội dung trong modal */
  modalContentGap: {
    gap: theme.spacing.gap * 2,
  },

  /** Title trong bottom sheet */
  bottomSheetTitle: {
    fontSize: theme.fonts.size.sm,
    fontWeight: theme.fonts.weight.light,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },

  /* ================= Options ================= */

  /** Option button (gender, etc.) */
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },

  /** Option đang active */
  optionButtonActive: {
    backgroundColor: '#E0ECFF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  /** Text option */
  optionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },

  /** Text option active */
  optionTextActive: {
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },

  /* ================= Unit Picker ================= */

  /** Wrapper cho unit picker */
  unitPickerWrapper: {
    width: 110,
  },

  /** Button hiển thị unit */
  unitSelector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  /** Selector khi đang mở */
  unitSelectorActive: {
    borderColor: theme.colors.primary,
  },

  /** Text unit */
  unitSelectorText: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },

  /** Dropdown danh sách unit */
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

    // Shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    // Shadow Android
    elevation: 4,
  },

  /** Từng option trong dropdown */
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  /** Text unit option */
  unitOptionText: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.regular,
  },

  /** Unit option đang được chọn */
  unitOptionTextActive: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.poppins.bold,
  },

  /** Lớp phủ bắt touch khi dropdown mở (nếu cần) */
  dropdownScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
export default styles;

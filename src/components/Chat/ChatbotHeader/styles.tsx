import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* ================= Header ================= */

  /** Container header chính */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',

    // Shadow Android
    elevation: 2,

    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  /* ================= Left Area ================= */

  /** Khu vực bên trái: menu + title */
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /** Nút menu */
  menuButton: {
    padding: 4,
  },

  /** Wrapper cho title + status */
  titleTextArea: {
    marginLeft: 12,
  },

  /* ================= Text ================= */

  /** Tiêu đề chatbot */
  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  /** Row hiển thị trạng thái */
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  /** Text trạng thái (Online / Đang trả lời) */
  status: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 0,
    fontWeight: '500',
  },
});

export default styles;

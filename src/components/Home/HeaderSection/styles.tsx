import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* ================= Background ================= */

  /**
   * Nền phía sau của Header
   * - Màu xanh mint
   * - Bo tròn góc dưới
   * - position absolute để nằm trên cùng màn hình
   */
  headerBackground: {
    backgroundColor: '#98F6D6',
    height: 240,
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
    zIndex: 0,
  },

  /* ================= Content ================= */

  /**
   * Container nội dung header
   * - Chứa text chào + avatar
   * - Layout ngang, canh giữa theo chiều dọc
   */
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* ================= Greeting ================= */

  /**
   * Hàng hiển thị icon 👋 + chữ Hello
   */
  helloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  /** Emoji vẫy tay */
  waveIcon: {
    fontSize: 18,
  },

  /** Text lời chào (Hello / Xin chào / Hi) */
  helloText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  /**
   * Tên user hiển thị dưới lời chào
   * - Font to để làm điểm nhấn
   */
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },

  /* ================= Avatar ================= */

  /**
   * Wrapper cho avatar
   * - padding nhỏ để dễ bấm (hit area)
   */
  avatarButton: {
    padding: 4,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2F1',
  },
});

export default styles;

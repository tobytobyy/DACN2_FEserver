import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* ================= Container ================= */

  /** Wrapper chính của danh sách chat */
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* ================= Message Row ================= */

  /** Row chứa avatar + bubble message */
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
  },

  /** Avatar của assistant (bot) */
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#21C4A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  /** Căn phải cho message của user */
  messageRowRight: {
    justifyContent: 'flex-end',
  },

  /* ================= Message Bubble ================= */

  /** Bubble message chung */
  messageBox: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',

    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,

    // Shadow Android
    elevation: 1,
  },

  /** Bubble riêng cho user */
  messageBoxUser: {
    backgroundColor: '#DCFCE7',
  },

  /* ================= Text ================= */

  /** Nội dung text message */
  messageText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },
});

export default styles;

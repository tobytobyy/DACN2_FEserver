import { StyleSheet } from 'react-native';
import { theme } from '@assets/theme';

const styles = StyleSheet.create({
  /* ================= Input Area ================= */

  /** Container chính của khu vực nhập chat */
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    paddingBottom: 30, // chừa khoảng cho safe area / gesture bar
  },

  /** Khu vực chứa input + attachments */
  inputContentArea: {
    height: 50,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* ================= Attachments ================= */

  /** Row hiển thị danh sách file đính kèm (scroll ngang) */
  attachmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },

  /** Chip hiển thị từng file đính kèm */
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  /** Tên file */
  attachmentName: {
    maxWidth: 120,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },

  /** Dung lượng file */
  attachmentSize: {
    fontSize: 12,
    color: '#475569',
  },

  /** Nút xoá file */
  attachmentRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CBD5E1',
  },

  /** Trạng thái nhấn giữ nút xoá */
  attachmentRemovePressed: {
    backgroundColor: '#CBD5E1',
  },

  /** Text dấu × */
  attachmentRemoveText: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '800',
  },

  /* ================= Text Input ================= */

  /** Ô nhập nội dung chat */
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    color: '#0F172A',
    height: 44,
  },

  /* ================= Buttons ================= */

  /** Icon button (attach / voice) */
  iconButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Nút gửi tin nhắn */
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.subText_2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,

    // Shadow iOS
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Shadow Android
    elevation: 4,

    // Mặc định hơi mờ (enable sẽ override)
    opacity: 0.5,
  },

  /** Trạng thái disabled của nút Send */
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default styles;

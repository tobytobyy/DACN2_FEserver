import { theme } from '@assets/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* ================= Overlay ================= */

  /** Overlay phủ toàn màn hình phía sau drawer */
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // nền tối mờ
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1000,
  },

  /* ================= Drawer ================= */

  /** Container drawer trượt từ cạnh trái */
  drawer: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',

    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Shadow Android
    elevation: 10,
  },

  /** SafeArea wrapper cho drawer */
  safeArea: {
    flex: 1,
  },

  /** Nội dung chính của drawer */
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* ================= Text ================= */

  /** Tiêu đề drawer */
  drawerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
    marginTop: 10,
  },

  /* ================= History Items ================= */

  historyList: {
    flex: 1,
  },

  historyListContent: {
    paddingBottom: 12,
  },

  historyItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  historyTitle: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
    marginBottom: 4,
  },

  historyPreview: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },

  /** Style khi item được nhấn giữ */
  drawerItemPressed: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },

  /** Text trong drawer item */
  drawerItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },

  newChatButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 30,
  },

  newChatButtonPressed: {
    backgroundColor: '#0284C7',
  },
});

export default styles;

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

  /* ================= Drawer Items ================= */

  /** Item trong drawer (button option) */
  drawerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginBottom: 12,
  },

  /** Style khi item được nhấn giữ */
  drawerItemPressed: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },

  /** Text trong drawer item */
  drawerItemText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  /* ================= Wrapper ================= */

  /** Wrapper ngoài của danh sách suggestion */
  wrapper: {
    marginTop: 8,
    paddingHorizontal: 16,
  },

  /* ================= Container ================= */

  /** Container cho ScrollView (áp dụng gap & padding) */
  container: {
    gap: 8,
    paddingVertical: 4,
  },

  /* ================= Suggestion Button ================= */

  /** Button gợi ý (quick reply) */
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',

    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,

    // Shadow Android
    elevation: 2,
  },

  /** Style khi button đang được nhấn */
  suggestionButtonPressed: {
    backgroundColor: '#F8FAFC',
  },

  /* ================= Icon ================= */

  /** Icon tròn bên trái suggestion */
  suggestionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  /* ================= Text ================= */

  /** Text label của suggestion */
  suggestionLabel: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
});

export default styles;

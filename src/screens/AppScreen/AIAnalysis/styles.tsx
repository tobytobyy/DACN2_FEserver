import { StyleSheet } from 'react-native';
/* ======================================================
 * Styles
 * - Tách rõ layout / header / content
 * ====================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D8C83',
  },

  /* Content */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#0F766E',
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#ECFEFF',
    fontSize: 16,
    fontWeight: '700',
  },
  score: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
  },
  summary: {
    color: '#CCFBF1',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  listItem: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  feedbackCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  feedbackHint: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  ratingButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  ratingButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  ratingText: {
    color: '#334155',
    fontWeight: '700',
  },
  ratingTextActive: {
    color: '#FFFFFF',
  },
  feedbackInput: {
    minHeight: 84,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  disclaimer: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default styles;

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: { marginTop: 16, marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  seeMoreText: { fontSize: 13, color: '#2D8C83', fontWeight: '500' },
  articleRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  thumbnail: { width: 80, height: 80 },
  thumbnailPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: { fontSize: 28 },
  articleContent: { flex: 1, padding: 10, justifyContent: 'center' },
  articleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
  },
  articleMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
});

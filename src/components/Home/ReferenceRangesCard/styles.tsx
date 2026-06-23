import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  card: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardNormal: { borderColor: '#10B981' },
  cardLow: { borderColor: '#F97316' },
  cardHigh: { borderColor: '#EF4444' },
  emoji: { fontSize: 22, marginBottom: 6 },
  metricName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  rangeText: { fontSize: 12, color: '#6B7280' },
  unitText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
});

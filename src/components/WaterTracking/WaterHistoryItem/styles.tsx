// src/screens/WaterTracker/components/WaterHistoryItem/styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
  },
  deleteBtn: {
    padding: 8,
  },
  deleteIcon: {
    color: '#94A3B8',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
});

export default styles;

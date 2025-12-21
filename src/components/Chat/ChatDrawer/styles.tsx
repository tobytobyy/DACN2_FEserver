import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1000,
  },
  drawer: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: { flex: 1 },
  drawerContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
    marginTop: 10,
  },
  drawerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginBottom: 12,
  },
  drawerItemPressed: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
  drawerItemText: { fontSize: 16, color: '#334155', fontWeight: '600' },
});

export default styles;

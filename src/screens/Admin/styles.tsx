import { StyleSheet } from 'react-native';
// ==========================================
// CẤU HÌNH STYLES GIAO DIỆN
// ==========================================
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerSub: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 15,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    // Shadow cho Android
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  actionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#BDBDBD',
  },
});

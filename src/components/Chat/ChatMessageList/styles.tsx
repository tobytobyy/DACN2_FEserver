import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#21C4A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageBox: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  messageBoxUser: {
    backgroundColor: '#DCFCE7',
  },
  messageText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },
});

export default styles;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  container: {
    gap: 8,
    paddingVertical: 4,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionButtonPressed: {
    backgroundColor: '#F8FAFC',
  },
  suggestionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  suggestionLabel: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
});

export default styles;

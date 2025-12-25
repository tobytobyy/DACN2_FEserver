// src/screens/WaterTracker/components/WaterSettingsModal/styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  settingRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustText: {
    color: '#0EA5E9',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  saveBtn: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;

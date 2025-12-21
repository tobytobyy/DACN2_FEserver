import { StyleSheet } from 'react-native';

import { theme } from '@assets/theme';

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    paddingBottom: 30,
  },
  inputContentArea: {
    height: 50,
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attachmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  attachmentName: {
    maxWidth: 120,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  attachmentSize: {
    fontSize: 12,
    color: '#475569',
  },
  attachmentRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CBD5E1',
  },
  attachmentRemovePressed: {
    backgroundColor: '#CBD5E1',
  },
  attachmentRemoveText: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '800',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    color: '#0F172A',
    height: 44,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.subText_2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    opacity: 0.5,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default styles;

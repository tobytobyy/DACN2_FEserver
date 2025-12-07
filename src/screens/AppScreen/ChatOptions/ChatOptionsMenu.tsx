import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onHistoryChat: () => void;
}

const ChatOptionsMenu: React.FC<Props> = ({
  visible,
  onClose,
  onNewChat,
  onHistoryChat,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem} onPress={onNewChat}>
            <Text style={styles.menuText}>New Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={onHistoryChat}>
            <Text style={styles.menuText}>History Chat AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={onClose}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  menuBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  menuItem: { paddingVertical: 12 },
  menuText: { fontSize: 16, color: '#0F172A', fontWeight: '500' },
  closeText: {
    color: '#EF4444',
  },
});

export default ChatOptionsMenu;

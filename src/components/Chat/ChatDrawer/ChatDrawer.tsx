import React from 'react';
import {
  Animated,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles';

/**
 * Props cho ChatDrawer
 * - visible: trạng thái hiển thị drawer
 * - drawerAnim: Animated.Value điều khiển translateX (slide in/out)
 * - onClose: đóng drawer
 * - onNewConversation: tạo hội thoại mới
 * - onNavigateHistory: điều hướng sang màn lịch sử chat
 */
interface ChatDrawerProps {
  visible: boolean;
  drawerAnim: Animated.Value;
  onClose: () => void;
  onNewConversation: () => void;
  onNavigateHistory: () => void;
}

/**
 * ChatDrawer
 * - Drawer trượt từ cạnh (thường là trái) hiển thị các option
 * - Nhấn ra ngoài overlay để đóng
 * - Nhấn vào item sẽ đóng drawer trước, sau đó chạy action tương ứng
 */
const ChatDrawer: React.FC<ChatDrawerProps> = ({
  visible,
  drawerAnim,
  onClose,
  onNewConversation,
  onNavigateHistory,
}) => {
  // Không hiển thị drawer khi visible = false (giảm render không cần thiết)
  if (!visible) return null;

  return (
    /**
     * Lớp overlay:
     * - Bấm ra ngoài drawer sẽ gọi onClose
     */
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.drawerOverlay}>
        {/**
         * Chặn việc bấm bên trong drawer bị "bong bóng" ra overlay
         * - TouchableWithoutFeedback rỗng để absorb touch
         */}
        <TouchableWithoutFeedback>
          {/* Drawer trượt bằng Animated translateX */}
          <Animated.View
            style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}
          >
            {/* Safe area để không đè lên notch/status bar */}
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.drawerContent}>
                {/* Tiêu đề */}
                <Text style={styles.drawerTitle}>Options</Text>

                {/* Option: New Conversation */}
                <Pressable
                  style={({ pressed }) => [
                    styles.drawerItem,
                    pressed && styles.drawerItemPressed, // hiệu ứng khi nhấn giữ
                  ]}
                  onPress={() => {
                    onClose(); // đóng drawer trước
                    onNewConversation(); // sau đó tạo cuộc hội thoại mới
                  }}
                >
                  <Text style={styles.drawerItemText}>New Conversation</Text>
                </Pressable>

                {/* Option: Chat History */}
                <Pressable
                  style={({ pressed }) => [
                    styles.drawerItem,
                    pressed && styles.drawerItemPressed,
                  ]}
                  onPress={() => {
                    onClose(); // đóng drawer trước
                    onNavigateHistory(); // sau đó điều hướng lịch sử chat
                  }}
                >
                  <Text style={styles.drawerItemText}>Chat History</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatDrawer;

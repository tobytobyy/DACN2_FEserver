import React from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatHistoryItem } from '@screens/AppScreen/ChatBot/Chatbot.types';

import styles from './styles';

/**
 * Props cho ChatDrawer
 * - visible: trạng thái hiển thị drawer
 * - drawerAnim: Animated.Value điều khiển translateX (slide in/out)
 * - histories: danh sách lịch sử chat (mới nhất -> cũ nhất)
 * - onClose: đóng drawer
 * - onNewConversation: tạo hội thoại mới
 * - onSelectHistory: chọn hội thoại cụ thể
 */
interface ChatDrawerProps {
  visible: boolean;
  drawerAnim: Animated.Value;
  histories: ChatHistoryItem[];
  onClose: () => void;
  onNewConversation: () => void;
  onSelectHistory: (historyId: string) => void;
}

/**
 * ChatDrawer
 * - Drawer trượt từ cạnh (thường là trái) hiển thị danh sách hội thoại
 * - Nhấn ra ngoài overlay để đóng
 * - Nhấn vào item sẽ đóng drawer trước, sau đó chạy action tương ứng
 */
const ChatDrawer: React.FC<ChatDrawerProps> = ({
  visible,
  drawerAnim,
  histories,
  onClose,
  onNewConversation,
  onSelectHistory,
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
                <Text style={styles.drawerTitle}>Conversation</Text>

                <ScrollView
                  style={styles.historyList}
                  contentContainerStyle={styles.historyListContent}
                  showsVerticalScrollIndicator={false}
                >
                  {histories.map(history => {
                    const lastMessage =
                      history.messages[history.messages.length - 1];

                    return (
                      <Pressable
                        key={history.id}
                        style={({ pressed }) => [
                          styles.historyItem,
                          pressed && styles.drawerItemPressed,
                        ]}
                        onPress={() => {
                          onClose();
                          onSelectHistory(history.id);
                        }}
                      >
                        <Text style={styles.historyTitle}>{history.title}</Text>

                        {lastMessage && (
                          <Text style={styles.historyPreview} numberOfLines={2}>
                            {lastMessage.content}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Pressable
                  style={({ pressed }) => [
                    styles.newChatButton,
                    pressed && styles.newChatButtonPressed,
                  ]}
                  onPress={() => {
                    onClose();
                    onNewConversation();
                  }}
                >
                  <Text style={styles.drawerItemText}>New Conversation</Text>
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

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView,
  Pressable, // 1. Import Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Giả định đường dẫn import giống code bạn cung cấp, hãy điều chỉnh nếu cần
import { ChatbotStackParamList } from '@navigation/AppStack/ChatbotStack';

// SVG icons
import MenuIcon from '@assets/icons/svgs/menu_dot_2020.svg';
import ChatAiIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import AttachIcon from '@assets/icons/svgs/attach_1515.svg';
import VoiceIcon from '@assets/icons/svgs/voice_1520.svg';
import ArrowRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import { theme } from '@assets/theme';

const DRAWER_WIDTH = 280; // Tăng nhẹ độ rộng để thoáng hơn

// Animated value cố định cho drawer (không dùng hook)
const drawerAnim = new Animated.Value(-DRAWER_WIDTH);

const ChatbotScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [message, setMessage] = useState('');

  const navigation =
    useNavigation<NativeStackNavigationProp<ChatbotStackParamList>>();

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      console.log('Tin nhắn gửi đi:', message);
      setMessage('');
    }
  };

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250, // Mượt mà hơn chút
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setDrawerVisible(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
            <MenuIcon width={24} height={24} />
          </TouchableOpacity>
          <View style={styles.titleTextArea}>
            <Text style={styles.title}>Health Assistant</Text>
            <View style={styles.statusRow}>
              <DotIcon width={10} height={10} color={theme.colors.primary} />
              <Text style={styles.status}>Online</Text>
            </View>
          </View>
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <View style={styles.messageRow}>
          {/* ICON TRÒN MÀU XANH */}
          <View style={styles.botAvatar}>
            <ChatAiIcon width={24} height={24} />
          </View>

          {/* BONG BÓNG CHAT */}
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>
              Hi there! I am your AI health assistant. Based on today's data,
              your heart rate is quite stable (78 BPM).
            </Text>
            <Text style={styles.messageText}>
              Is there anything else I can help you with?
            </Text>

            <Text style={styles.timestamp}>09:41</Text>
          </View>
        </View>
      </View>

      {/* INPUT – nhích lên khỏi bottom tabs */}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.iconButton}>
          <AttachIcon width={24} height={24} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
        />

        {message.trim().length > 0 ? (
          <TouchableOpacity
            style={styles.sendButton} // Style riêng cho nút gửi
            onPress={handleSendMessage}
          >
            <ArrowRightIcon width={20} height={20} fill="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton}>
            <VoiceIcon width={20} height={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* DRAWER FULL HEIGHT TRÁI -> PHẢI */}
      {drawerVisible && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.drawerOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.drawer,
                  { transform: [{ translateX: drawerAnim }] },
                ]}
              >
                <SafeAreaView style={{ flex: 1 }}>
                  <View style={styles.drawerContent}>
                    <Text style={styles.drawerTitle}>Options</Text>

                    {/* 2. Sử dụng Pressable để tạo hiệu ứng hover/pressed */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.drawerItem,
                        pressed && styles.drawerItemPressed, // Style khi nhấn
                      ]}
                      onPress={() => {
                        closeDrawer();
                        console.log('New Conversation');
                      }}
                    >
                      <Text style={styles.drawerItemText}>
                        New Conversation
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.drawerItem,
                        pressed && styles.drawerItemPressed, // Style khi nhấn
                      ]}
                      onPress={() => {
                        closeDrawer();
                        navigation.navigate('HistoryChat' as any);
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
      )}
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000', // Thêm shadow cho iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 4,
  },
  titleTextArea: {
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    color: '#22C55E',
    marginLeft: 4,
    fontWeight: '500',
  },

  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Hàng chứa avatar + bubble
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  // Vòng tròn xanh chứa icon bot
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#21C4A7', // màu xanh giống hình
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  messageBox: {
    flexShrink: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    // shadow nhẹ giống card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  messageContent: {
    marginLeft: 12,
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  // Drawer Styles
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // Màu overlay tối hơn chút cho hiện đại
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1000, // Đảm bảo drawer luôn nằm trên cùng
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
    marginTop: 10,
  },
  // Style item mặc định
  drawerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9', // Nền xám nhạt mặc định
    borderRadius: 12,
    marginBottom: 12,
  },
  // 3. Style item khi nhấn (hiệu ứng hover)
  drawerItemPressed: {
    backgroundColor: '#E2E8F0', // Nền đậm hơn khi nhấn
    borderColor: '#CBD5E1', // Viền đậm hơn
  },
  drawerItemText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
});

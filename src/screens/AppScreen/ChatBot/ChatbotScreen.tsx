import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Pressable,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';

import { ChatbotStackParamList } from '@navigation/AppStack/ChatbotStack';

// SVG icons
import MenuIcon from '@assets/icons/svgs/menu_dot_2020.svg';
import ChatAiIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import AttachIcon from '@assets/icons/svgs/attach_1515.svg';
import VoiceIcon from '@assets/icons/svgs/voice_1520.svg';
import ArrowRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import { theme } from '@assets/theme';

const DRAWER_WIDTH = 280;
const drawerAnim = new Animated.Value(-DRAWER_WIDTH);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// cooldown giữa 2 lần gửi, tránh spam
const MIN_INTERVAL_MS = 2000;

// ====== GROQ API KEY ======
// TODO: DÁN KEY GROQ CỦA BẠN VÀO ĐÂY (ví dụ: gsk_xxx)
//
// ⚠️ Đừng commit file này lên GitHub public nếu còn key thật.
const GROQ_API_KEY = '';

// Hàm gọi Groq (OpenAI-compatible endpoint)
const callGroq = async (payload: any) => {
  const res = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    payload,
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    },
  );
  return res;
};

const ChatbotScreen: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi there! I am your AI health assistant. Based on today's data, your heart rate is quite stable (78 BPM).",
    },
  ]);

  const navigation =
    useNavigation<NativeStackNavigationProp<ChatbotStackParamList>>();

  const lastRequestTsRef = useRef<number>(0);

  const handleSendMessage = async (): Promise<void> => {
    if (message.trim().length === 0 || isLoading) return;

    // throttle gửi quá nhanh
    const now = Date.now();
    if (now - lastRequestTsRef.current < MIN_INTERVAL_MS) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Bạn đang gửi quá nhanh, vui lòng đợi một chút rồi thử lại.',
        },
      ]);
      return;
    }
    lastRequestTsRef.current = now;

    const newMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const recentMessages = messages.slice(-10);

      const payload = {
        // Model trên Groq – Llama 3, 8B, context 8K
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'Bạn là một trợ lý AI chỉ trả lời các câu hỏi liên quan đến sức khỏe. Nếu câu hỏi không liên quan đến sức khỏe, hãy từ chối trả lời.',
          },
          ...recentMessages,
          newMessage,
        ],
      };

      const response = await callGroq(payload);
      const aiReply: string = response.data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error: any) {
      console.error(
        'Groq error:',
        error.response?.status,
        JSON.stringify(error.response?.data || {}, null, 2),
      );

      let errorMessage = 'Có lỗi xảy ra khi gọi Groq API.';
      const status = error.response?.status;

      if (status === 401) {
        errorMessage =
          'GROQ API key không hợp lệ hoặc bị từ chối (401 Unauthorized). Vui lòng kiểm tra lại key.';
      } else if (status === 429) {
        const serverMsg = error.response?.data?.error?.message;
        if (
          typeof serverMsg === 'string' &&
          serverMsg.toLowerCase().includes('quota')
        ) {
          errorMessage =
            'Bạn đã vượt quá hạn mức (quota) của Groq. Vui lòng kiểm tra lại usage/quota trên Groq.';
        } else {
          errorMessage =
            'Bạn đang gửi quá nhiều yêu cầu hoặc bị giới hạn bởi Groq (429). Vui lòng thử lại sau một lát.';
        }
      } else if (status) {
        const serverMsg = error.response?.data?.error?.message;
        if (serverMsg) {
          errorMessage = `Lỗi ${status}: ${serverMsg}`;
        } else {
          errorMessage = `Đã xảy ra lỗi (HTTP ${status}).`;
        }
      } else if (error.message) {
        errorMessage = `Lỗi mạng: ${error.message}`;
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openDrawer = (): void => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = (): void => {
    Animated.timing(drawerAnim, {
      toValue: -DRAWER_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setDrawerVisible(false);
    });
  };

  const renderMessage: ListRenderItem<ChatMessage> = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.role === 'user' && styles.messageRowRight,
      ]}
    >
      {item.role === 'assistant' && (
        <View style={styles.botAvatar}>
          <ChatAiIcon width={24} height={24} />
        </View>
      )}
      <View
        style={[
          styles.messageBox,
          item.role === 'user' && styles.messageBoxUser,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

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
              <Text style={styles.status}>
                {isLoading ? 'Đang trả lời...' : 'Online'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessage}
        />
      </View>

      {/* INPUT */}
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
            style={[styles.sendButton, isLoading && styles.handleSend]}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            <ArrowRightIcon width={20} height={20} fill="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} disabled={isLoading}>
            <VoiceIcon width={20} height={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* DRAWER */}
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
                <SafeAreaView style={styles.safeArea}>
                  <View style={styles.drawerContent}>
                    <Text style={styles.drawerTitle}>Options</Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.drawerItem,
                        pressed && styles.drawerItemPressed,
                      ]}
                      onPress={() => {
                        closeDrawer();
                        setMessages([]);
                      }}
                    >
                      <Text style={styles.drawerItemText}>
                        New Conversation
                      </Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.drawerItem,
                        pressed && styles.drawerItemPressed,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  titleArea: { flexDirection: 'row', alignItems: 'center' },
  menuButton: { padding: 4 },
  titleTextArea: { marginLeft: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  status: { fontSize: 12, color: '#22C55E', marginLeft: 4, fontWeight: '500' },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#21C4A7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  handleSend: {
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  messageBox: {
    flexShrink: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: { fontSize: 14, color: '#0F172A', lineHeight: 20 },
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

  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    zIndex: 1000,
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
  drawerContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 24,
    marginTop: 10,
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageBoxUser: {
    backgroundColor: '#DCFCE7',
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

export default ChatbotScreen;

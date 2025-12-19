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
  ScrollView,
} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios, { isCancel } from 'axios';

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
  const [attachedFiles, setAttachedFiles] = useState<DocumentPickerResponse[]>(
    [],
  );
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

  const suggestions = [
    {
      label: 'Tình hình sức khỏe hôm nay',
      color: '#0EA5E9',
    },
    {
      label: 'Nhịp tim trung bình tuần này',
      color: '#22C55E',
    },
    {
      label: 'Gợi ý bài tập nhẹ',
      color: '#F59E0B',
    },
    {
      label: 'Lượng nước đã uống',
      color: '#6366F1',
    },
    {
      label: 'Nhắc nhở giấc ngủ',
      color: '#EF4444',
    },
  ];

  const handleSuggestionPress = (text: string): void => {
    setMessage(text);
  };

  const formatFileSize = (size?: number | null): string => {
    if (!size) return '';
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const handleAttachFile = async (): Promise<void> => {
    if (isLoading) return;

    try {
      const results = await pick({
        allowMultiSelection: true,
        type: [types.allFiles],
      });

      if (results?.length) {
        setAttachedFiles(prev => [...prev, ...results]);
      }
    } catch (err) {
      if (isCancel(err)) return;

      console.error('DocumentPicker error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Không thể mở trình chọn tệp. Vui lòng kiểm tra quyền truy cập bộ nhớ và thử lại.',
        },
      ]);
    }
  };

  const removeAttachment = (uri: string): void => {
    setAttachedFiles(prev => prev.filter(file => file.uri !== uri));
  };

  const handleSendMessage = async (): Promise<void> => {
    if (
      (message.trim().length === 0 && attachedFiles.length === 0) ||
      isLoading
    )
      return;

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

    const attachmentText = attachedFiles.length
      ? `\n\nĐính kèm: ${attachedFiles
          .map(file => {
            const fileName = file.name || file.uri.split('/').pop() || 'Tệp';
            const sizeLabel = formatFileSize(file.size);
            return sizeLabel ? `${fileName} (${sizeLabel})` : fileName;
          })
          .join(', ')}`
      : '';

    const newMessage: ChatMessage = {
      role: 'user',
      content: `${message.trim()}${attachmentText}`.trim(),
    };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setAttachedFiles([]);
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

      {/* SUGGESTIONS */}
      <View style={styles.suggestionWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionContainer}
        >
          {suggestions.map(item => (
            <Pressable
              key={item.label}
              onPress={() => handleSuggestionPress(item.label)}
              style={({ pressed }) => [
                styles.suggestionButton,
                pressed && styles.suggestionButtonPressed,
              ]}
            >
              <View
                style={[
                  styles.suggestionIcon,
                  {
                    backgroundColor: `${item.color}1A`,
                    borderColor: item.color,
                  },
                ]}
              >
                <DotIcon width={12} height={12} color={item.color} />
              </View>
              <Text style={styles.suggestionLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* INPUT */}
      <View style={styles.inputArea}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleAttachFile}
          disabled={isLoading}
        >
          <AttachIcon width={24} height={24} />
        </TouchableOpacity>

        <View style={styles.inputContentArea}>
          {attachedFiles.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.attachmentsRow}
            >
              {attachedFiles.map(file => (
                <View key={file.uri} style={styles.attachmentChip}>
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {file.name || file.uri.split('/').pop() || 'Tệp'}
                  </Text>
                  {file.size ? (
                    <Text style={styles.attachmentSize}>
                      {formatFileSize(file.size)}
                    </Text>
                  ) : null}
                  <Pressable
                    onPress={() => removeAttachment(file.uri)}
                    style={({ pressed }) => [
                      styles.attachmentRemove,
                      pressed && styles.attachmentRemovePressed,
                    ]}
                  >
                    <Text style={styles.attachmentRemoveText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        {message.trim().length > 0 || attachedFiles.length > 0 ? (
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.handleSend]}
            onPress={handleSendMessage}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <ArrowRightIcon width={20} height={20} color="#FFFFFF" />
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
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputContentArea: {
    flex: 1,
    gap: 6,
  },
  attachmentsRow: {
    gap: 8,
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  attachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    maxWidth: 240,
    gap: 6,
  },
  attachmentName: {
    flexShrink: 1,
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },
  attachmentSize: {
    color: '#475569',
    fontSize: 12,
  },
  attachmentRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
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

  suggestionWrapper: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  suggestionContainer: {
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

export default ChatbotScreen;

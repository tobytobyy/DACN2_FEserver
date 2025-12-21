import React, { useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios, { isCancel } from 'axios';

import { ChatDrawer } from '@components/Chat/ChatDrawer';
import { ChatInputArea } from '@components/Chat/ChatInputArea';
import { ChatMessageList } from '@components/Chat/ChatMessageList';
import { ChatbotHeader } from '@components/Chat/ChatbotHeader';
import { ChatSuggestions } from '@components/Chat/ChatSuggestions';
import { ChatbotStackParamList } from '@navigation/AppStack/ChatbotStack';

import styles from './styles';
import { ChatMessage, ChatSuggestion } from './Chatbot.types';

const DRAWER_WIDTH = 280;

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

  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatbotStackParamList>>();

  const lastRequestTsRef = useRef<number>(0);

  const suggestions: ChatSuggestion[] = [
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

  return (
    <View style={styles.container}>
      <ChatbotHeader isLoading={isLoading} onMenuPress={openDrawer} />

      <ChatMessageList messages={messages} />

      <ChatSuggestions
        suggestions={suggestions}
        onSelect={handleSuggestionPress}
      />

      <ChatInputArea
        message={message}
        attachedFiles={attachedFiles}
        isLoading={isLoading}
        formatFileSize={formatFileSize}
        onChangeMessage={setMessage}
        onAttachFile={handleAttachFile}
        onRemoveAttachment={removeAttachment}
        onSend={handleSendMessage}
      />

      <ChatDrawer
        visible={drawerVisible}
        drawerAnim={drawerAnim}
        onClose={closeDrawer}
        onNewConversation={() => setMessages([])}
        onNavigateHistory={() =>
          navigation.navigate('HistoryChat' as keyof ChatbotStackParamList)
        }
      />
    </View>
  );
};

export default ChatbotScreen;

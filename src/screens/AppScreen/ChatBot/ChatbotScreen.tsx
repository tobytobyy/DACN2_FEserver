import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Pressable,
  View,
} from 'react-native';
import type { DocumentPickerResponse } from '@react-native-documents/picker';
import type { Asset } from 'react-native-image-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

import { ChatDrawer } from '@components/Chat/ChatDrawer';
import { ChatInputArea } from '@components/Chat/ChatInputArea';
import { ChatMessageList } from '@components/Chat/ChatMessageList';
import { ChatbotHeader } from '@components/Chat/ChatbotHeader';
import { ChatSuggestions } from '@components/Chat/ChatSuggestions';

import styles from './styles';
import { ChatHistoryItem, ChatMessage, ChatSuggestion } from './Chatbot.types';

const DRAWER_WIDTH = 280;

const MIN_INTERVAL_MS = 2000;

const hasImagePickerModule = (): boolean => {
  const modules = NativeModules || {};
  if (modules.ImagePickerManager || modules.RNCImagePicker) {
    return true;
  }

  return (
    typeof launchCamera === 'function' ||
    typeof launchImageLibrary === 'function'
  );
};

const requestAndroidPermission = async (
  permission: string,
  rationale: any,
): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.check(permission as any);
    if (granted) return true;

    const result = await PermissionsAndroid.request(
      permission as any,
      rationale,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn('Permission request failed', error);
    return false;
  }
};

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

const INITIAL_CHAT_HISTORY: ChatHistoryItem[] = [
  {
    id: 'chat-1',
    title: 'Theo dõi nhịp tim',
    updatedAt: '2024-09-14T10:30:00.000Z',
    messages: [
      {
        role: 'assistant',
        content:
          'Nhịp tim của bạn đang ổn định ở mức 78 BPM. Bạn có muốn kiểm tra xu hướng trong tuần không?',
      },
      {
        role: 'user',
        content: 'Tuần này tôi tập 3 buổi cardio, nhịp tim có ổn không?',
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Gợi ý bài tập',
    updatedAt: '2024-09-13T15:45:00.000Z',
    messages: [
      {
        role: 'assistant',
        content: 'Tôi có thể gợi ý bài tập nhẹ 20 phút giúp cải thiện sức bền.',
      },
      {
        role: 'user',
        content: 'Gợi ý bài tập nhẹ giúp thư giãn buổi tối.',
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'Theo dõi giấc ngủ',
    updatedAt: '2024-09-12T21:10:00.000Z',
    messages: [
      {
        role: 'assistant',
        content:
          'Bạn ngủ trung bình 7 giờ mỗi đêm. Tôi có thể nhắc bạn tắt màn hình sớm hơn 30 phút.',
      },
      {
        role: 'user',
        content: 'Tuần này tôi ngủ có đủ không?',
      },
    ],
  },
];

const sortHistories = (histories: ChatHistoryItem[]): ChatHistoryItem[] =>
  [...histories].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

const ChatbotScreen: React.FC = () => {
  const initialHistories = useMemo(
    () => sortHistories(INITIAL_CHAT_HISTORY),
    [],
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<DocumentPickerResponse[]>(
    [],
  );
  const [chatHistories, setChatHistories] =
    useState<ChatHistoryItem[]>(initialHistories);
  const [activeHistoryId, setActiveHistoryId] = useState<string>(
    initialHistories[0]?.id || '',
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialHistories[0]?.messages || [
      {
        role: 'assistant',
        content:
          "Hi there! I am your AI health assistant. Based on today's data, your heart rate is quite stable (78 BPM).",
      },
    ],
  );

  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

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

  const updateActiveHistoryMessages = (
    updatedMessages: ChatMessage[],
  ): void => {
    setMessages(updatedMessages);

    if (!activeHistoryId) return;

    setChatHistories(prev =>
      sortHistories(
        prev.map(history =>
          history.id === activeHistoryId
            ? {
                ...history,
                messages: updatedMessages,
                updatedAt: new Date().toISOString(),
              }
            : history,
        ),
      ),
    );
  };

  const assetsToAttachments = (assets: Asset[]): DocumentPickerResponse[] =>
    assets
      .filter(asset => asset.uri)
      .map(asset => ({
        uri: asset.uri ?? '',
        name: asset.fileName ?? 'photo.jpg',
        error: null,
        size: asset.fileSize ?? null,
        type: asset.type ?? 'image/jpeg',
        nativeType: asset.type ?? null,
        isVirtual: false,
        convertibleToMimeTypes: null,
        hasRequestedType: true,
        fileCopyUri: null,
      }));

  const showPickerError = (title: string, description?: string): void => {
    updateActiveHistoryMessages([
      ...messages,
      {
        role: 'assistant',
        content: `${title}. ${
          description || 'Vui lòng kiểm tra quyền truy cập và thử lại.'
        }`,
      },
    ]);
  };

  const ensureCameraPermission = async (): Promise<boolean> => {
    const cameraGranted = await requestAndroidPermission(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Quyền truy cập camera',
        message: 'Ứng dụng cần quyền truy cập camera để chụp ảnh.',
        buttonPositive: 'Đồng ý',
        buttonNegative: 'Từ chối',
      },
    );

    if (!cameraGranted) return false;

    // Older Android versions require storage permission to save the taken photo
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const writeGranted = await requestAndroidPermission(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Quyền lưu ảnh',
          message: 'Ứng dụng cần quyền lưu ảnh vừa chụp vào thư viện.',
          buttonPositive: 'Đồng ý',
          buttonNegative: 'Từ chối',
        },
      );

      return writeGranted;
    }

    return true;
  };

  const ensureMediaPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const permissions = (
      Platform.Version >= 33
        ? [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
        : [
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]
    ).filter(Boolean);

    if (permissions.length === 0) return true;

    try {
      const alreadyGranted = await Promise.all(
        permissions.map(permission =>
          PermissionsAndroid.check(permission as any),
        ),
      );

      if (alreadyGranted.every(Boolean)) return true;
      const results = await PermissionsAndroid.requestMultiple(
        permissions as any,
      );

      return permissions.every(
        key => results[key] === PermissionsAndroid.RESULTS.GRANTED,
      );
    } catch (error) {
      console.warn('Permission request failed', error);
      return false;
    }
  };

  const handleTakePhoto = async (): Promise<void> => {
    setIsAttachmentMenuVisible(false);

    if (!hasImagePickerModule()) {
      showPickerError(
        'Không thể mở camera',
        'Thư viện chọn ảnh chưa được cấu hình trên thiết bị. Hãy cài đặt native module react-native-image-picker (android/ios) và chạy lại ứng dụng.',
      );
      return;
    }

    const hasCameraAccess = await ensureCameraPermission();
    if (!hasCameraAccess) {
      showPickerError(
        'Không thể mở camera',
        'Quyền truy cập camera bị từ chối. Hãy cấp quyền trong phần Cài đặt và thử lại.',
      );
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        showPickerError('Không thể mở camera', result.errorMessage);
        return;
      }

      if (result.assets?.length) {
        setAttachedFiles(prev => [
          ...prev,
          ...assetsToAttachments(result.assets ?? []),
        ]);
      }
    } catch (error) {
      showPickerError(
        'Không thể mở camera',
        error instanceof Error
          ? error.message
          : 'Thư viện chọn ảnh chưa được cài đặt hoặc chưa liên kết.',
      );
    }
  };

  const handleSelectPhotoFromLibrary = async (): Promise<void> => {
    setIsAttachmentMenuVisible(false);

    if (!hasImagePickerModule()) {
      showPickerError(
        'Không thể mở thư viện ảnh',
        'Thư viện chọn ảnh chưa được cấu hình trên thiết bị. Hãy cài đặt native module react-native-image-picker (android/ios) và chạy lại ứng dụng.',
      );
      return;
    }

    const hasMediaAccess = await ensureMediaPermission();
    if (!hasMediaAccess) {
      showPickerError(
        'Không thể mở thư viện ảnh',
        'Quyền truy cập thư viện ảnh bị từ chối. Hãy cấp quyền trong phần Cài đặt và thử lại.',
      );
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        showPickerError('Không thể mở thư viện ảnh', result.errorMessage);
        return;
      }

      if (result.assets?.length) {
        setAttachedFiles(prev => [
          ...prev,
          ...assetsToAttachments(result.assets ?? []),
        ]);
      }
    } catch (error) {
      showPickerError(
        'Không thể mở thư viện ảnh',
        error instanceof Error
          ? error.message
          : 'Thư viện chọn ảnh chưa được cài đặt hoặc chưa liên kết.',
      );
    }
  };

  const handleToggleAttachmentMenu = (): void => {
    if (isLoading) return;
    setIsAttachmentMenuVisible(prev => !prev);
  };

  const handleCloseAttachmentMenu = (): void => {
    setIsAttachmentMenuVisible(false);
  };

  const removeAttachment = (uri: string): void => {
    setAttachedFiles(prev => prev.filter(file => file.uri !== uri));
  };

  const handleSelectHistory = (historyId: string): void => {
    const selectedHistory = chatHistories.find(
      history => history.id === historyId,
    );
    if (!selectedHistory) return;

    setActiveHistoryId(historyId);
    setMessages(selectedHistory.messages);
  };

  const handleCreateNewConversation = (): void => {
    const now = new Date();
    const newHistory: ChatHistoryItem = {
      id: `chat-${now.getTime()}`,
      title: `Cuộc trò chuyện mới ${chatHistories.length + 1}`,
      updatedAt: now.toISOString(),
      messages: [
        {
          role: 'assistant',
          content:
            'Xin chào! Tôi có thể hỗ trợ bạn theo dõi sức khỏe. Bạn muốn hỏi điều gì?',
        },
      ],
    };

    setChatHistories(prev => sortHistories([newHistory, ...prev]));
    setActiveHistoryId(newHistory.id);
    setMessages(newHistory.messages);
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
      updateActiveHistoryMessages([
        ...messages,
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
    const updatedMessages = [...messages, newMessage];

    updateActiveHistoryMessages(updatedMessages);
    setMessage('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const recentMessages = updatedMessages.slice(-10);

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

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiReply,
      };

      updateActiveHistoryMessages([...updatedMessages, assistantMessage]);
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

      updateActiveHistoryMessages([
        ...updatedMessages,
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
      {isAttachmentMenuVisible && (
        <Pressable
          style={styles.attachmentBackdrop}
          onPress={handleCloseAttachmentMenu}
        />
      )}

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
        attachmentMenuVisible={isAttachmentMenuVisible}
        formatFileSize={formatFileSize}
        onChangeMessage={setMessage}
        onToggleAttachmentMenu={handleToggleAttachmentMenu}
        onTakePhoto={handleTakePhoto}
        onSelectPhoto={handleSelectPhotoFromLibrary}
        onRemoveAttachment={removeAttachment}
        onSend={handleSendMessage}
      />

      <ChatDrawer
        visible={drawerVisible}
        drawerAnim={drawerAnim}
        histories={chatHistories}
        onClose={closeDrawer}
        onNewConversation={handleCreateNewConversation}
        onSelectHistory={handleSelectHistory}
      />
    </View>
  );
};

export default ChatbotScreen;

import React, { useEffect, useRef, useState } from 'react';
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

import { ChatDrawer } from '@components/Chat/ChatDrawer';
import { ChatInputArea } from '@components/Chat/ChatInputArea';
import { ChatMessageList } from '@components/Chat/ChatMessageList';
import { ChatbotHeader } from '@components/Chat/ChatbotHeader';
import { ChatSuggestions } from '@components/Chat/ChatSuggestions';

import styles from './styles';
import { ChatHistoryItem, ChatMessage, ChatSuggestion } from './Chatbot.types';

// import chatApi đã kế thừa từ api.ts
import {
  fetchChatSessions,
  createChatSession,
  fetchMessages,
  sendMessage,
} from '@components/Chat/chatApi';

const DRAWER_WIDTH = 280;
const MIN_INTERVAL_MS = 2000;

// ==================================================
// Helpers: image picker availability & Android permissions
// ==================================================
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

// ==================================================
// Initial UI data (suggestions)
// ==================================================
const suggestions: ChatSuggestion[] = [
  { label: 'Tình hình sức khỏe hôm nay', color: '#0EA5E9' },
  { label: 'Nhịp tim trung bình tuần này', color: '#22C55E' },
  { label: 'Gợi ý bài tập nhẹ', color: '#F59E0B' },
  { label: 'Lượng nước đã uống', color: '#6366F1' },
  { label: 'Nhắc nhở giấc ngủ', color: '#EF4444' },
];

// ==================================================
// Component
// ==================================================
const ChatbotScreen: React.FC = () => {
  // Drawer + attachment menu
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);

  // Chat state
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [AFiles, setAFiles] = useState<DocumentPickerResponse[]>([]);

  const [chatHistories, setChatHistories] = useState<ChatHistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Animation
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Throttle
  const lastRequestTsRef = useRef<number>(0);

  // ==================================================
  // Effects: Load sessions on mount
  // ==================================================
  useEffect(() => {
    const init = async () => {
      try {
        const sessions = await fetchChatSessions();
        setChatHistories(sessions || []);
        if (sessions && sessions.length > 0) {
          const firstId = sessions[0].id;
          setActiveHistoryId(firstId);
          const msgs = await fetchMessages(firstId);
          setMessages(msgs || []);
        } else {
          // Nếu chưa có session, tạo một session mới để user bắt đầu chat
          const newSession = await createChatSession();
          setChatHistories(prev =>
            Array.isArray(prev) ? [newSession, ...prev] : [newSession],
          );

          setActiveHistoryId(newSession.id);
          setMessages([
            {
              role: 'assistant',
              content:
                'Xin chào! Tôi có thể hỗ trợ bạn theo dõi sức khỏe. Bạn muốn hỏi điều gì?',
            },
          ]);
        }
      } catch (error) {
        console.warn('Load sessions failed:', error);
      }
    };
    init();
  }, []);

  // ==================================================
  // UI helpers
  // ==================================================
  const sortHistories = (histories: ChatHistoryItem[]): ChatHistoryItem[] =>
    [...histories].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

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

  // ==================================================
  // Permissions
  // ==================================================
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

  // ==================================================
  // Attachment handlers
  // ==================================================
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
        setAFiles(prev => [
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
        setAFiles(prev => [
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
    setAFiles(prev => prev.filter(file => file.uri !== uri));
  };

  // ==================================================
  // Drawer handlers
  // ==================================================
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

  const handleSelectHistory = async (historyId: string): Promise<void> => {
    try {
      const selectedHistory = chatHistories.find(h => h.id === historyId);
      if (!selectedHistory) return;

      setActiveHistoryId(historyId);
      const msgs = await fetchMessages(historyId);
      setMessages(msgs || []);
    } catch (error) {
      console.warn('Fetch messages failed:', error);
    }
  };

  const handleCreateNewConversation = async (): Promise<void> => {
    try {
      const newSession = await createChatSession();
      setChatHistories(prev => sortHistories([newSession, ...prev]));
      setActiveHistoryId(newSession.id);
      setMessages([
        {
          role: 'assistant',
          content:
            'Xin chào! Tôi có thể hỗ trợ bạn theo dõi sức khỏe. Bạn muốn hỏi điều gì?',
        },
      ]);
    } catch (error) {
      console.warn('Create session failed:', error);
    }
  };

  // ==================================================
  // Send message (connect BE chat-controller)
  // ==================================================
  const handleSendMessage = async (): Promise<void> => {
    if ((message.trim().length === 0 && AFiles.length === 0) || isLoading)
      return;

    // throttle
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

    // Gắn tên file vào nội dung tin nhắn (tạm thời),
    // khi tích hợp media-controller có presign, ta sẽ upload và gửi URL thay thế
    const attachmentText = AFiles.length
      ? `\n\nĐính kèm: ${AFiles.map(file => {
          const fileName = file.name || file.uri.split('/').pop() || 'Tệp';
          const sizeLabel = formatFileSize(file.size);
          return sizeLabel ? `${fileName} (${sizeLabel})` : fileName;
        }).join(', ')}`
      : '';

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: `${message.trim()}${attachmentText}`.trim(),
    };

    const updatedMessages = [...messages, newUserMessage];
    updateActiveHistoryMessages(updatedMessages);
    setMessage('');
    setAFiles([]);
    setIsLoading(true);

    try {
      let sessionId = activeHistoryId;
      if (!sessionId) {
        const newSession = await createChatSession();
        if (!newSession?.id) {
          updateActiveHistoryMessages([
            ...messages,
            {
              role: 'assistant',
              content: 'Không thể tạo phiên chat. Vui lòng thử lại sau.',
            },
          ]);
          return;
        }
        sessionId = newSession.id;
        setChatHistories(prev => [newSession, ...(prev || [])]);
        setActiveHistoryId(sessionId);
      }

      // Gọi BE: gửi tin nhắn vào session hiện tại
      const reply = await sendMessage(sessionId, newUserMessage.content);

      if (reply?.assistant?.content) {
        updateActiveHistoryMessages([
          ...updatedMessages,
          {
            role: 'assistant',
            content: reply.assistant.content,
          },
        ]);
      } else {
        updateActiveHistoryMessages([
          ...updatedMessages,
          {
            role: 'assistant',
            content:
              'Không nhận được phản hồi từ hệ thống. Vui lòng thử lại sau.',
          },
        ]);
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: reply.assistant.content,
      };
      updateActiveHistoryMessages([...updatedMessages, assistantMessage]);
    } catch (error: any) {
      console.warn('Send message failed:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Có lỗi xảy ra khi gửi tin nhắn đến server.';
      updateActiveHistoryMessages([
        ...updatedMessages,
        { role: 'assistant', content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // Render
  // ==================================================
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
        attachedFiles={AFiles}
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

import React, { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { DocumentPickerResponse } from '@react-native-documents/picker';

import AttachIcon from '@assets/icons/svgs/attach_1515.svg';
import ArrowRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import CameraIcon from '@assets/icons/svgs/camera_5050.svg';
import SaveFileIcon from '@assets/icons/svgs/save_file_3030.svg';
import VoiceIcon from '@assets/icons/svgs/voice_1520.svg';

import styles from './styles';

/**
 * Props cho ChatInputArea
 * - message: nội dung tin nhắn hiện tại
 * - attachedFiles: danh sách file đính kèm
 * - isLoading: trạng thái chatbot đang xử lý
 * - formatFileSize: helper format dung lượng file
 * - onChangeMessage: cập nhật nội dung input
 * - onToggleAttachmentMenu: mở/đóng popup chọn ảnh
 * - onTakePhoto: chụp ảnh
 * - onSelectPhoto: chọn từ thư viện
 * - onRemoveAttachment: xoá file đính kèm
 * - onSend: gửi tin nhắn
 */
interface ChatInputAreaProps {
  message: string;
  attachedFiles: DocumentPickerResponse[];
  isLoading: boolean;
  attachmentMenuVisible: boolean;
  formatFileSize: (size?: number | null) => string;
  onChangeMessage: (value: string) => void;
  onToggleAttachmentMenu: () => void;
  onTakePhoto: () => void;
  onSelectPhoto: () => void;
  onRemoveAttachment: (uri: string) => void;
  onSend: () => void;
}

/**
 * ChatInputArea
 * - Khu vực nhập tin nhắn của chatbot
 * - Hỗ trợ: text, đính kèm file, voice placeholder
 * - Tự động đổi nút Send / Voice theo trạng thái input
 */
const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  message,
  attachedFiles,
  isLoading,
  attachmentMenuVisible,
  formatFileSize,
  onChangeMessage,
  onToggleAttachmentMenu,
  onTakePhoto,
  onSelectPhoto,
  onRemoveAttachment,
  onSend,
}) => {
  const [menuAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: attachmentMenuVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [attachmentMenuVisible, menuAnim]);

  const translateY = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <View style={styles.inputArea}>
      {/* ===== Nút đính kèm file ===== */}
      <View style={styles.attachWrapper}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onToggleAttachmentMenu}
          disabled={isLoading}
        >
          <AttachIcon width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* ===== Khu vực input + attachments ===== */}
      <View style={styles.inputContentArea}>
        {/* Danh sách file đính kèm (scroll ngang) */}
        {attachedFiles.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.attachmentsRow}
          >
            {attachedFiles.map(file => (
              <View key={file.uri} style={styles.attachmentChip}>
                {/* Tên file */}
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {file.name || file.uri.split('/').pop() || 'Tệp'}
                </Text>

                {/* Dung lượng file (nếu có) */}
                {file.size ? (
                  <Text style={styles.attachmentSize}>
                    {formatFileSize(file.size)}
                  </Text>
                ) : null}

                {/* Nút xoá file */}
                <Pressable
                  onPress={() => onRemoveAttachment(file.uri)}
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

        {/* Input nhập text */}
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={onChangeMessage}
        />
      </View>

      {/* ===== Nút Send / Voice ===== */}
      {message.trim().length > 0 || attachedFiles.length > 0 ? (
        // Hiển thị nút Send khi có nội dung hoặc file
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <ArrowRightIcon width={20} height={20} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        // Hiển thị icon Voice khi chưa có nội dung
        <TouchableOpacity style={styles.iconButton} disabled={isLoading}>
          <VoiceIcon width={20} height={24} />
        </TouchableOpacity>
      )}

      <View pointerEvents="box-none" style={styles.attachmentMenuPortal}>
        {attachmentMenuVisible && (
          <Animated.View
            pointerEvents="auto"
            style={[
              styles.attachmentMenu,
              {
                opacity: menuAnim,
                transform: [{ translateY }],
              },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.attachmentMenuItem,
                pressed && styles.attachmentMenuItemPressed,
              ]}
              onPress={onTakePhoto}
            >
              <View style={styles.attachmentMenuIconWrapper}>
                <CameraIcon
                  width={18}
                  height={18}
                  color="#0F172A"
                  fill="#0F172A"
                />
              </View>
              <Text style={styles.attachmentMenuText}>Take picture</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.attachmentMenuItem,
                pressed && styles.attachmentMenuItemPressed,
              ]}
              onPress={onSelectPhoto}
            >
              <View style={styles.attachmentMenuIconWrapper}>
                <SaveFileIcon
                  width={18}
                  height={18}
                  fill="#000000"
                  color="#000000"
                />
              </View>
              <Text style={styles.attachmentMenuText}>Select picture</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default ChatInputArea;

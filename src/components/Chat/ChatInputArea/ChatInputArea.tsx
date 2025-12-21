import React from 'react';
import {
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
import VoiceIcon from '@assets/icons/svgs/voice_1520.svg';

import styles from './styles';

interface ChatInputAreaProps {
  message: string;
  attachedFiles: DocumentPickerResponse[];
  isLoading: boolean;
  formatFileSize: (size?: number | null) => string;
  onChangeMessage: (value: string) => void;
  onAttachFile: () => void;
  onRemoveAttachment: (uri: string) => void;
  onSend: () => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  message,
  attachedFiles,
  isLoading,
  formatFileSize,
  onChangeMessage,
  onAttachFile,
  onRemoveAttachment,
  onSend,
}) => (
  <View style={styles.inputArea}>
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onAttachFile}
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

      <TextInput
        style={styles.textInput}
        placeholder="Type a message..."
        placeholderTextColor="#94A3B8"
        value={message}
        onChangeText={onChangeMessage}
      />
    </View>

    {message.trim().length > 0 || attachedFiles.length > 0 ? (
      <TouchableOpacity
        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
        onPress={onSend}
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
);

export default ChatInputArea;

import React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';

import RobotChatIcon from '@assets/icons/svgs/robot_chat_200200.svg';
import { ChatMessage } from '@screens/AppScreen/ChatBot/Chatbot.types';

import styles from './styles';

/**
 * Props cho ChatMessageList
 * - messages: danh sách message trong cuộc hội thoại
 */
interface ChatMessageListProps {
  messages: ChatMessage[];
}

/**
 * Render từng message item trong FlatList
 * - Phân biệt message của user và assistant
 * - Assistant hiển thị avatar bot
 * - User message căn phải
 */
const renderMessage: ListRenderItem<ChatMessage> = ({ item }) => (
  <View
    style={[
      styles.messageRow,
      item.role === 'user' && styles.messageRowRight, // căn phải nếu là user
    ]}
  >
    {/* Avatar của assistant */}
    {item.role === 'assistant' && (
      <View style={styles.botAvatar}>
        <RobotChatIcon width={26} height={26} />
      </View>
    )}

    {/* Bubble message */}
    <View
      style={[
        styles.messageBox,
        item.role === 'user' && styles.messageBoxUser, // style riêng cho user
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  </View>
);

/**
 * ChatMessageList
 * - Hiển thị danh sách tin nhắn bằng FlatList
 * - Render theo thứ tự messages truyền vào
 */
const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => (
  <View style={styles.container}>
    <FlatList
      data={messages}
      // Dùng index vì message chưa có id riêng
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderMessage}
    />
  </View>
);

export default ChatMessageList;

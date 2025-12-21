import React from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';

import ChatAiIcon from '@assets/icons/svgs/robot_chat_200200.svg';
import { ChatMessage } from '@screens/AppScreen/ChatBot/Chatbot.types';

import styles from './styles';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

const renderMessage: ListRenderItem<ChatMessage> = ({ item }) => (
  <View
    style={[styles.messageRow, item.role === 'user' && styles.messageRowRight]}
  >
    {item.role === 'assistant' && (
      <View style={styles.botAvatar}>
        <ChatAiIcon width={24} height={24} />
      </View>
    )}
    <View
      style={[styles.messageBox, item.role === 'user' && styles.messageBoxUser]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  </View>
);

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => (
  <View style={styles.container}>
    <FlatList
      data={messages}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderMessage}
    />
  </View>
);

export default ChatMessageList;

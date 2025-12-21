import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import { ChatSuggestion } from '@screens/AppScreen/ChatBot/Chatbot.types';

import styles from './styles';

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSelect: (text: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => (
  <View style={styles.wrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {suggestions.map(item => (
        <Pressable
          key={item.label}
          onPress={() => onSelect(item.label)}
          style={({ pressed }) => [
            styles.suggestionButton,
            pressed && styles.suggestionButtonPressed,
          ]}
        >
          <View
            style={[
              styles.suggestionIcon,
              { backgroundColor: `${item.color}1A`, borderColor: item.color },
            ]}
          >
            <DotIcon width={12} height={12} color={item.color} />
          </View>
          <Text style={styles.suggestionLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

export default ChatSuggestions;

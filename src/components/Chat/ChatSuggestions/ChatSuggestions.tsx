import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import { ChatSuggestion } from '@screens/AppScreen/ChatBot/Chatbot.types';

import styles from './styles';

/**
 * Props cho ChatSuggestions
 * - suggestions: danh sách gợi ý chat (quick replies)
 * - onSelect: callback khi người dùng chọn một gợi ý
 */
interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSelect: (text: string) => void;
}

/**
 * ChatSuggestions
 * - Hiển thị danh sách gợi ý chat dạng scroll ngang
 * - Mỗi gợi ý là một button có icon + label
 * - Dùng để giúp user gửi nhanh câu hỏi/phản hồi
 */
const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  suggestions,
  onSelect,
}) => (
  <View style={styles.wrapper}>
    {/* Scroll ngang danh sách suggestion */}
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
            pressed && styles.suggestionButtonPressed, // hiệu ứng khi nhấn
          ]}
        >
          {/* Icon gợi ý (dot màu theo từng suggestion) */}
          <View
            style={[
              styles.suggestionIcon,
              {
                // Background màu nhạt + viền theo màu suggestion
                backgroundColor: `${item.color}1A`,
                borderColor: item.color,
              },
            ]}
          >
            <DotIcon width={12} height={12} color={item.color} />
          </View>

          {/* Text label của suggestion */}
          <Text style={styles.suggestionLabel}>{item.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

export default ChatSuggestions;

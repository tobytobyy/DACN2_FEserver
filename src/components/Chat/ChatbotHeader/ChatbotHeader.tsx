import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import MenuIcon from '@assets/icons/svgs/menu_dot_2020.svg';
import { theme } from '@assets/theme';

import styles from './styles';

/**
 * Props cho ChatbotHeader
 * - isLoading: trạng thái chatbot đang trả lời hay không
 * - onMenuPress: callback khi bấm nút menu
 */
interface ChatbotHeaderProps {
  isLoading: boolean;
  onMenuPress: () => void;
}

/**
 * ChatbotHeader
 * - Header của màn Chatbot
 * - Hiển thị tên bot + trạng thái Online / Đang trả lời
 * - Có nút menu bên trái
 */
const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({
  isLoading,
  onMenuPress,
}) => (
  <View style={styles.header}>
    {/* Khu vực bên trái: menu + title */}
    <View style={styles.titleArea}>
      {/* Nút menu */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <MenuIcon width={24} height={24} />
      </TouchableOpacity>

      {/* Text title + trạng thái */}
      <View style={styles.titleTextArea}>
        {/* Tên chatbot */}
        <Text style={styles.title}>Health Assistant</Text>

        {/* Trạng thái hoạt động */}
        <View style={styles.statusRow}>
          {/* Dot trạng thái (online) */}
          <DotIcon width={10} height={10} color={theme.colors.primary} />

          {/* Text trạng thái */}
          <Text style={styles.status}>
            {isLoading ? 'Đang trả lời...' : 'Online'}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export default ChatbotHeader;

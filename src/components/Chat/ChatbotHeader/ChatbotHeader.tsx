import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import DotIcon from '@assets/icons/svgs/dot_1010.svg';
import MenuIcon from '@assets/icons/svgs/menu_dot_2020.svg';
import { theme } from '@assets/theme';

import styles from './styles';

interface ChatbotHeaderProps {
  isLoading: boolean;
  onMenuPress: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({
  isLoading,
  onMenuPress,
}) => (
  <View style={styles.header}>
    <View style={styles.titleArea}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <MenuIcon width={24} height={24} />
      </TouchableOpacity>
      <View style={styles.titleTextArea}>
        <Text style={styles.title}>Health Assistant</Text>
        <View style={styles.statusRow}>
          <DotIcon width={10} height={10} color={theme.colors.primary} />
          <Text style={styles.status}>
            {isLoading ? 'Đang trả lời...' : 'Online'}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export default ChatbotHeader;

import React from 'react';
import { View, Text, Pressable } from 'react-native';

import UserAvatar from '@assets/icons/svgs/account_circle.svg';
import styles from './styles';

type Props = {
  email: string;
  greeting?: string;
  onPressAvatar?: () => void;
};

/**
 * Hàm lấy tên từ email
 * - Lấy phần trước dấu @
 * - Thay dấu . hoặc _ bằng khoảng trắng
 * - Viết hoa chữ cái đầu
 */
const getNameFromEmail = (email: string): string => {
  if (!email) return 'User';
  const namePart = email.split('@')[0];
  const formatted = namePart
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return formatted;
};

/**
 * HeaderSection
 * - Hiển thị lời chào + tên user (từ email) + avatar
 */
const HeaderSection: React.FC<Props> = ({ email, greeting, onPressAvatar }) => {
  const greetingText = greeting ?? 'Hello!';
  const userName = getNameFromEmail(email);

  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerContent}>
        {/* Text bên trái */}
        <View>
          <View style={styles.helloRow}>
            <Text style={styles.waveIcon}>👋</Text>
            <Text style={styles.helloText}>{greetingText}</Text>
          </View>
          <Text style={styles.usernameText}>{userName}</Text>
        </View>

        {/* Avatar bên phải */}
        <Pressable style={styles.avatarButton} onPress={onPressAvatar}>
          <UserAvatar />
        </Pressable>
      </View>
    </View>
  );
};

export default HeaderSection;

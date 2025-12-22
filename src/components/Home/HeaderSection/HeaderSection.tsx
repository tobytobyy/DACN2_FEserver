// src/screens/HomeScreen/components/HeaderSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Pressable } from 'react-native';

import UserAvatar from '@assets/icons/svgs/account_circle.svg';
import styles from './styles';

/**
 * Kiểu dữ liệu user hiển thị trên Header
 * - name: tên hiển thị (VD: "Hồ Ngọc Bảo Long")
 * - greeting: lời chào (optional) (VD: "Hello!", "Xin chào!")
 */
type UserHeaderData = {
  name: string;
  greeting?: string;
};

type Props = {
  /** Data của user để render UI, tránh hard-code */
  user: UserHeaderData;

  /** Callback khi bấm avatar (optional) */
  onPressAvatar?: () => void;
};

/**
 * HeaderSection
 * - Khu vực header màn Home
 * - Hiển thị lời chào + tên user + avatar
 * - Dữ liệu user được truyền từ ngoài vào (props) để tái sử dụng và dễ tích hợp API/store
 */
const HeaderSection: React.FC<Props> = ({ user, onPressAvatar }) => {
  // Fallback nếu greeting không truyền vào
  const greetingText = user.greeting ?? 'Hello!';

  return (
    // Background của header (gradient/shape nằm trong styles)
    <View style={styles.headerBackground}>
      {/* Container nội dung header */}
      <View style={styles.headerContent}>
        {/* Cụm text bên trái: lời chào + username */}
        <View>
          {/* Hàng "👋 Hello!" */}
          <View style={styles.helloRow}>
            <Text style={styles.waveIcon}>👋</Text>
            <Text style={styles.helloText}>{greetingText}</Text>
          </View>

          {/* Tên user (lấy từ data truyền vào) */}
          <Text style={styles.usernameText}>{user.name}</Text>
        </View>

        {/* Avatar bên phải
            - Nếu muốn bấm được avatar thì bạn có thể bọc bằng Pressable/TouchableOpacity
            - Ở đây giữ nguyên layout cũ, chỉ thêm onPress nếu cần
        */}
        <Pressable style={styles.avatarButton} onPress={onPressAvatar}>
          <UserAvatar />
        </Pressable>
      </View>
    </View>
  );
};

export default HeaderSection;

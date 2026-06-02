import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import UserAvatar from '@assets/icons/svgs/account_circle.svg';
import styles from './styles';

type Props = {
  email: string;
  displayName?: string;
  avatarUrl?: string | null;
  greeting?: string;
  onPressAvatar?: () => void;
};

const getNameFromEmail = (email: string): string => {
  if (!email) return 'User';
  const namePart = email.split('@')[0];
  return namePart.replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const HeaderSection: React.FC<Props> = ({
  email,
  displayName,
  avatarUrl,
  greeting,
  onPressAvatar,
}) => {
  const greetingText = greeting ?? 'Hello!';
  const userName = displayName?.trim() || getNameFromEmail(email);

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
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <UserAvatar />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default HeaderSection;

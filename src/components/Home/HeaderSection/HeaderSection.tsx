import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import UserAvatar from '@assets/icons/svgs/account_circle.svg';
import styles from './styles';

type Props = {
  displayName?: string;
  avatarUrl?: string | null;
  streakDays?: number;
  onPressAvatar?: () => void;
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const HeaderSection: React.FC<Props> = ({
  displayName,
  avatarUrl,
  streakDays = 0,
  onPressAvatar,
}) => {
  const name = displayName?.trim() || 'there';

  return (
    <LinearGradient
      colors={['#2D8C83', '#1a5c56']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.content}>
        <View style={styles.leftCol}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {name} 👋
          </Text>
          <Text style={styles.dateText}>{formatDate()}</Text>
          {streakDays > 0 && (
            <View style={styles.streakPill}>
              <Text>🔥</Text>
              <Text style={styles.streakText}>Day {streakDays} streak</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.avatarButton} onPress={onPressAvatar}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserAvatar width={28} height={28} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default HeaderSection;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/svgs/arrow_left_2424.svg';
import { theme } from '../../assets/theme';

const SleepTrackingScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header với nút trở về */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Tracking</Text>
      </View>

      {/* Nội dung chính có thể cuộn */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.text}>
            Sleep Tracking Screen (đang phát triển)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    elevation: 2,
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  text: {
    fontSize: theme.fonts.size.md,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },
});

export default SleepTrackingScreen;

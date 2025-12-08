import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeft from '@assets/icons/svgs/arrow_left_2424.svg';
import CameraIcon from '@assets/icons/svgs/camera_5050.svg';
import { theme } from '@assets/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

type Props = NativeStackScreenProps<BrowserStackParamList, 'AiCaloriesScan'>;

const CaloriesScanScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handlePickImage = () => {
    // TODO: mở camera / image picker, lấy về uri ảnh thật
    const dummyUri =
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg';

    navigation.navigate('CaloriesScanProcess', { imageUri: dummyUri });
  };

  return (
    <LinearGradient
      colors={theme.gradients.background.colors}
      locations={theme.gradients.background.locations}
      start={theme.gradients.background.start}
      end={theme.gradients.background.end}
      style={styles.container}
    >
      <View style={[styles.safeArea, { paddingTop: insets.top || 12 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft width={24} height={24} color={theme.colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Calories Scan</Text>

          {/* placeholder bên phải cho cân layout (nếu cần) */}
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.uploadCard}
            onPress={handlePickImage}
          >
            <View style={styles.iconWrapper}>
              <CameraIcon width={50} height={50} color={theme.colors.primary} />
            </View>

            <Text style={styles.cardTitle}>Take or upload photo</Text>
            <Text style={styles.cardSubtitle}>Support JPG, PNG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CaloriesScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.gap,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fonts.size.xl,
    color: theme.colors.text,
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.semibold,
  },
  headerRightPlaceholder: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.lg * 3,
  },
  uploadCard: {
    height: 300,
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    paddingVertical: theme.spacing.xl * 1.5,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: theme.spacing.gap,
    borderRadius: 36,
    backgroundColor: '#E0FFF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fonts.size.lg,
    color: theme.colors.text,
    textAlign: 'center',
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.semibold,
    lineHeight: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText,
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.regular,
    textAlign: 'center',
    lineHeight: theme.spacing.lg,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '@assets/theme';

import ScanButton from '@components/CaloriesScan/ScanButton/ScanButton';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

// ✅ Đây mới là kiểu props đúng của screen
type Props = NativeStackScreenProps<
  BrowserStackParamList,
  'CaloriesScanProcess'
>;

const CaloriesScanProcess: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { imageUri } = route.params;

  const handleAgain = () => {
    navigation.goBack(); // quay lại màn chụp / upload
  };

  const handleScan = () => {
    // TODO: sau này navigate sang màn result, ví dụ:
    // navigation.navigate('CaloriesScanResult', { imageUri });
    console.log('Scan with image:', imageUri);
  };

  const handleRemoveImage = () => {
    navigation.goBack();
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
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Calories Scan</Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* IMAGE PREVIEW */}
        <View style={styles.previewWrapper}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleRemoveImage}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={18} color="#111" />
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <ScanButton
            label="Again"
            icon="camera-outline"
            type="secondary"
            onPress={handleAgain}
            style={{ flex: 1, marginRight: theme.spacing.sm }}
          />

          <ScanButton
            label="Scan"
            icon="scan-outline"
            type="primary"
            onPress={handleScan}
            style={{ flex: 1, marginLeft: theme.spacing.sm }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default CaloriesScanProcess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },

  /* HEADER */
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
    fontSize: theme.fonts.size.lg,
    color: theme.colors.text,
    fontFamily: theme.fonts.nunito.regular,
    fontWeight: theme.fonts.weight.semibold,
  },
  headerRightPlaceholder: {
    width: 32,
    height: 32,
  },

  /* IMAGE PREVIEW */
  previewWrapper: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: theme.spacing.lg,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  /* BUTTON ROW */
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
});

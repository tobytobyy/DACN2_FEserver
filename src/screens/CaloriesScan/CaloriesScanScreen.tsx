import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { theme } from '@assets/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

import { styles, FRAME_SIZE } from './styles';
import { ScanOverlay } from '@components/CaloriesScan/ScanOverlay/ScanOverlay';
import { ScanControls } from '@components/CaloriesScan/ScanControls/ScanControls';
import { ResultSheet } from '@components/CaloriesScan/ResultSheet/ResultSheet';

type Props = NativeStackScreenProps<BrowserStackParamList, 'AiCaloriesScan'>;

const DUMMY_IMAGE =
  'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800&q=80';

const CaloriesScanScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const controlsBottomSpacing = Math.max(
    insets.bottom + theme.spacing.sm,
    theme.spacing.lg,
  );

  const scanAreaPadding = controlsBottomSpacing + theme.spacing.xl * 2;

  /* ---------------- Animation ---------------- */

  const startLineAnimation = useCallback(() => {
    scanLineAnim.setValue(0);
    Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, [scanLineAnim]);

  useEffect(() => {
    if (isScanning) {
      startLineAnimation();
    } else {
      scanLineAnim.stopAnimation();
      scanLineAnim.setValue(0);
    }
  }, [isScanning, startLineAnimation, scanLineAnim]);

  const animatedLineStyle = {
    transform: [
      {
        translateY: scanLineAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, FRAME_SIZE],
        }),
      },
    ],
  };

  /* ---------------- Actions ---------------- */

  const startScan = () => {
    setIsScanning(true);
    setCapturedImage(DUMMY_IMAGE);

    setTimeout(() => {
      setIsScanning(false);
      setShowResult(true);
    }, 3000);
  };

  const resetScan = () => {
    setIsScanning(false);
    setShowResult(false);
    setCapturedImage(null);
  };

  /* ---------------- Render ---------------- */

  return (
    <LinearGradient
      colors={['#020617', '#0B1221']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={[
          styles.safeArea,
          {
            paddingTop: insets.top || theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom, theme.spacing.xl),
          },
        ]}
      >
        {/* Camera Area */}
        <View style={styles.cameraWrapper}>
          <View style={styles.imageBackground}>
            <View style={styles.cameraFeed}>
              {capturedImage ? (
                <Image
                  source={{ uri: capturedImage }}
                  style={styles.capturedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderContainer} />
              )}
            </View>

            <View style={styles.overlayGradient} />

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={theme.colors.white}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.headerButton}>
                <Ionicons
                  name="flash"
                  size={20}
                  color={isScanning ? theme.colors.orange : theme.colors.white}
                />
              </TouchableOpacity>
            </View>

            {/* Scan Overlay */}
            {!showResult && (
              <ScanOverlay
                isScanning={isScanning}
                capturedImage={capturedImage}
                animatedLineStyle={animatedLineStyle}
                scanAreaPadding={scanAreaPadding}
              />
            )}

            {/* Controls */}
            {!showResult && (
              <ScanControls
                isScanning={isScanning}
                bottomSpacing={controlsBottomSpacing}
                onCapture={startScan}
              />
            )}
          </View>
        </View>

        {/* Result */}
        {showResult && (
          <ResultSheet
            bottomInset={Math.max(insets.bottom, theme.spacing.lg)}
            onClose={resetScan}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default CaloriesScanScreen;

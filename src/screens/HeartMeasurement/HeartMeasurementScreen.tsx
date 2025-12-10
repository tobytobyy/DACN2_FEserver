import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { theme } from '@assets/theme';
import HeartLineIcon from '@assets/icons/svgs/heart_line.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

// Camera
import {
  Camera,
  useCameraDevice,
  type CameraPermissionStatus,
} from 'react-native-vision-camera';

type Nav = NativeStackNavigationProp<BrowserStackParamList, 'HeartMeasurement'>;

const MEASUREMENT_DURATION_MS = 5000;
const INTERVAL_MS = 100;
const PROGRESS_STEP = INTERVAL_MS / MEASUREMENT_DURATION_MS;

const HeartMeasurementScreen = () => {
  const navigation = useNavigation<Nav>();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [permission, setPermission] = useState<CameraPermissionStatus | null>(
    null,
  );
  const [redAvg, setRedAvg] = useState(0);

  const device = useCameraDevice('back');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // -----------------------
  // 1. Xin quyền Camera
  // -----------------------
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
    })();
  }, []);

  // -----------------------
  // 2. Animation nhịp tim
  // -----------------------
  useEffect(() => {
    if (!isMeasuring) {
      scaleAnim.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [isMeasuring, scaleAnim]);

  // -----------------------
  // 3. Cleanup interval
  // -----------------------
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // -----------------------
  // 4. Nếu đo xong → điều hướng
  // -----------------------
  useEffect(() => {
    if (progress >= 1 && isMeasuring) {
      stopMeasurement();

      const fakeBpm = 78; // TODO: replace with backend result
      navigation.navigate('HeartResult', { bpm: fakeBpm });
    }
  }, [progress, isMeasuring, navigation]);

  // -----------------------
  // 5. Start đo
  // -----------------------
  const startMeasurement = () => {
    if (isMeasuring) return;

    setIsMeasuring(true);
    setProgress(0);
    setRedAvg(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + PROGRESS_STEP, 1);

        const mockRed = Math.floor(Math.random() * 255);
        setRedAvg(mockRed);

        if (next >= 1 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return next;
      });
    }, INTERVAL_MS);
  };

  // -----------------------
  // 6. Stop đo
  // -----------------------
  const stopMeasurement = () => {
    setIsMeasuring(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // -----------------------
  // 7. Camera Error Handling
  // -----------------------
  const getCameraErrorMessage = () => {
    if (permission === null) return 'Đang kiểm tra quyền camera...';
    if (permission !== 'granted')
      return 'Bạn cần cấp quyền camera để đo nhịp tim.';
    if (!device) return 'Không tìm thấy camera phù hợp.';
    if (!device.hasFlash) return 'Camera này không hỗ trợ đèn flash.';
    return null;
  };

  const canUseCamera = !!device && permission === 'granted';
  const torchMode: 'on' | 'off' =
    isMeasuring && device?.hasFlash ? 'on' : 'off';

  // -----------------------
  // 8. UI
  // -----------------------
  const progressPercent = Math.round(progress * 100);
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeColor =
    progressPercent < 50
      ? '#22C55E'
      : progressPercent < 80
      ? '#FACC15'
      : '#DC2626';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Heart Measurement</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* CAMERA */}
          {canUseCamera ? (
            <Camera
              style={styles.camera}
              device={device!}
              isActive={true}
              torch={torchMode}
            />
          ) : (
            <Text style={styles.infoText}>{getCameraErrorMessage()}</Text>
          )}

          {/* PROGRESS RING */}
          <TouchableOpacity onPress={startMeasurement} disabled={isMeasuring}>
            <View style={styles.circleWrapper}>
              <Svg width={size} height={size}>
                <Circle
                  stroke="#E5E7EB"
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                />

                <Circle
                  stroke={strokeColor}
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - (circumference * progressPercent) / 100
                  }
                  strokeLinecap="round"
                  rotation={-90}
                  originX={size / 2}
                  originY={size / 2}
                />
              </Svg>

              <Animated.View
                style={[
                  styles.heartCenter,
                  {
                    transform: [
                      { translateX: -50 },
                      { translateY: -50 },
                      { scale: scaleAnim },
                    ],
                  },
                ]}
              >
                <HeartIcon width={100} height={100} color="#DC2626" />
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* STATUS */}
          <View style={styles.heartbeatBox}>
            <HeartLineIcon width={220} height={44} />
            <Text style={styles.bpmText}>
              {isMeasuring
                ? `Đang đo… ${progressPercent}%  (RedAvg: ${redAvg})`
                : 'Nhấn vào trái tim để bắt đầu đo'}
            </Text>
          </View>

          {/* INSTRUCTIONS */}
          <View style={styles.tipsBox}>
            <HeartIcon width={20} height={20} color="#fff" />
            <View style={styles.tipsTextWrapper}>
              <Text style={styles.tipsTitle}>Hướng dẫn đo nhịp tim:</Text>
              <Text style={styles.tipsText}>
                1. Đặt ngón tay lên camera & flash.
              </Text>
              <Text style={styles.tipsText}>
                2. Giữ yên tay trong suốt quá trình đo.
              </Text>
              <Text style={styles.tipsText}>
                3. Không di chuyển hoặc thay đổi vị trí.
              </Text>
              <Text style={styles.tipsText}>
                4. Kết quả sẽ hiển thị sau vài giây.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// -----------------------
// STYLE
// -----------------------

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    elevation: 2,
  },
  backButton: { marginRight: theme.spacing.sm },
  headerTitle: {
    fontSize: theme.fonts.size.lg,
    fontWeight: theme.fonts.weight.bold,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { alignItems: 'center', gap: theme.spacing.lg },
  circleWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  heartbeatBox: { alignItems: 'center', gap: theme.spacing.sm },
  bpmText: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.regular,
    color: theme.colors.primary,
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    maxWidth: 520,
  },
  tipsTextWrapper: { flex: 1 },
  tipsTitle: {
    color: '#fff',
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
    marginBottom: theme.spacing.xs,
  },
  tipsText: {
    color: '#fff',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 4,
    lineHeight: 20,
  },
  camera: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  infoText: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
  },
});

export default HeartMeasurementScreen;

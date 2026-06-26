import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
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
  useFrameProcessor,
  VisionCameraProxy,
  type CameraPermissionStatus,
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { analyze, type PpgSample, type PpgResult } from './ppgAnalyzer';
import { setTorch } from './torch';

const redAveragePlugin = VisionCameraProxy.initFrameProcessorPlugin(
  'redAverage',
  {},
);

type Nav = NativeStackNavigationProp<BrowserStackParamList, 'HeartMeasurement'>;

const MEASUREMENT_DURATION_MS = 15000;
const INTERVAL_MS = 120;
const PROGRESS_STEP = INTERVAL_MS / MEASUREMENT_DURATION_MS;

const HeartMeasurementScreen = () => {
  const navigation = useNavigation<Nav>();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [permission, setPermission] = useState<CameraPermissionStatus | null>(
    null,
  );
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const device = useCameraDevice('back');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const measurementStartRef = useRef(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // --- R3: PPG frame processor wiring ---
  const ppgSamplesRef = useRef<PpgSample[]>([]);
  const [ppg, setPpg] = useState<PpgResult>({
    bpm: null,
    quality: 'no_finger',
    confidence: 0,
  });

  const pushSample = useMemo(
    () =>
      Worklets.createRunOnJS((red: number) => {
        ppgSamplesRef.current.push({ t: Date.now(), red });
        if (ppgSamplesRef.current.length > 450) {
          ppgSamplesRef.current.splice(0, ppgSamplesRef.current.length - 450);
        }
      }),
    [],
  );

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      if (redAveragePlugin == null) {
        return;
      }
      const value = redAveragePlugin.call(frame);
      if (typeof value === 'number') {
        pushSample(value);
      }
    },
    [pushSample],
  );
  // --- end R3 ---

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
  // 4. Stop đo
  // -----------------------
  const stopMeasurement = useCallback(() => {
    setIsMeasuring(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // -----------------------
  // 5. Nếu đo xong → điều hướng hoặc hiển thị retry
  // -----------------------
  const finishMeasurement = useCallback(
    (currentPpg: PpgResult) => {
      stopMeasurement();
      if (currentPpg.quality === 'good' && currentPpg.bpm != null) {
        navigation.navigate('HeartResult', { bpm: currentPpg.bpm });
      } else {
        setRetryMessage(
          'Chưa đo được nhịp tim ổn định. Hãy đặt lại ngón tay và thử lại.',
        );
      }
    },
    [navigation, stopMeasurement],
  );

  // -----------------------
  // 6. Start đo
  // -----------------------
  const startMeasurement = () => {
    if (isMeasuring) return;

    ppgSamplesRef.current = [];
    setIsMeasuring(true);
    setProgress(0);
    setRetryMessage(null);
    measurementStartRef.current = Date.now();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + PROGRESS_STEP, 1);

        if (next >= 1 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          // Finalize: read latest ppg from analyzer at completion
          const finalPpg = analyze(ppgSamplesRef.current, 30);
          setPpg(finalPpg);
          // Defer navigation until after state update settles
          setTimeout(() => finishMeasurement(finalPpg), 0);
        }
        return next;
      });
    }, INTERVAL_MS);
  };

  // -----------------------
  // R3: PPG analyze interval
  // -----------------------
  useEffect(() => {
    if (!isMeasuring) return;
    const id = setInterval(() => {
      setPpg(analyze(ppgSamplesRef.current, 30));
    }, 1000);
    return () => clearInterval(id);
  }, [isMeasuring]);

  // -----------------------
  // R3: Torch control
  // Native module is the single torch owner during measurement.
  // On Android the Camera torch prop is ineffective when a frame processor runs,
  // so we always set Camera torch='off' and let setTorch() drive the hardware.
  // On iOS the Camera torch prop is also disabled here (setTorch covers it too).
  // -----------------------
  useEffect(() => {
    setTorch(isMeasuring);
    return () => {
      setTorch(false);
    };
  }, [isMeasuring]);

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

  // -----------------------
  // R4: Quality-aware status text (driven by ppg.quality)
  // -----------------------
  const statusText = !isMeasuring
    ? 'Đặt ngón tay che camera sau và đèn flash, rồi bấm Bắt đầu'
    : ppg.quality === 'no_finger'
    ? 'Đặt ngón tay che camera sau và đèn flash'
    : ppg.quality === 'saturated'
    ? 'Ấn nhẹ tay hơn — tín hiệu quá sáng'
    : ppg.quality === 'weak'
    ? 'Giữ yên tay, đang bắt tín hiệu…'
    : ppg.bpm != null
    ? `${ppg.bpm} BPM`
    : 'Đang đo…';

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
          {/* CAMERA — torch prop set to 'off'; native setTorch() is the sole driver */}
          {canUseCamera ? (
            <Camera
              style={styles.camera}
              device={device!}
              isActive={true}
              torch={
                Platform.OS === 'ios' ? (isMeasuring ? 'on' : 'off') : 'off'
              }
              frameProcessor={frameProcessor}
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
            <Text style={styles.bpmText}>{statusText}</Text>
            {retryMessage != null && (
              <Text style={styles.retryText}>{retryMessage}</Text>
            )}
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
                4. AI sẽ ước tính BPM từ chu kỳ thay đổi ánh sáng đỏ và cảnh báo
                kết quả chỉ mang tính tham khảo.
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
  retryText: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 4,
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

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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import { theme } from '@assets/theme';
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
import QualityState from './components/QualityState';
import LiveWaveform from './components/LiveWaveform';

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
  const [waveform, setWaveform] = useState<number[]>([]);

  const device = useCameraDevice('back');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  // 2. Cleanup interval
  // -----------------------
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // -----------------------
  // 3. Stop đo
  // -----------------------
  const stopMeasurement = useCallback(() => {
    setIsMeasuring(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // -----------------------
  // 4. Nếu đo xong → điều hướng hoặc hiển thị retry
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
  // 5. Start đo
  // -----------------------
  const startMeasurement = () => {
    if (isMeasuring) return;

    ppgSamplesRef.current = [];
    setWaveform([]);
    setIsMeasuring(true);
    setProgress(0);
    setRetryMessage(null);
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
          finishMeasurement(finalPpg);
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
      const recent = ppgSamplesRef.current.slice(-90).map(s => s.red);
      setWaveform(recent);
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
  // 6. Camera Error Handling
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
  // 7. UI
  // -----------------------
  const progressPercent = Math.round(progress * 100);

  return (
    <LinearGradient colors={['#0d1a18', '#0a0a0c']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon width={24} height={24} color="#2dd4bf" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đo nhịp tim</Text>
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

            {/* Quality-aware center block (heart + BPM / guidance) */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={startMeasurement}
              disabled={isMeasuring}
            >
              <QualityState
                quality={ppg.quality}
                bpm={ppg.bpm}
                isMeasuring={isMeasuring}
              />
            </TouchableOpacity>

            {/* Live waveform */}
            <LiveWaveform samples={waveform} color="#2dd4bf" />

            {/* Slim progress bar (measurement window) */}
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>

            {retryMessage != null && (
              <Text style={styles.retryText}>{retryMessage}</Text>
            )}

            {/* INSTRUCTIONS */}
            <View style={styles.tipsBox}>
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
                  4. AI sẽ ước tính BPM từ chu kỳ thay đổi ánh sáng đỏ và cảnh
                  báo kết quả chỉ mang tính tham khảo.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// -----------------------
// STYLE
// -----------------------

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  backButton: { marginRight: theme.spacing.sm },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { width: '100%', alignItems: 'center', gap: theme.spacing.lg },
  camera: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2dd4bf',
  },
  progressTrack: {
    width: 220,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressFill: { height: '100%', backgroundColor: '#2dd4bf' },
  retryText: {
    color: '#fb923c',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  tipsBox: {
    backgroundColor: '#11181c',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    maxWidth: 520,
    width: '100%',
  },
  tipsTextWrapper: { flex: 1 },
  tipsTitle: {
    color: '#ffffff',
    fontSize: theme.fonts.size.md,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  tipsText: {
    color: '#9ca3af',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 4,
    lineHeight: 20,
  },
  infoText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
  },
});

export default HeartMeasurementScreen;

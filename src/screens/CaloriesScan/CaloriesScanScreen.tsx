import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Alert,
  Image,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';

import { theme } from '@assets/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

import { styles, FRAME_SIZE } from './styles';
import { ScanOverlay } from '@components/CaloriesScan/ScanOverlay/ScanOverlay';
import { ScanControls } from '@components/CaloriesScan/ScanControls/ScanControls';
import {
  ResultSheet,
  type FoodAnalysis,
} from '@components/CaloriesScan/ResultSheet/ResultSheet';

import { api } from '../../services/api';

type Props = NativeStackScreenProps<BrowserStackParamList, 'AiCaloriesScan'>;

type NutritionCandidateDto = {
  code: string;
  score?: number | null; // 0..1
  status?: 'OK' | 'UNKNOWN' | string;
  foodItem?: {
    name?: string | null;
    kcal?: number | null;
    protein?: number | null;
    carbs?: number | null;
    fat?: number | null;
  } | null;
};

type NutritionAnalyzeDto = {
  isFood: boolean;
  message?: string | null;
  thresholdUsed?: number | null;
  primaryCandidate?: NutritionCandidateDto | null;
  candidates?: NutritionCandidateDto[] | null;
};

type PresignPutDto = {
  objectKey: string;
  uploadUrl: string;
  expiresAt?: string;
  publicUrl?: string | null;
};

const MACRO_COLORS = {
  Protein: '#0EA5E9',
  Carbs: '#F59E0B',
  Fat: '#EF4444',
};

const uriToBlob = (uri: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onerror = () => reject(new Error('uriToBlob failed'));
    xhr.onload = () => resolve(xhr.response);
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

const uploadBlobToPresignedUrl = async (
  uploadUrl: string,
  blob: Blob,
  contentType: string,
) => {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
};

const buildFoodAnalysis = (candidate: NutritionCandidateDto): FoodAnalysis => {
  const fi = candidate.foodItem ?? null;

  const calories = Number(fi?.kcal ?? 0);
  const protein = Number(fi?.protein ?? 0);
  const carbs = Number(fi?.carbs ?? 0);
  const fat = Number(fi?.fat ?? 0);

  const totalEnergy = protein * 4 + carbs * 4 + fat * 9;
  const pct = (energy: number) =>
    totalEnergy > 0 ? Math.round((energy / totalEnergy) * 100) : 0;

  const score = typeof candidate.score === 'number' ? candidate.score : 0;
  const badge = `Tin cậy ${Math.round(score * 100)}%`;

  return {
    id: candidate.code,
    name: (fi?.name || candidate.code) as string,
    calories,
    badge,
    macros: [
      {
        label: 'Protein',
        value: `${protein}g`,
        color: MACRO_COLORS.Protein,
        percentage: pct(protein * 4),
      },
      {
        label: 'Carbs',
        value: `${carbs}g`,
        color: MACRO_COLORS.Carbs,
        percentage: pct(carbs * 4),
      },
      {
        label: 'Fat',
        value: `${fat}g`,
        color: MACRO_COLORS.Fat,
        percentage: pct(fat * 9),
      },
    ],
    note:
      candidate.status === 'UNKNOWN'
        ? 'Món này chưa có đủ dữ liệu trong hệ thống. Bạn có thể chọn món khác hoặc thử lại.'
        : undefined,
  };
};

const CaloriesScanScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMode, setResultMode] = useState<'high' | 'medium'>('high');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [candidates, setCandidates] = useState<FoodAnalysis[]>([]);

  // dùng để confirm log
  const [selectedFoodCode, setSelectedFoodCode] = useState<string | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(
    null,
  );
  const [lastObjectKey, setLastObjectKey] = useState<string | null>(null);
  const [candidateCodes, setCandidateCodes] = useState<string[]>([]);

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

  /* ---------------- Helpers ---------------- */

  const resetScan = async (opts?: { silentCancel?: boolean }) => {
    // Optional: báo BE “user dismiss” nếu bạn có endpoint cancel
    if (!opts?.silentCancel && showResult && candidateCodes.length > 0) {
      // Nếu BE chưa có endpoint này thì cứ bỏ/catch
      api
        .post('/nutrition/logs/cancel', {
          reason: 'dismiss',
          candidateCodes,
        })
        .catch(() => {});
    }

    setIsScanning(false);
    setShowResult(false);
    setCapturedImage(null);

    setResult(null);
    setCandidates([]);

    setSelectedFoodCode(null);
    setSelectedConfidence(null);
    setLastObjectKey(null);
    setCandidateCodes([]);
  };

  const runAnalyzeFromAsset = async (asset: Asset) => {
    if (!asset?.uri) return;

    const uri = asset.uri;
    const contentType = asset.type || 'image/jpeg';

    setIsScanning(true);
    setCapturedImage(uri);

    try {
      // 1) blob
      const blob = await uriToBlob(uri);

      // 2) presign PUT (nutrition)
      const presignRes = await api.post('/media/nutrition/presign-put', {
        contentType,
        sizeBytes: blob.size,
      });
      const presign = presignRes.data?.data as PresignPutDto;

      if (!presign?.uploadUrl || !presign?.objectKey) {
        throw new Error('Presign upload thất bại (thiếu uploadUrl/objectKey).');
      }

      // 3) upload PUT
      await uploadBlobToPresignedUrl(presign.uploadUrl, blob, contentType);
      setLastObjectKey(presign.objectKey);

      // 4) analyze
      const analyzeRes = await api.post('/nutrition/analyze', {
        objectKey: presign.objectKey,
      });
      const data = analyzeRes.data?.data as NutritionAnalyzeDto;

      if (!data?.isFood) {
        await resetScan({ silentCancel: true });
        Alert.alert(
          'Không nhận diện được',
          data?.message ||
            'Vật thể không phải món ăn. Vui lòng đưa món ăn vào khung và thử lại.',
        );
        return;
      }

      const rawCandidates = (data.candidates || []).filter(
        Boolean,
      ) as NutritionCandidateDto[];
      setCandidateCodes(rawCandidates.map(c => c.code).filter(Boolean));

      if (data.primaryCandidate) {
        const fa = buildFoodAnalysis(data.primaryCandidate);

        setResultMode('high');
        setResult(fa);
        setCandidates([]);
        setSelectedFoodCode(data.primaryCandidate.code);
        setSelectedConfidence(
          typeof data.primaryCandidate.score === 'number'
            ? data.primaryCandidate.score
            : null,
        );
        setShowResult(true);
      } else {
        // medium: show list candidate, chưa chọn result
        const list = rawCandidates.map(buildFoodAnalysis);

        setResultMode('medium');
        setCandidates(list);
        setResult(null);

        setSelectedFoodCode(null);
        setSelectedConfidence(null);

        setShowResult(true);
      }
    } catch (e: any) {
      await resetScan({ silentCancel: true });
      Alert.alert('Lỗi', e?.message || 'Không thể phân tích ảnh.');
    } finally {
      setIsScanning(false);
    }
  };

  /* ---------------- Actions ---------------- */

  const startScan = async () => {
    if (isScanning) return;

    const res = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
      cameraType: 'back',
    });

    if (res.didCancel) return;

    const asset = res.assets?.[0];
    if (asset) runAnalyzeFromAsset(asset);
  };

  const openLibrary = async () => {
    if (isScanning) return;

    const res = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (res.didCancel) return;

    const asset = res.assets?.[0];
    if (asset) runAnalyzeFromAsset(asset);
  };

  const handleSelectCandidate = (food: FoodAnalysis) => {
    setResult(food);
    setSelectedFoodCode(food.id);

    // lấy confidence từ badge “Tin cậy XX%” (optional)
    const m = (food.badge || '').match(/(\d+)%/);
    if (m?.[1]) setSelectedConfidence(Number(m[1]) / 100);
  };

  const handleAddToLog = async () => {
    if (!selectedFoodCode) {
      Alert.alert(
        'Chưa chọn món',
        'Hãy chọn 1 món trong danh sách trước khi lưu.',
      );
      return;
    }

    try {
      const idempotencyKey = `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;

      await api.post('/nutrition/logs/confirm', {
        foodCode: selectedFoodCode,
        confidence: selectedConfidence ?? undefined,
        source: 'AI_INFERRED',
        idempotencyKey,
        rawRef: lastObjectKey ?? undefined,
      });

      Alert.alert('Đã lưu', 'Đã thêm vào nhật ký.');
      await resetScan({ silentCancel: true });
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể lưu nhật ký.');
    }
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

              {/* tạm dùng nút flash như “mở thư viện” nếu bạn chưa sửa ScanControls */}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={openLibrary}
                disabled={isScanning}
              >
                <Ionicons
                  name="image-outline"
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
                {...({
                  isScanning,
                  bottomSpacing: controlsBottomSpacing,
                  onCapture: startScan,
                  // nếu bạn đã sửa ScanControls để support nút thư viện:
                  onOpenLibrary: openLibrary,
                } as any)}
              />
            )}
          </View>
        </View>

        {/* Result */}
        {showResult && (
          <ResultSheet
            {...({
              bottomInset: Math.max(insets.bottom, theme.spacing.lg),
              onClose: resetScan,
              mode: resultMode,
              result,
              candidates,
              onSelectCandidate: handleSelectCandidate,
              // nếu bạn đã sửa ResultSheet để nút “Thêm vào nhật ký” có onPress:
              onAddToLog: handleAddToLog,
            } as any)}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default CaloriesScanScreen;

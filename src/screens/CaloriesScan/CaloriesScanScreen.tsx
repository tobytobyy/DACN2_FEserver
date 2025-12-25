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
import { theme } from '@assets/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

import { styles, FRAME_SIZE } from './styles';
import { ScanOverlay } from '@components/CaloriesScan/ScanOverlay/ScanOverlay';
import { ScanControls } from '@components/CaloriesScan/ScanControls/ScanControls';
import {
  ResultSheet,
  FoodAnalysis,
} from '@components/CaloriesScan/ResultSheet/ResultSheet';

type Props = NativeStackScreenProps<BrowserStackParamList, 'AiCaloriesScan'>;

const DUMMY_IMAGE =
  'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800&q=80';

const CaloriesScanScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMode, setResultMode] = useState<'high' | 'medium'>('high');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [candidates, setCandidates] = useState<FoodAnalysis[]>([]);

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

  const mockResult: FoodAnalysis = {
    id: '1',
    name: 'Avocado Toast',
    calories: 320,
    badge: 'Độ tin cậy cao',
    macros: [
      { label: 'Protein', value: '12g', color: '#0EA5E9', percentage: 40 },
      { label: 'Carbs', value: '45g', color: '#F59E0B', percentage: 60 },
      { label: 'Fat', value: '18g', color: '#EF4444', percentage: 30 },
    ],
    note: 'Món ăn giàu chất béo lành mạnh và chất xơ.',
  };

  const mockCandidates: FoodAnalysis[] = [
    {
      id: '2',
      name: 'Bánh mì bơ trứng',
      calories: 310,
      badge: 'Tin cậy 78%',
      macros: [
        { label: 'Protein', value: '14g', color: '#0EA5E9', percentage: 45 },
        { label: 'Carbs', value: '38g', color: '#F59E0B', percentage: 55 },
        { label: 'Fat', value: '17g', color: '#EF4444', percentage: 35 },
      ],
      note: 'Có thể là biến thể với trứng luộc.',
    },
    {
      id: '3',
      name: 'Bánh mì bơ cà chua',
      calories: 300,
      badge: 'Tin cậy 76%',
      macros: [
        { label: 'Protein', value: '10g', color: '#0EA5E9', percentage: 32 },
        { label: 'Carbs', value: '44g', color: '#F59E0B', percentage: 62 },
        { label: 'Fat', value: '15g', color: '#EF4444', percentage: 28 },
      ],
      note: 'Thêm cà chua và rau xanh.',
    },
    {
      id: '4',
      name: 'Bánh mì bơ thuần chay',
      calories: 290,
      badge: 'Tin cậy 74%',
      macros: [
        { label: 'Protein', value: '9g', color: '#0EA5E9', percentage: 30 },
        { label: 'Carbs', value: '46g', color: '#F59E0B', percentage: 64 },
        { label: 'Fat', value: '13g', color: '#EF4444', percentage: 26 },
      ],
      note: 'Không có trứng hay sản phẩm từ sữa.',
    },
  ];

  const startScan = () => {
    setIsScanning(true);
    setCapturedImage(DUMMY_IMAGE);

    setTimeout(() => {
      setIsScanning(false);
      const confidenceRoll = Math.random();
      if (confidenceRoll > 0.6) {
        setResultMode('high');
        setResult(mockResult);
        setShowResult(true);
      } else if (confidenceRoll > 0.2) {
        setResultMode('medium');
        setCandidates(mockCandidates);
        setResult(null);
        setShowResult(true);
      } else {
        setShowResult(false);
        setCapturedImage(null);
        Alert.alert(
          'Không nhận diện được',
          'Vật thể không phải món ăn. Vui lòng đưa món ăn vào khung và thử lại.',
        );
      }
    }, 3000);
  };

  const resetScan = () => {
    setIsScanning(false);
    setShowResult(false);
    setCapturedImage(null);
    setResult(null);
    setCandidates([]);
  };

  const handleSelectCandidate = (food: FoodAnalysis) => {
    setResult(food);
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
            mode={resultMode}
            result={result}
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default CaloriesScanScreen;

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
import { theme } from '@assets/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HeartLineIcon from '@assets/icons/svgs/heart_line.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

type Nav = NativeStackNavigationProp<BrowserStackParamList, 'HeartMeasurement'>;

const HeartMeasurementScreen = () => {
  const navigation = useNavigation<Nav>();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);

  // animation tim đập
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isMeasuring) {
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
    }
  }, [isMeasuring, scaleAnim]);

  useEffect(() => {
    if (progress >= 1 && isMeasuring) {
      setIsMeasuring(false);
      const fakeBpm = 78;
      navigation.navigate('HeartResult', { bpm: fakeBpm });
    }
  }, [progress, isMeasuring, navigation]);

  const startMeasurement = () => {
    if (isMeasuring) return;
    setIsMeasuring(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + 0.02, 1);
        if (next >= 1) clearInterval(interval);
        return next;
      });
    }, 100);
  };

  const progressPercent = Math.round(progress * 100);

  // đổi màu viền theo % đo
  const strokeColor =
    progressPercent < 50
      ? '#22C55E' // xanh
      : progressPercent < 80
      ? '#FACC15' // vàng
      : '#DC2626'; // đỏ

  // thông số vòng tròn
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * progressPercent) / 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon width={24} height={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Heart Measurement</Text>
      </View>

      {/* Nội dung */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Vòng đo + icon trái tim */}
          <TouchableOpacity onPress={startMeasurement} disabled={isMeasuring}>
            <View style={styles.circleWrapper}>
              <Svg width={size} height={size}>
                {/* vòng nền */}
                <Circle
                  stroke="#E5E7EB"
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                />
                {/* vòng tiến độ */}
                <Circle
                  stroke={strokeColor}
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation={-90}
                  originX={size / 2}
                  originY={size / 2}
                />
              </Svg>

              {/* trái tim ở giữa */}
              <Animated.View
                style={[
                  styles.heartCenter,
                  {
                    transform: [
                      { translateX: -50 }, // nửa width icon
                      { translateY: -50 }, // nửa height icon
                      { scale: scaleAnim },
                    ],
                  },
                ]}
              >
                <HeartIcon width={100} height={100} color="#DC2626" />
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* Nhịp tim chạy + trạng thái */}
          <View style={styles.heartbeatBox}>
            <HeartLineIcon width={220} height={44} />
            <Text style={styles.bpmText}>
              {isMeasuring
                ? `Đang đo nhịp tim… ${progressPercent}%`
                : 'Nhấn vào trái tim để bắt đầu'}
            </Text>
          </View>

          {/* Hướng dẫn đo */}
          <View style={styles.tipsBox}>
            <HeartIcon width={20} height={20} color="#fff" />
            <View style={styles.tipsTextWrapper}>
              <Text style={styles.tipsTitle}>Hướng dẫn đo nhịp tim:</Text>
              <Text style={styles.tipsText}>
                1. Đặt nhẹ ngón tay lên camera và đèn flash phía sau điện thoại.
              </Text>
              <Text style={styles.tipsText}>
                2. Giữ yên tay trong suốt quá trình đo.
              </Text>
              <Text style={styles.tipsText}>
                3. Không di chuyển hoặc thay đổi vị trí ngón tay.
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
  content: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
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
  heartbeatBox: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  bpmText: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.weight.medium,
    color: theme.colors.primary,
    textAlign: 'center',
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
  tipsTextWrapper: {
    flex: 1,
  },
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
});

export default HeartMeasurementScreen;

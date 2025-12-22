import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import type { CalendarStackParamList } from '@navigation/AppStack/CalendarStack';
import styles from './styles';

/* ======================================================
 * Kiểu navigation cho màn AiAnalysis
 * - Giúp TypeScript bắt lỗi khi navigate/goBack
 * ====================================================== */
type AiAnalysisNavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  'AiAnalysis'
>;

/* ======================================================
 * AiAnalysisScreen
 * - Màn hình phân tích dữ liệu bằng AI (theo ngày)
 * - Được mở từ CalendarScreen
 * ====================================================== */
const AiAnalysisScreen: React.FC = () => {
  const navigation = useNavigation<AiAnalysisNavigationProp>();

  return (
    <View style={styles.container}>
      {/* ================= Header ================= */}
      {/* Header custom với nút Back */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon width={24} height={24} color="#2D8C83" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AI Analysis</Text>
      </View>

      {/* ================= Content ================= */}
      {/* Nội dung chính của màn hình */}
      <View style={styles.content}>
        <Text style={styles.text}>AI Analysis Screen (đang phát triển)</Text>
      </View>
    </View>
  );
};

export default AiAnalysisScreen;

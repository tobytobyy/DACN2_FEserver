import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/svgs/arrow_left_2424.svg';
import HeartIcon from '../../assets/icons/svgs/heart.svg';
import AiIcon from '../../assets/icons/svgs/ai_icon_1111.svg';
import VerifyIcon from '../../assets/icons/svgs/verify_1515.svg';
import ThunderIcon from '../../assets/icons/svgs/thunder_2424.svg';
import { theme } from '../../assets/theme';
import type { BrowserStackParamList } from '@navigation/AppStack/BrowserStack';

type Nav = NativeStackNavigationProp<BrowserStackParamList, 'HeartResult'>;
type Route = RouteProp<BrowserStackParamList, 'HeartResult'>;

const HeartResultScreen = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { bpm } = route.params;

  let status = '';
  let insight = '';
  let recommended: string[] = [];
  let avoid: string[] = [];
  let statusColor: string = theme.colors.primary;

  if (bpm < 60) {
    status = 'Thấp';
    statusColor = '#FACC15';
    insight =
      'Nhịp tim hơi thấp, có thể do cơ thể mệt mỏi hoặc thiếu năng lượng.';
    recommended = [
      'Uống nước ấm, ăn nhẹ như cháo loãng, súp rau.',
      'Ăn trái cây giàu vitamin C: cam, quýt, táo.',
      'Ăn thực phẩm giàu sắt: thịt bò nạc, rau chân vịt.',
      'Ngủ đủ giấc và nghỉ ngơi hợp lý.',
    ];
    avoid = [
      'Đồ uống có caffeine: cà phê, trà đặc.',
      'Đồ ăn nhanh nhiều dầu mỡ.',
      'Thức khuya hoặc làm việc quá sức.',
    ];
  } else if (bpm <= 100) {
    status = 'Bình thường';
    statusColor = '#22C55E';
    insight =
      'Nhịp tim lý tưởng cho trạng thái nghỉ ngơi, phản ánh sức khỏe tim mạch tốt.';
    recommended = [
      'Uống thêm 1 cốc nước lọc hoặc nước ấm.',
      'Ăn rau xanh, cá hồi, hạt óc chó để tốt cho tim.',
      'Ăn trái cây tươi: chuối, dâu tây, nho.',
      'Tập thể dục nhẹ: đi bộ, yoga.',
    ];
    avoid = [
      'Caffeine quá mức (cà phê, nước tăng lực).',
      'Ăn mặn nhiều muối.',
      'Đồ ăn nhiều đường: bánh ngọt, nước ngọt.',
    ];
  } else {
    status = 'Cao';
    statusColor = '#DC2626';
    insight =
      'Nhịp tim cao hơn bình thường, có thể do căng thẳng hoặc vận động trước đó.';
    recommended = [
      'Ngồi nghỉ ngơi trong không gian yên tĩnh.',
      'Uống nước mát hoặc nước lọc.',
      'Ăn thực phẩm giúp giảm nhịp tim: yến mạch, rau xanh, quả bơ.',
      'Ăn trái cây mát: dưa hấu, cam, lê.',
    ];
    avoid = [
      'Đồ uống có cồn, nước ngọt có ga.',
      'Đồ ăn cay nóng: ớt, tiêu.',
      'Thịt đỏ quá nhiều.',
      'Môi trường ồn ào, áp lực.',
    ];
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HeartMeasurement')}
        >
          <ArrowLeftIcon width={24} height={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả đo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card kết quả */}
        <View style={styles.resultCard}>
          <HeartIcon width={40} height={40} color={statusColor} />
          <Text style={[styles.bpm, { color: statusColor }]}>{bpm} BPM</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            • {status}
          </Text>
        </View>

        {/* Nhận xét */}
        <View style={styles.insightCard}>
          <View style={styles.sectionHeader}>
            <AiIcon width={20} height={20} />
            <Text style={styles.sectionTitle}>Nhận xét sức khỏe</Text>
          </View>
          <Text style={styles.insight}>{insight}</Text>
        </View>

        {/* Nên làm */}
        <View style={styles.recommendCard}>
          <View style={styles.sectionHeader}>
            <VerifyIcon width={20} height={20} />
            <Text style={styles.sectionTitle}>Nên làm</Text>
          </View>
          {recommended.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>

        {/* Tránh lúc này */}
        <View style={styles.avoidCard}>
          <View style={styles.sectionHeader}>
            <ThunderIcon width={20} height={20} />
            <Text style={styles.sectionTitle}>Tránh làm lúc này</Text>
          </View>
          {avoid.map((item, i) => (
            <Text key={i} style={styles.listItem}>
              • {item}
            </Text>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Phân tích này được tạo bởi AI nhằm mục đích tham khảo và không thay
          thế tư vấn y tế chuyên nghiệp.
        </Text>

        {/* Nút quay lại */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.navigate('HeartMeasurement')}
        >
          <Text style={styles.doneText}>Quay lại đo</Text>
        </TouchableOpacity>
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
    elevation: 3,
  },
  backButton: { marginRight: theme.spacing.sm },
  headerTitle: {
    fontSize: theme.fonts.size.lg,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
    // bỏ gap để tránh warning
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.md,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },
  bpm: { fontSize: 36, fontFamily: theme.fonts.poppins.bold },
  status: { fontSize: theme.fonts.size.md, marginTop: theme.spacing.xs },
  insightCard: {
    backgroundColor: '#E0F2FE',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  insight: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    color: theme.colors.text,
  },
  recommendCard: {
    backgroundColor: '#DCFCE7',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    elevation: 1,
    marginTop: theme.spacing.md,
  },
  avoidCard: {
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    elevation: 1,
    marginTop: theme.spacing.md,
  },
  listItem: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,

    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    marginBottom: 4,
  },
  note: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.regular,
    color: theme.colors.subText_1,
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  doneButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    alignItems: 'center',
    elevation: 2,
  },
  doneText: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
  },
});

export default HeartResultScreen;

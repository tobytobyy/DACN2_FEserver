import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import VerifyIcon from '@assets/icons/svgs/verify_1515.svg';
import AiIcon from '@assets/icons/svgs/ai_icon_1111.svg';
import type { CalendarStackParamList } from '@navigation/AppStack/CalendarStack';
import { api } from '../../../services/api';
import styles from './styles';

type AiAnalysisNavigationProp = NativeStackNavigationProp<
  CalendarStackParamList,
  'AiAnalysis'
>;

type AiAnalysisRouteProp = RouteProp<CalendarStackParamList, 'AiAnalysis'>;

type DailyAiAnalysis = {
  readinessScore: number;
  summary: string;
  targetUsers: string[];
  missingForHealthApp: string[];
  optimizations: string[];
  actionPlan: string[];
  disclaimer: string;
};

const fallbackAnalysis: DailyAiAnalysis = {
  readinessScore: 78,
  summary:
    'AI đang chạy ở chế độ local: dữ liệu hiện tại đủ để đưa ra gợi ý sức khỏe cơ bản nhưng cần đồng bộ thiết bị thật để chính xác hơn.',
  targetUsers: [
    'Người bận rộn muốn theo dõi sức khỏe hằng ngày trong một app.',
    'Người kiểm soát cân nặng cần ước tính calories từ ảnh món ăn.',
    'Người mới tập luyện cần gợi ý dễ hiểu và có cảnh báo an toàn.',
  ],
  missingForHealthApp: [
    'Thiếu dữ liệu nhịp tim/giấc ngủ thật từ wearable hoặc HealthKit/Google Fit.',
    'Thiếu nhật ký calories theo ngày, chỉnh khẩu phần và phản hồi độ chính xác AI.',
    'Thiếu phân quyền dữ liệu y tế, chính sách bảo mật và cảnh báo cấp cứu rõ ràng.',
  ],
  optimizations: [
    'Ưu tiên cache offline cho dashboard và nhật ký sức khỏe.',
    'Hiển thị confidence, khẩu phần và macro khi nhận diện món ăn.',
    'Thêm feedback sau trải nghiệm để cải thiện model và UI.',
  ],
  actionPlan: [
    'Đi bộ nhẹ 10 phút sau bữa ăn nếu chưa đạt mục tiêu bước chân.',
    'Uống nước theo từng khung giờ nhỏ thay vì uống dồn cuối ngày.',
    'Giữ lịch ngủ ổn định và tránh caffeine trước giờ ngủ.',
  ],
  disclaimer:
    'Thông tin AI chỉ để tham khảo sức khỏe tổng quát, không thay thế chẩn đoán hoặc điều trị y tế.',
};

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <VerifyIcon width={18} height={18} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {items.map(item => (
      <Text key={item} style={styles.listItem}>
        • {item}
      </Text>
    ))}
  </View>
);

const AiAnalysisScreen: React.FC = () => {
  const navigation = useNavigation<AiAnalysisNavigationProp>();
  const route = useRoute<AiAnalysisRouteProp>();
  const { selectedDate } = route.params;

  const [analysis, setAnalysis] = useState<DailyAiAnalysis>(fallbackAnalysis);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.post('/ai/daily-analysis', {
          date: selectedDate,
        });
        setAnalysis(res.data?.data ?? fallbackAnalysis);
      } catch (error) {
        console.warn('AI daily analysis fallback:', error);
        setAnalysis(fallbackAnalysis);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [selectedDate]);

  const submitFeedback = async () => {
    setIsSendingFeedback(true);
    try {
      await api.post('/ai/feedback', {
        rating,
        comment,
        context: 'daily-ai-analysis',
        selectedDate,
      });
      setComment('');
      Alert.alert('Cảm ơn bạn', 'Feedback đã được ghi nhận để cải thiện AI.');
    } catch {
      Alert.alert('Chưa gửi được', 'Vui lòng thử lại sau.');
    } finally {
      setIsSendingFeedback(false);
    }
  };

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

        <Text style={styles.headerTitle}>AI Health Analysis</Text>
      </View>

      {/* ================= Content ================= */}
      {/* Nội dung chính của màn hình */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTitleRow}>
            <AiIcon width={20} height={20} />
            <Text style={styles.heroTitle}>Phân tích ngày {selectedDate}</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator color="#0EA5E9" />
          ) : (
            <>
              <Text style={styles.score}>{analysis.readinessScore}/100</Text>
              <Text style={styles.summary}>{analysis.summary}</Text>
            </>
          )}
        </View>

        <Section title="Đối tượng app hướng tới" items={analysis.targetUsers} />
        <Section
          title="Còn thiếu để đạt chuẩn app sức khỏe"
          items={analysis.missingForHealthApp}
        />
        <Section title="Nên tối ưu tiếp" items={analysis.optimizations} />
        <Section title="Kế hoạch gợi ý hôm nay" items={analysis.actionPlan} />

        <View style={styles.feedbackCard}>
          <Text style={styles.sectionTitle}>Feedback sau trải nghiệm</Text>
          <Text style={styles.feedbackHint}>
            Chấm điểm AI và giao diện để đội phát triển ưu tiên cải thiện.
          </Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map(value => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.ratingButton,
                  rating === value && styles.ratingButtonActive,
                ]}
                onPress={() => setRating(value)}
              >
                <Text
                  style={[
                    styles.ratingText,
                    rating === value && styles.ratingTextActive,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Bạn thấy AI nhận xét đã hữu ích chưa?"
            placeholderTextColor="#94A3B8"
            style={styles.feedbackInput}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            disabled={isSendingFeedback}
            onPress={submitFeedback}
          >
            <Text style={styles.submitButtonText}>
              {isSendingFeedback ? 'Đang gửi...' : 'Gửi feedback'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>{analysis.disclaimer}</Text>
      </ScrollView>
    </View>
  );
};

export default AiAnalysisScreen;

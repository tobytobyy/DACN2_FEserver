import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '@components/CaloriesScan/styles';
import { theme } from '@assets/theme';
import { MacroItem } from '@components/CaloriesScan/MacroItem/MacroItem';

export type FoodMacro = {
  label: string;
  value: string;
  color: string;
  percentage: number;
};

export type FoodAnalysis = {
  id: string;
  name: string;
  calories: number;
  macros: FoodMacro[];
  badge?: string;
  note?: string;
};

type ResultMode = 'high' | 'medium';

type Props = {
  bottomInset: number;
  onClose: () => void;
  mode: ResultMode;
  result: FoodAnalysis | null;
  candidates?: FoodAnalysis[];
  onSelectCandidate?: (food: FoodAnalysis) => void;
  onAddToLog?: () => void;
};

/**
 * Props cho ResultSheet
 * - bottomInset: khoảng padding dưới (dùng cho safe area / bottom sheet)
 * - onClose: callback khi bấm nút đóng
 * - mode: chế độ hiển thị theo mức độ tin cậy
 * - result: dữ liệu món ăn đã chọn (nếu đã xác định)
 * - candidates: danh sách gợi ý khi độ tin cậy trung bình
 * - onSelectCandidate: callback khi chọn món trong danh sách gợi ý
 */

const modeBadge: Record<ResultMode, string> = {
  high: 'Độ tin cậy cao',
  medium: 'Độ tin cậy trung bình',
};

const modeDescription: Record<ResultMode, string> = {
  high: 'Kết quả nhận diện cho thấy mức độ tin cậy cao.',
  medium:
    'Chúng tôi tìm thấy một vài món tương tự. Hãy chọn đúng món để hiển thị chi tiết dinh dưỡng.',
};

/**
 * ResultSheet
 * - Bottom sheet hiển thị kết quả phân tích món ăn
 * - Gồm tên món, calories và macro dinh dưỡng
 */
export const ResultSheet: React.FC<Props> = ({
  bottomInset,
  onClose,
  mode,
  result,
  candidates,
  onSelectCandidate,
  onAddToLog,
}) => {
  const isSelectionMode = mode === 'medium' && !result;

  return (
    <View style={[styles.resultSheet, { paddingBottom: bottomInset }]}>
      {/* Drag handle để gợi ý có thể kéo */}
      <View style={styles.dragHandle} />

      {/* ===== Header ===== */}
      <View style={styles.sheetHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.resultTitle}>
            {result?.name || 'Chọn đúng món ăn'}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {result?.badge || modeBadge[mode]}
            </Text>
          </View>
        </View>

        {/* Nút đóng sheet */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.resultDescription}>{modeDescription[mode]}</Text>

      {/* Danh sách gợi ý khi độ tin cậy trung bình */}
      {isSelectionMode && candidates ? (
        <View style={styles.candidateList}>
          {candidates.map(food => (
            <TouchableOpacity
              key={food.id}
              style={styles.candidateCard}
              onPress={() => onSelectCandidate?.(food)}
            >
              <View style={styles.candidateHeader}>
                <Text style={styles.candidateTitle}>{food.name}</Text>
                <Text style={styles.candidateConfidence}>{food.badge}</Text>
              </View>

              <Text style={styles.candidateMeta}>
                {food.calories} kcal · {food.macros[1].value} carbs
              </Text>
              {food.note ? (
                <Text style={styles.candidateNote}>{food.note}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {/* ===== Calories & Macros ===== */}
      {result ? (
        <>
          <View style={styles.calorieRow}>
            <Text style={styles.calorieValue}>{result.calories}</Text>
            <Text style={styles.calorieUnit}>kcal</Text>
          </View>

          <View style={styles.macroRow}>
            {result.macros.map(macro => (
              <MacroItem
                key={macro.label}
                label={macro.label}
                value={macro.value}
                color={macro.color}
                percentage={macro.percentage}
              />
            ))}
          </View>

          <View style={styles.insightBox}>
            <Ionicons
              name="leaf"
              size={20}
              color="#0284C7"
              style={styles.insightIcon}
            />
            <View style={styles.insightTextWrapper}>
              <Text style={styles.insightTitle}>Gợi ý cải thiện</Text>
              <Text style={styles.insightBody}>
                Bổ sung thêm chất xơ hoặc rau xanh để cân bằng dinh dưỡng và
                giúp no lâu hơn.
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={onAddToLog}>
            <Text style={styles.addButtonText}>Thêm vào nhật ký</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

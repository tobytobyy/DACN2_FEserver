// src/components/FootStepCounting/FootStepBottomCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { theme } from '@assets/theme';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import TrashIcon from '@assets/icons/svgs/trash_1618.svg';

import styles from './styles';

/**
 * Props cho FootStepBottomCard
 * - hasFinished: đã kết thúc buổi đi bộ/chạy hay chưa
 * - isTracking: đang tracking hay đang pause
 * - distanceText: quãng đường đã đi (string format)
 * - timeText: thời gian đã đi
 * - paceText: pace trung bình
 * - steps: số bước chân
 * - calories: lượng calo tiêu thụ
 * - onToggleTracking: start / pause tracking
 * - onReset: reset hoặc xoá kết quả
 */
type Props = {
  hasFinished: boolean;
  isTracking: boolean;
  distanceText: string;
  timeText: string;
  paceText: string;
  steps: number;
  calories: number;
  onToggleTracking: () => void;
  onReset: () => void;
};

/**
 * FootStepBottomCard
 * - Bottom card hiển thị thông tin bước chân
 * - Có 2 trạng thái:
 *   1. Tracking: hiển thị distance + stats + nút start/pause
 *   2. Finished: hiển thị kết quả tổng kết + hành động lưu / xoá
 */
const FootStepBottomCard: React.FC<Props> = ({
  hasFinished,
  isTracking,
  distanceText,
  timeText,
  paceText,
  steps,
  calories,
  onToggleTracking,
  onReset,
}) => {
  return (
    // Container chính của bottom card
    <View style={styles.bottomCard}>
      {/* ScrollView để nội dung có thể cuộn khi màn hình nhỏ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomContent}
      >
        {/* ===================== TRACKING MODE ===================== */}
        {!hasFinished ? (
          <>
            {/* Label DISTANCE */}
            <Text style={styles.distanceLabel}>DISTANCE</Text>

            {/* Giá trị quãng đường */}
            <View style={styles.distanceRow}>
              <Text style={styles.distanceValue}>{distanceText}</Text>
              <Text style={styles.distanceUnit}>km</Text>
            </View>

            {/* Các chỉ số: Time - Footstep - Calo */}
            <View style={styles.statsRow}>
              {/* TIME */}
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>TIME</Text>
                <Text style={styles.statValue}>{timeText}</Text>
              </View>

              {/* FOOTSTEP */}
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FootstepIcon width={14} height={14} />
                  <Text style={styles.statLabelColored}>FOOTSTEP</Text>
                </View>
                <Text style={styles.statValue}>{steps}</Text>
              </View>

              {/* CALO */}
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FireIcon width={14} height={14} />
                  <Text style={styles.statLabelCalo}>CALO</Text>
                </View>
                <Text style={styles.statValue}>{calories}</Text>
              </View>
            </View>

            {/* Nút Start / Pause */}
            <View style={styles.startButtonWrapper}>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  isTracking && styles.startButtonStop, // đổi màu khi pause
                ]}
                onPress={onToggleTracking}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonIcon}>
                  {isTracking ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* ===================== FINISHED MODE ===================== */
          <>
            {/* Thời gian hoàn thành */}
            <View style={styles.resultTopRow}>
              <View style={styles.resultDateRow}>
                <CalendarIcon
                  width={16}
                  height={16}
                  color={theme.colors.text}
                />
                <Text style={styles.resultDateText}>
                  18 Tháng 11, 2023 • 17:30
                </Text>
              </View>
            </View>

            {/* Card kết quả */}
            <View style={styles.resultCard}>
              {/* Header kết quả */}
              <View style={styles.resultHeaderRow}>
                <View>
                  <Text style={styles.resultLabel}>TOTAL</Text>

                  {/* Tổng quãng đường */}
                  <View style={styles.distanceRow}>
                    <Text style={styles.distanceValue}>{distanceText}</Text>
                    <Text style={styles.distanceUnit}>km</Text>
                  </View>
                </View>

                {/* Badge kỷ lục mới */}
                <View style={styles.newRecordBadge}>
                  <Text style={styles.newRecordText}>New record!</Text>
                </View>
              </View>

              {/* Metrics hàng 1 */}
              <View style={styles.resultMetricsRow}>
                <View style={styles.resultMetricItem}>
                  <Text style={styles.resultMetricLabel}>TIME</Text>
                  <Text style={styles.resultMetricValue}>{timeText}</Text>
                </View>

                <View style={styles.resultMetricItem}>
                  <Text style={styles.resultMetricLabel}>CALO</Text>
                  <Text style={styles.resultMetricValue}>{calories}</Text>
                </View>
              </View>

              {/* Metrics hàng 2 */}
              <View style={styles.resultMetricsRow}>
                <View style={styles.resultMetricItem}>
                  <Text style={styles.resultMetricLabel}>PACE TB</Text>
                  <Text style={styles.resultMetricValue}>{paceText}</Text>
                </View>

                <View style={styles.resultMetricItem}>
                  <Text style={styles.resultMetricLabel}>FOOTSTEP</Text>
                  <Text style={styles.resultMetricValue}>{steps}</Text>
                </View>
              </View>

              {/* Action buttons */}
              <View style={styles.resultActionsRow}>
                {/* Xoá kết quả */}
                <TouchableOpacity
                  style={styles.trashButton}
                  onPress={onReset}
                  activeOpacity={0.8}
                >
                  <TrashIcon
                    width={18}
                    height={18}
                    color={theme.colors.danger}
                  />
                </TouchableOpacity>

                {/* Lưu hoạt động (tạm thời reset sau khi save) */}
                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={onReset}
                >
                  <Text style={styles.saveButtonText}>SAVE ACTIVITY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default FootStepBottomCard;

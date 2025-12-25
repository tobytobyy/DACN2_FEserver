import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '@assets/theme';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import TrashIcon from '@assets/icons/svgs/trash_1618.svg';
import styles from './styles';

type Props = {
  hasFinished: boolean;
  isTracking: boolean;
  isPaused: boolean;
  isDisabled?: boolean;
  distanceText: string;
  timeText: string;
  paceText: string;
  steps: number;
  calories: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onReset: () => void;
  onSave: () => void;
};

const FootStepBottomCard: React.FC<Props> = ({
  hasFinished,
  isTracking,
  isPaused,
  isDisabled,
  distanceText,
  timeText,
  paceText,
  steps,
  calories,
  onStart,
  onPause,
  onResume,
  onCancel,
  onReset,
  onSave,
}) => {
  return (
    <View style={styles.bottomCard}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomContent}
      >
        {/* Trạng thái chưa bắt đầu */}
        {!isTracking && !isPaused && !hasFinished && (
          <>
            <Text style={styles.distanceLabel}>DISTANCE</Text>
            <View style={styles.distanceRow}>
              <Text style={styles.distanceValue}>{distanceText}</Text>
              <Text style={styles.distanceUnit}>km</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>TIME</Text>
                <Text style={styles.statValue}>{timeText}</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FootstepIcon width={14} height={14} />
                  <Text style={styles.statLabelColored}>FOOTSTEP</Text>
                </View>
                <Text style={styles.statValue}>{steps}</Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FireIcon width={14} height={14} />
                  <Text style={styles.statLabelCalo}>CALO</Text>
                </View>
                <Text style={styles.statValue}>{calories}</Text>
              </View>
            </View>

            <View style={styles.startButtonWrapper}>
              <TouchableOpacity
                style={[
                  styles.startButton,
                  isDisabled && styles.startButtonDisabled,
                ]}
                onPress={onStart}
                disabled={isDisabled}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonIcon}>▶</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Trạng thái đang tracking */}
        {isTracking && !isPaused && !hasFinished && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={onPause}
              disabled={isDisabled}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonIcon}>⏸</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isDisabled}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonIcon}>✖</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trạng thái paused hoặc finished */}
        {(isPaused || hasFinished) && (
          <>
            <View style={styles.resultTopRow}>
              <View style={styles.resultDateRow}>
                <CalendarIcon
                  width={16}
                  height={16}
                  color={theme.colors.text}
                />
                <Text style={styles.resultDateText}>
                  Hoạt động vừa hoàn thành
                </Text>
              </View>
            </View>

            <View style={styles.resultCard}>
              <View style={styles.resultHeaderRow}>
                <View>
                  <Text style={styles.resultLabel}>TOTAL</Text>
                  <View style={styles.distanceRow}>
                    <Text style={styles.distanceValue}>{distanceText}</Text>
                    <Text style={styles.distanceUnit}>km</Text>
                  </View>
                </View>
                <View style={styles.newRecordBadge}>
                  <Text style={styles.newRecordText}>Excellent!</Text>
                </View>
              </View>

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

              <View style={styles.resultActionsRow}>
                {isPaused && (
                  <TouchableOpacity
                    style={styles.resumeButton}
                    onPress={onResume}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveButtonText}>RESUME</Text>
                  </TouchableOpacity>
                )}

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

                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={onSave}
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

// src/components/FootStepCounting/FootStepBottomCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { theme } from '@assets/theme';
import FootstepIcon from '@assets/icons/svgs/footprint_1515.svg';
import FireIcon from '@assets/icons/svgs/calories_1515.svg';
import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import TrashIcon from '@assets/icons/svgs/trash_1618.svg';

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
    <View style={styles.bottomCard}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomContent}
      >
        {!hasFinished ? (
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
                  isTracking && styles.startButtonStop,
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
          <>
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
                  <Text style={styles.newRecordText}>New record!</Text>
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
                  onPress={onReset} // tạm: save xong reset
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

const styles = StyleSheet.create({
  bottomCard: {
    flex: 0.9,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginTop: -24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  bottomContent: {
    paddingBottom: 120,
  },
  distanceLabel: {
    textAlign: 'center',
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.regular,
    color: theme.colors.subText_1,
    marginBottom: theme.spacing.xs,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  distanceValue: {
    fontSize: 40,
    fontFamily: theme.fonts.poppins.bold,
    fontWeight: theme.fonts.weight.bold as any,
    color: theme.colors.text,
  },
  distanceUnit: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.subText_1,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.subText_1,
    marginBottom: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabelColored: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.primary,
  },
  statLabelCalo: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.danger,
  },
  statValue: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },
  startButtonWrapper: {
    marginTop: theme.spacing.lg * 1.5,
    alignItems: 'center',
  },
  startButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  startButtonStop: {
    backgroundColor: theme.colors.danger,
  },
  startButtonIcon: {
    fontSize: 28,
    color: theme.colors.white,
  },
  resultTopRow: {
    marginBottom: theme.spacing.sm,
  },
  resultDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  resultDateText: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
  },
  resultCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: theme.spacing.lg,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  resultLabel: {
    fontSize: theme.fonts.size.sm,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 4,
  },
  newRecordBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: '#BBF7D0',
    borderRadius: 999,
  },
  newRecordText: {
    fontSize: theme.fonts.size.xs,
    color: '#166534',
    fontFamily: theme.fonts.poppins.bold,
  },
  resultMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  resultMetricItem: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  resultMetricLabel: {
    fontSize: theme.fonts.size.xs,
    color: theme.colors.subText_1,
    fontFamily: theme.fonts.poppins.regular,
    marginBottom: 2,
  },
  resultMetricValue: {
    fontSize: theme.fonts.size.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.poppins.bold,
  },
  resultActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  trashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
  },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.poppins.bold,
  },
});

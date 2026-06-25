import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
  onViewHistory: () => void;
};

const StatDivider = () => <View style={styles.statDivider} />;

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
  onViewHistory,
}) => {
  const isIdle = !isTracking && !isPaused && !hasFinished;
  const isActive = isTracking && !isPaused && !hasFinished;
  const isDoneOrPaused = isPaused || hasFinished;

  return (
    <View style={styles.bottomCard}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomContent}
      >
        <View style={styles.dragHandle} />

        {/* ── IDLE ── */}
        {isIdle && (
          <>
            <View style={styles.metricHero}>
              <Text style={styles.distanceNumber}>{distanceText}</Text>
              <Text style={styles.distanceUnit}>Kilômét</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{timeText}</Text>
                <Text style={styles.statLabel}>Thời gian</Text>
              </View>
              <StatDivider />
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Bước chân</Text>
              </View>
              <StatDivider />
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{calories}</Text>
                <Text style={styles.statLabel}>Kcal</Text>
              </View>
            </View>

            <View style={styles.actionsArea}>
              <TouchableOpacity
                style={[
                  styles.btnPrimary,
                  styles.btnGreen,
                  isDisabled && styles.btnDisabled,
                ]}
                onPress={onStart}
                disabled={isDisabled}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>▶ Bắt đầu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnLink}
                onPress={onViewHistory}
                activeOpacity={0.7}
              >
                <Text style={styles.btnLinkText}>Xem lịch sử hoạt động</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── ACTIVE ── */}
        {isActive && (
          <>
            <View style={styles.metricHero}>
              <Text
                style={[styles.distanceNumber, styles.distanceNumberActive]}
              >
                {distanceText}
              </Text>
              <Text style={styles.distanceUnit}>Kilômét</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{timeText}</Text>
                <Text style={styles.statLabel}>Thời gian</Text>
              </View>
              <StatDivider />
              <View style={styles.statCell}>
                <Text style={styles.statValueAccent}>
                  {steps.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Bước chân</Text>
              </View>
              <StatDivider />
              <View style={styles.statCell}>
                <Text style={styles.statValue}>{calories}</Text>
                <Text style={styles.statLabel}>Kcal</Text>
              </View>
            </View>

            <View style={styles.actionsArea}>
              <TouchableOpacity
                style={[
                  styles.btnPrimary,
                  styles.btnAmber,
                  isDisabled && styles.btnDisabled,
                ]}
                onPress={onPause}
                disabled={isDisabled}
                activeOpacity={0.85}
              >
                <Text style={styles.btnAmberText}>⏸ Tạm dừng</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btnGhost,
                  styles.btnDanger,
                  isDisabled && styles.btnDisabled,
                ]}
                onPress={onCancel}
                disabled={isDisabled}
                activeOpacity={0.85}
              >
                <Text style={styles.btnDangerText}>✕ Hủy hoạt động</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── PAUSED / DONE ── */}
        {isDoneOrPaused && (
          <>
            <View style={styles.metricHero}>
              {hasFinished && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementText}>🏅 Hoàn thành</Text>
                </View>
              )}
              <Text
                style={[
                  styles.distanceNumberSmall,
                  hasFinished && styles.distanceNumberDone,
                ]}
              >
                {distanceText}
              </Text>
              <Text style={styles.distanceUnit}>
                {isPaused && !hasFinished
                  ? 'Kilômét · Đang tạm dừng'
                  : 'Kilômét hôm nay'}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryValue}>{timeText}</Text>
                  <Text style={styles.summaryLabel}>Thời gian</Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text
                    style={
                      hasFinished
                        ? styles.summaryValueAccent
                        : styles.summaryValue
                    }
                  >
                    {steps.toLocaleString()}
                  </Text>
                  <Text style={styles.summaryLabel}>Bước chân</Text>
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryValue}>{paceText}</Text>
                  <Text style={styles.summaryLabel}>Pace TB</Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryValue}>{calories}</Text>
                  <Text style={styles.summaryLabel}>Kcal</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsArea}>
              {/* Paused — not yet saved */}
              {isPaused && !hasFinished && (
                <>
                  <TouchableOpacity
                    style={[styles.btnPrimary, styles.btnGreen]}
                    onPress={onResume}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>▶ Tiếp tục</Text>
                  </TouchableOpacity>
                  <View style={styles.btnPair}>
                    <TouchableOpacity
                      style={[
                        styles.btnGhost,
                        styles.btnAccentGhost,
                        isDisabled && styles.btnDisabled,
                      ]}
                      onPress={onSave}
                      disabled={isDisabled}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnAccentGhostText}>💾 Lưu lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnGhost, styles.btnDanger]}
                      onPress={onReset}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.btnDangerText}>🗑 Xóa</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Done */}
              {hasFinished && (
                <>
                  <TouchableOpacity
                    style={[styles.btnPrimary, styles.btnGreen]}
                    onPress={onViewHistory}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnPrimaryText}>
                      Xem lịch sử hoạt động
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnGhost}
                    onPress={onReset}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.btnGhostText}>Đóng</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default FootStepBottomCard;

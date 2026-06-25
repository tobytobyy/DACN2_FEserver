import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useFootStepHistory } from './index';

const formatDuration = (start: string, end: string) => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const diff = e - s;
  if (isNaN(s) || isNaN(e) || diff <= 0) return '--';
  const m = Math.floor(diff / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  if (m === 0) return `${sec}s`;
  return `${m}p ${sec}s`;
};

const estimateSteps = (distanceKm: number, strideLengthM = 0.78): number =>
  Math.round((distanceKm * 1000) / strideLengthM);

const estimateCalories = (distanceKm: number, kcalPerKm = 50): number =>
  Math.round(distanceKm * kcalPerKm);

const FootStepHistoryUI: React.FC = () => {
  const { workouts, goBack } = useFootStepHistory();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử hoạt động</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyIcon}>🏃</Text>
          <Text style={styles.emptyTitle}>Chưa có hoạt động nào</Text>
          <Text style={styles.emptyText}>
            Bắt đầu theo dõi lộ trình đầu tiên của bạn để xem kết quả tại đây.
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={item => item.id ?? item._id ?? String(item.distanceKm)}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const steps =
              item.steps && item.steps > 0
                ? item.steps
                : estimateSteps(item.distanceKm);
            const calories =
              item.caloriesOut && item.caloriesOut > 0
                ? item.caloriesOut
                : estimateCalories(item.distanceKm);
            const duration =
              item.time?.startAt && item.time?.endAt
                ? formatDuration(item.time.startAt, item.time.endAt)
                : '--';
            const dateStr = item.time?.startAt
              ? new Date(item.time.startAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '--';
            const isWalk = item.workoutType === 'WALK';

            return (
              <View style={styles.card}>
                {/* Card header: type badge + date */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTypeBadge}>
                    <Text>{isWalk ? '🚶' : '🏃'}</Text>
                    <Text style={styles.cardTypeText}>
                      {isWalk ? 'Đi bộ' : item.workoutType}
                    </Text>
                  </View>
                  <Text style={styles.cardDate}>{dateStr}</Text>
                </View>

                {/* Distance hero */}
                <View style={styles.cardDistanceRow}>
                  <Text style={styles.cardDistance}>
                    {item.distanceKm.toFixed(2)}
                  </Text>
                  <Text style={styles.cardDistanceUnit}>km</Text>
                </View>

                {/* Stats row */}
                <View style={styles.cardStatsRow}>
                  <View style={styles.cardStatCell}>
                    <Text style={styles.cardStatValue}>{duration}</Text>
                    <Text style={styles.cardStatLabel}>Thời gian</Text>
                  </View>
                  <View style={styles.cardStatDivider} />
                  <View style={styles.cardStatCell}>
                    <Text style={styles.cardStatValue}>
                      {steps.toLocaleString()}
                    </Text>
                    <Text style={styles.cardStatLabel}>Bước chân</Text>
                  </View>
                  <View style={styles.cardStatDivider} />
                  <View style={styles.cardStatCell}>
                    <Text style={styles.cardStatValue}>{calories}</Text>
                    <Text style={styles.cardStatLabel}>Kcal</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default FootStepHistoryUI;

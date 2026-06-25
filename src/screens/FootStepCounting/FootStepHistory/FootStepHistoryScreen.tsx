import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useFootStepHistory } from './index';

// Hàm tính thời gian đã đi
const formatDuration = (start: string, end: string) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffMs = endTime - startTime;
  if (isNaN(startTime) || isNaN(endTime) || diffMs <= 0) return '--';

  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return `${minutes} phút ${seconds} giây`;
};
// Ước lượng bước chân từ quãng đường (nếu DB chưa có)
const estimateSteps = (distanceKm: number, strideLengthM = 0.8): number => {
  const distanceM = distanceKm * 1000;
  return Math.round(distanceM / strideLengthM);
};

// Ước lượng calories từ quãng đường (nếu DB chưa có)
const estimateCalories = (distanceKm: number, kcalPerKm = 50): number => {
  return Math.round(distanceKm * kcalPerKm);
};
const FootStepHistoryUI: React.FC = () => {
  const { workouts, goBack } = useFootStepHistory();

  return (
    <View style={styles.container}>
      {/* Nút trở về */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backText}>← Trở về</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Lịch sử hoạt động</Text>

      {workouts.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>
            Không có dữ liệu được đo trước đó, vui lòng tiến hành đo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={item => item.id ?? item._id ?? String(item.distanceKm)}
          renderItem={({ item }) => {
            // Nếu steps/calories trong DB = 0 thì tính lại từ distanceKm
            const steps =
              item.steps && item.steps > 0
                ? item.steps
                : estimateSteps(item.distanceKm);

            const calories =
              item.caloriesOut && item.caloriesOut > 0
                ? item.caloriesOut
                : estimateCalories(item.distanceKm);

            return (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {item.workoutType === 'WALK' ? '🚶 Đi bộ' : item.workoutType}
                </Text>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Quãng đường:</Text>
                  <Text style={styles.cardValue}>
                    {item.distanceKm.toFixed(2)} km
                  </Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Thời gian bắt đầu:</Text>
                  <Text style={styles.cardValue}>
                    {item.time?.startAt
                      ? new Date(item.time.startAt).toLocaleString('vi-VN')
                      : '--'}
                  </Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Thời gian kết thúc:</Text>
                  <Text style={styles.cardValue}>
                    {item.time?.endAt
                      ? new Date(item.time.endAt).toLocaleString('vi-VN')
                      : '--'}
                  </Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Thời gian đã đi:</Text>
                  <Text style={styles.cardValue}>
                    {item.time?.startAt && item.time?.endAt
                      ? formatDuration(item.time.startAt, item.time.endAt)
                      : '--'}
                  </Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Calories:</Text>
                  <Text style={styles.cardValue}>{calories} kcal</Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>FootStep:</Text>
                  <Text style={styles.cardValue}>{steps}</Text>
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

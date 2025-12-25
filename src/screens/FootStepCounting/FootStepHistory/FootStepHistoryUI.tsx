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
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
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
                <Text style={styles.cardValue}>{item.caloriesOut} kcal</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>FootStep:</Text>
                <Text style={styles.cardValue}>{item.steps}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FootStepHistoryUI;

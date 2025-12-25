import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import FootStepMapHeader from '@components/FootstepCounting/FootStepMapHeader/FootStepMapHeader';
import FootStepBottomCard from '@components/FootstepCounting/FootStepBottomCard/FootStepBottomCard';
import { useWorkoutTracking } from '../../hooks/useWorkoutTracking';

const FootStepCountingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    isTracking,
    isPaused,
    hasFinished,
    distanceKm,
    elapsedMs,
    stepsTotal,
    caloriesOut,
    avgPaceSecPerKm,
    route,
    start,
    pause,
    resume,
    reset,
    end,
    currentLat,
    currentLng,
  } = useWorkoutTracking();

  const [isProcessing, setIsProcessing] = useState(false);

  const formatTime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    Alert.alert('Xác nhận', 'Bạn muốn hủy và xóa toàn bộ dữ liệu hiện tại?', [
      { text: 'Không' },
      { text: 'Xóa', onPress: reset, style: 'destructive' },
    ]);
  };

  const handleSaveActivity = async () => {
    setIsProcessing(true);
    try {
      await end();
      Alert.alert('Thành công', 'Hoạt động đã được lưu!');
      // Không reset ngay, để Card hiển thị kết quả đã lưu
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu vào CSDL');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewHistory = () => {
    navigation.navigate('WorkoutHistory'); // 👈 chuyển sang màn hình lịch sử
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FootStepMapHeader
        onBack={() => navigation.goBack()}
        currentLat={currentLat ?? undefined}
        currentLng={currentLng ?? undefined}
        routeSample={route}
        isTracking={isTracking || isPaused}
      />
      <FootStepBottomCard
        hasFinished={hasFinished}
        isTracking={isTracking}
        isPaused={isPaused}
        isDisabled={isProcessing}
        distanceText={distanceKm.toFixed(2)}
        timeText={formatTime(elapsedMs)}
        paceText={avgPaceSecPerKm ? `${avgPaceSecPerKm}s/km` : '--'}
        steps={stepsTotal}
        calories={Math.round(caloriesOut)}
        onStart={() => start('WALK')}
        onPause={pause}
        onResume={resume}
        onCancel={handleCancel}
        onReset={reset}
        onSave={handleSaveActivity}
        onViewHistory={handleViewHistory} // 👈 truyền prop mới
      />
    </SafeAreaView>
  );
};

export default FootStepCountingScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#E5E7EB' },
});

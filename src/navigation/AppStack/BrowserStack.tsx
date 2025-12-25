import { createNativeStackNavigator } from '@react-navigation/native-stack';

/* ======================================================
 * Import các Screen trong Browser flow
 * ====================================================== */
import BrowserScreen from '@screens/AppScreen/Browser/BrowserScreen';
import HeartMeasurementScreen from '@screens/HeartMeasurement/HeartMeasurementScreen';
import HeartResultScreen from '@screens/HeartMeasurement/HeartResultScreen';
import CaloriesScanScreen from '@screens/CaloriesScan/CaloriesScanScreen';
import FootStepCountingScreen from '@screens/FootStepCounting/FootStepCountingScreen';
import SleepTrackingScreen from '@screens/SleepTracking/SleepTrackingScreen';
import WaterTrackerScreen from '@screens/WaterTracker/WaterTrackerScreen';
import FootStepHistoryUI from '@screens/FootStepCounting/FootStepHistory/FootStepHistoryScreen';

/* ======================================================
 * 1. Định nghĩa Param List cho Stack
 * - Mỗi screen phải khai báo param (hoặc undefined)
 * - Giúp TypeScript bắt lỗi khi navigate
 * ====================================================== */
export type BrowserStackParamList = {
  /** Màn hình chính (Dashboard / Browser) */
  Browser: undefined;

  /** Đo nhịp tim */
  HeartMeasurement: undefined;

  /** Kết quả đo nhịp tim */
  HeartResult: {
    bpm: number;
  };

  /** Quét calories bằng AI */
  AiCaloriesScan: undefined;

  /** Đếm bước chân */
  FootStepCounting: undefined;

  /** Theo dõi giấc ngủ */
  SleepTracking: undefined;

  /** Theo dõi uống nước */
  WaterTracker: undefined;

  /** Lịch sử đo bước chân */
  WorkoutHistory: undefined;
};

/* ======================================================
 * 2. Khởi tạo Native Stack Navigator
 * ====================================================== */
const Stack = createNativeStackNavigator<BrowserStackParamList>();

/* ======================================================
 * 3. Browser Stack
 * - Gom toàn bộ các screen liên quan tới Health Tracking
 * - headerShown: false (dùng custom header)
 * ====================================================== */
const BrowserStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ẩn header mặc định
      }}
    >
      {/* Dashboard */}
      <Stack.Screen name="Browser" component={BrowserScreen} />

      {/* Heart Rate */}
      <Stack.Screen
        name="HeartMeasurement"
        component={HeartMeasurementScreen}
      />
      <Stack.Screen name="HeartResult" component={HeartResultScreen} />

      {/* Calories Scan */}
      <Stack.Screen name="AiCaloriesScan" component={CaloriesScanScreen} />

      {/* Activity Tracking */}
      <Stack.Screen
        name="FootStepCounting"
        component={FootStepCountingScreen}
      />
      <Stack.Screen name="WorkoutHistory" component={FootStepHistoryUI} />

      <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />

      {/* Water Tracking */}
      <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
    </Stack.Navigator>
  );
};

export default BrowserStack;

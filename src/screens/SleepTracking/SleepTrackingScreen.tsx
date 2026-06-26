import React, { useState } from 'react';
import {
  View,
  StatusBar,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '@components/SleepTracking/styles';
import NightBackground from '@components/SleepTracking/NightBackground/NightBackground';
import SleepHeader from '@components/SleepTracking/SleepHeader/SleepHeader';
import SleepDial from '@components/SleepTracking/SleepDial/SleepDial';
import SleepStages from '@components/SleepTracking/SleepStages/SleepStages';
import WeeklyTrend from '@components/SleepTracking/WeeklyTrend/WeeklyTrend';
import { useSleepData } from './useSleepData';
import LogSleepModal from './LogSleepModal';

const SleepTrackerScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    loading,
    hasData,
    totalSleep,
    score,
    stages,
    weekly,
    estimated,
    reload,
  } = useSleepData();
  const [showLog, setShowLog] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />
      <NightBackground />
      <SleepHeader onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color="#A5F3E0" style={{ marginTop: 40 }} />
        ) : !hasData ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#A5F3E0', fontSize: 16, marginBottom: 16 }}>
              Chưa có dữ liệu giấc ngủ hôm nay
            </Text>
            <Pressable
              onPress={() => setShowLog(true)}
              style={{
                backgroundColor: '#6366F1',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Ghi lại giấc ngủ
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <SleepDial score={score} totalSleep={totalSleep} />
            {estimated ? (
              <Text
                style={{
                  color: '#A5F3E0',
                  textAlign: 'center',
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                * Giai đoạn ngủ là ước lượng từ thời lượng
              </Text>
            ) : null}
            <View style={styles.analysisCard}>
              <SleepStages stages={stages} />
              <WeeklyTrend weeklyData={weekly} />
            </View>
            <Pressable
              onPress={() => setShowLog(true)}
              style={{
                backgroundColor: '#6366F1',
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 16,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Ghi lại giấc ngủ
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <LogSleepModal
        visible={showLog}
        onClose={() => setShowLog(false)}
        onSaved={() => {
          setShowLog(false);
          reload();
        }}
      />
    </View>
  );
};

export default SleepTrackerScreen;

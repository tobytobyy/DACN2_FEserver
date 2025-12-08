import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';

import HeaderSection from '@components/Home/HeaderSection/HeaderSection';
import ActivityCard from '@components/Home/ActivityCard/ActivityCard';
import HeartSleepGrid from '@components/Home/HeartSleepGrid/HeartSleepGrid';
import WaterCard from '@components/Home/WaterCard/WaterCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const [waterAmount, setWaterAmount] = useState(5);

  const handleIncreaseWater = () => setWaterAmount(prev => prev + 1);
  const handleDecreaseWater = () =>
    setWaterAmount(prev => Math.max(0, prev - 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#98F6D6" />

        <HeaderSection />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ActivityCard />
          <HeartSleepGrid />
          <WaterCard
            waterAmount={waterAmount}
            onIncrease={handleIncreaseWater}
            onDecrease={handleDecreaseWater}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDFD',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
    marginTop: 100, // để nội dung trượt xuống dưới header
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // chừa chỗ cho bottom bar
  },
});

export default HomeScreen;

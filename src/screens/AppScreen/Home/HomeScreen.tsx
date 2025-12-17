import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet } from 'react-native';

import HeaderSection from '@components/Home/HeaderSection/HeaderSection';
import ActivityCard from '@components/Home/ActivityCard/ActivityCard';
import HeartSleepGrid from '@components/Home/HeartSleepGrid/HeartSleepGrid';
import WaterCard from '@components/Home/WaterCard/WaterCard';

const HomeScreen: React.FC = () => {
  // WaterCard now manages its own state via hook; no local water state needed

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#98F6D6" />

      {/* Header nằm tuyệt đối ở trên cùng để làm nền */}
      <View style={styles.headerContainer}>
        <HeaderSection />
      </View>

      {/* ScrollView chứa nội dung chính */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ActivityCard />
        <HeartSleepGrid />
        <WaterCard />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Màu nền xám nhạt cho toàn màn hình
  },
  headerContainer: {
    position: 'absolute', // Quan trọng: Để header nằm chìm bên dưới
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    marginTop: 100, // Đẩy nội dung xuống để thẻ Activity chồng lên Header (overlap)
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Chừa khoảng trống lớn cho Bottom Tab Bar
    paddingTop: 10,
  },
});

export default HomeScreen;

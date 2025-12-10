import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

// --- IMPORT SVG ICONS TỪ ASSETS ---
// Sử dụng alias @assets như cấu hình dự án của bạn
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import ClockIcon from '@assets/icons/svgs/clock_1818.svg';
import ChartIcon from '@assets/icons/svgs/cloud_2015.svg';
import ZapIcon from '@assets/icons/svgs/thunder_2424.svg';

const SleepTracker = () => {
  const navigation = useNavigation();

  // Dữ liệu giả lập
  const sleepData = {
    totalSleep: '7h 42m',
    score: 85,
    quality: 'Excellent',
    bedTime: '23:15',
    wakeTime: '06:57',
    stages: {
      deep: '1h 30m', // 20%
      light: '4h 15m', // 55%
      rem: '1h 57m', // 25%
    },
  };

  const weeklyData = [6, 7.5, 5, 8, 7, 7.5, 6.5]; // Hours

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#312E81" />

      {/* Decorative Background for Night Vibe */}
      <View style={styles.headerBackground}>
        <View style={[styles.star, { top: 40, left: 40, opacity: 0.7 }]} />
        <View
          style={[
            styles.star,
            { top: 80, right: 80, opacity: 0.5, width: 6, height: 6 },
          ]}
        />
        <View style={[styles.star, { top: 160, left: '50%', opacity: 0.6 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()} // 👈 back về màn trước (Browser)
          // nếu muốn luôn nhảy về route "Browser" cụ thể:
          // onPress={() => navigation.navigate('Browser')}
        >
          <ArrowLeftIcon width={24} height={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sleep Tracker</Text>

        <TouchableOpacity style={styles.iconButton}>
          <ChartIcon width={24} height={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }} // Padding bottom để không bị che bởi BottomTabs thật
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Main Sleep Dial */}
        <View style={styles.dialContainer}>
          {/* Outer Glow Simulation */}
          <View style={styles.dialGlow} />

          <View style={styles.dialWrapper}>
            <Svg
              width={256}
              height={256}
              viewBox="0 0 256 256"
              style={{ transform: [{ rotate: '-90deg' }] }}
            >
              {/* Background Ring */}
              <Circle
                cx="128"
                cy="128"
                r="110"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="15"
                fill="none"
              />
              {/* Progress Ring - Giả lập 85% */}
              <Circle
                cx="128"
                cy="128"
                r="110"
                stroke="#A5F3E0"
                strokeWidth="15"
                fill="none"
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={2 * Math.PI * 110 * (1 - 0.85)}
                strokeLinecap="round"
              />
            </Svg>

            {/* Center Content */}
            <View style={styles.dialContent}>
              <MoonIcon width={32} height={32} color="#A5F3E0" fill="#A5F3E0" />
              <Text style={styles.totalSleepText}>{sleepData.totalSleep}</Text>
              <Text style={styles.scoreText}>
                Sleep Score:{' '}
                <Text style={{ fontWeight: 'bold', color: '#FFF' }}>
                  {sleepData.score}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Schedule Info */}
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleCard}>
            <View>
              <Text style={styles.scheduleLabel}>BEDTIME</Text>
              <Text style={styles.scheduleValue}>{sleepData.bedTime}</Text>
            </View>
            <MoonIcon width={24} height={24} color="#818CF8" fill="#818CF8" />
          </View>
          <View style={styles.scheduleCard}>
            <View>
              <Text style={styles.scheduleLabel}>WAKE UP</Text>
              <Text style={styles.scheduleValue}>{sleepData.wakeTime}</Text>
            </View>
            <ClockIcon width={24} height={24} color="#A5F3E0" fill="#A5F3E0" />
          </View>
        </View>

        {/* 3. Sleep Stages Analysis */}
        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <ZapIcon width={20} height={20} color="#6366F1" fill="#6366F1" />
            <Text style={styles.cardTitle}>Sleep Stages</Text>
          </View>

          {/* Stages Bars */}
          <View style={{ gap: 16 }}>
            {/* Deep Sleep */}
            <View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageLabel}>Deep Sleep</Text>
                <Text style={styles.stageValue}>{sleepData.stages.deep}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '20%', backgroundColor: '#4338CA' },
                  ]}
                />
              </View>
            </View>
            {/* Light Sleep */}
            <View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageLabel}>Light Sleep</Text>
                <Text style={styles.stageValue}>{sleepData.stages.light}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '55%', backgroundColor: '#818CF8' },
                  ]}
                />
              </View>
            </View>
            {/* REM */}
            <View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageLabel}>REM</Text>
                <Text style={styles.stageValue}>{sleepData.stages.rem}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '25%', backgroundColor: '#C084FC' },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Weekly Trend Mini-Chart */}
          <View style={styles.trendContainer}>
            <View style={[styles.cardHeader, { marginBottom: 16 }]}>
              <Text style={styles.cardTitle}>Weekly Trend</Text>
              <Text style={styles.subText}>Last 7 Days</Text>
            </View>
            <View style={styles.chartRow}>
              {weeklyData.map((h, i) => (
                <View key={i} style={styles.chartColumn}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: (h / 10) * 80,
                        backgroundColor: i === 3 ? '#312E81' : '#E0E7FF',
                      },
                    ]}
                  />
                  <Text style={styles.chartLabel}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '55%',
    backgroundColor: '#312E81',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50, // Adjust for status bar
    marginBottom: 24,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  // Main Dial
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  dialGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 100,
    transform: [{ scale: 1.2 }],
  },
  dialWrapper: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  totalSleepText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  scoreText: {
    color: '#C7D2FE',
    fontSize: 14,
    marginTop: 4,
  },
  // Schedule
  scheduleRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  scheduleCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scheduleLabel: {
    color: '#C7D2FE',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  scheduleValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Analysis Card
  analysisCard: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subText: {
    fontSize: 12,
    color: '#6B7280',
  },
  stageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stageValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Trend Chart
  trendContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  chartColumn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  chartBar: {
    width: '100%',
    maxWidth: 24,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
});

export default SleepTracker;

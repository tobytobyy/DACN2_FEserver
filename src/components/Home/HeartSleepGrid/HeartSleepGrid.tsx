// src/screens/HomeScreen/components/HeartSleepGrid.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeartIcon from '@assets/icons/svgs/heart.svg';
import PulseLine from '@assets/icons/svgs/heart_beat_2022.svg';
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';

const CARD_WIDTH = (Dimensions.get('window').width - 40 - 15) / 2;

const HeartCard: React.FC = () => {
  return (
    <View style={styles.smallCard}>
      <View
        style={[
          styles.cardCircleDecor,
          {
            backgroundColor: '#DF394C',
            opacity: 0.2,
            right: -20,
            top: -20,
            width: 80,
            height: 80,
            borderRadius: 40,
          },
        ]}
      />
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: '#F7DDDF' }]}>
          <HeartIcon
            color="#DF394C"
            fill="#DF394C"
            width="20px"
            height="20px"
          />
        </View>
        <Text style={styles.smallCardTitle}>Heart beat</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>78</Text>
        <Text style={styles.smallUnit}> BPM</Text>
      </View>
      <View style={styles.statusRow}>
        <PulseLine color="#10B981" fill="#10B981" />
        <Text style={[styles.statusText, { color: '#10B981' }]}>Normal</Text>
      </View>
    </View>
  );
};

const SleepCard: React.FC = () => {
  return (
    <View style={styles.smallCard}>
      <View
        style={[
          styles.cardCircleDecor,
          {
            backgroundColor: '#6366F1',
            opacity: 0.2,
            right: -30,
            top: -30,
            width: 100,
            height: 100,
            borderRadius: 50,
          },
        ]}
      />
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: '#E0E0FC' }]}>
          <MoonIcon color="#6366F1" fill="#6366F1" width="20px" height="20px" />
        </View>
        <Text style={styles.smallCardTitle}>Sleep</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.bigValue}>
          7<Text style={{ fontSize: 18 }}>h</Text> 20
        </Text>
      </View>
      <Text style={styles.targetLabel}>Target: 8h</Text>
    </View>
  );
};

const HeartSleepGrid: React.FC = () => {
  return (
    <View style={styles.gridContainer}>
      <HeartCard />
      <SleepCard />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  smallCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    height: 160,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  cardCircleDecor: {
    position: 'absolute',
    opacity: 0.5,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bigValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  smallUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  targetLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

export default HeartSleepGrid;
